import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_CURRENCY_MASTER, 
    TBL_EXCHANGE_RATE_MASTER, 
    TBL_MULTI_CURRENCY_TRANSACTIONS,
    TBL_UNREALIZED_GAIN_LOSS,
    TBL_REALIZED_GAIN_LOSS,
    TBL_COMPANY_BASE_CURRENCY,
    TBL_COMPANY_MASTER,
    TBL_EXCHANGE_RATE_USAGE_LOG
} from "../db/schema/index.js";
import { eq, and, sql, desc, lt, getTableColumns } from "drizzle-orm";

const toDateString = (date: Date) => date.toISOString().split('T')[0];

export const getExchangeRates = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId as string;
        
        let query = db.select().from(TBL_EXCHANGE_RATE_MASTER).$dynamic();
        
        if (companyId) {
            query = query.where(eq(TBL_EXCHANGE_RATE_MASTER.Company_ID, parseInt(companyId)));
        }

        const rates = await query;
        return res.status(200).json(rates);
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getMCTransactions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId as string;
        
        let query = db.select({
            TRANSACTION_ID: TBL_MULTI_CURRENCY_TRANSACTIONS.TRANSACTION_ID,
            Company_ID: TBL_MULTI_CURRENCY_TRANSACTIONS.Company_ID,
            DOCUMENT_TYPE: TBL_MULTI_CURRENCY_TRANSACTIONS.DOCUMENT_TYPE,
            DOCUMENT_NUMBER: TBL_MULTI_CURRENCY_TRANSACTIONS.DOCUMENT_NUMBER,
            DOCUMENT_DATE: TBL_MULTI_CURRENCY_TRANSACTIONS.DOCUMENT_DATE,
            TRANSACTION_CURRENCY_ID: TBL_MULTI_CURRENCY_TRANSACTIONS.TRANSACTION_CURRENCY_ID,
            TRANSACTION_AMOUNT: TBL_MULTI_CURRENCY_TRANSACTIONS.TRANSACTION_AMOUNT,
            BASE_AMOUNT: TBL_MULTI_CURRENCY_TRANSACTIONS.BASE_AMOUNT,
            EXCHANGE_RATE_USED: TBL_MULTI_CURRENCY_TRANSACTIONS.EXCHANGE_RATE_USED,
            SETTLED_AMOUNT: TBL_MULTI_CURRENCY_TRANSACTIONS.SETTLED_AMOUNT,
            STATUS: TBL_MULTI_CURRENCY_TRANSACTIONS.STATUS,
            CREATED_DATE: TBL_MULTI_CURRENCY_TRANSACTIONS.CREATED_DATE,
            CURRENCY_NAME: TBL_CURRENCY_MASTER.CURRENCY_NAME,
            CURRENCY_SYMBOL: TBL_CURRENCY_MASTER.ADDRESS // ADDRESS is used as Symbol in this schema
        })
        .from(TBL_MULTI_CURRENCY_TRANSACTIONS)
        .leftJoin(TBL_CURRENCY_MASTER, eq(TBL_MULTI_CURRENCY_TRANSACTIONS.TRANSACTION_CURRENCY_ID, TBL_CURRENCY_MASTER.CURRENCY_ID))
        .$dynamic();
        
        if (companyId) {
            query = query.where(eq(TBL_MULTI_CURRENCY_TRANSACTIONS.Company_ID, parseInt(companyId)));
        }

        const transactions = await query.orderBy(desc(TBL_MULTI_CURRENCY_TRANSACTIONS.CREATED_DATE));
        return res.status(200).json(transactions);
    } catch (error: any) {
        console.error("Error fetching MC transactions:", error);
        return res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};

/**
 * Step 2.3: Synchronize Master Rates from Exchange Rate History
 */
export const updateRatesFromProvider = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { companyId } = req.body;
        if (!companyId) return res.status(400).json({ msg: "Company ID required" });

        // 1. Fetch all currencies
        const currencies = await db.select().from(TBL_CURRENCY_MASTER);

        const updatedCurrencies = [];

        for (const cur of currencies) {
            // 2. Find the LATEST rate in EXCHANGE_RATE_MASTER for this currency and company
            const latestRateEntry = await db.select()
                .from(TBL_EXCHANGE_RATE_MASTER)
                .where(and(
                    eq(TBL_EXCHANGE_RATE_MASTER.CURRENCY_ID, cur.CURRENCY_ID),
                    eq(TBL_EXCHANGE_RATE_MASTER.Company_ID, parseInt(companyId))
                ))
                .orderBy(desc(TBL_EXCHANGE_RATE_MASTER.CREATED_DATE))
                .limit(1);

            if (latestRateEntry.length > 0) {
                // 3. Update the master rate to match the latest historical entry
                await db.update(TBL_CURRENCY_MASTER)
                    .set({ 
                        Exchange_Rate: latestRateEntry[0].Exchange_Rate,
                        MODIFIED_BY: 'System-Sync',
                        MODIFIED_DATE: new Date()
                    })
                    .where(eq(TBL_CURRENCY_MASTER.CURRENCY_ID, cur.CURRENCY_ID));
                
                updatedCurrencies.push({
                    currency: cur.CURRENCY_NAME,
                    rate: latestRateEntry[0].Exchange_Rate
                });
            }
        }

        return res.status(200).json({ 
            msg: "Master rates synchronized from history successfully", 
            syncedCount: updatedCurrencies.length,
            details: updatedCurrencies
        });
    } catch (error) {
        console.error("Error updating rates:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Step 4: Unrealized Gain/Loss Revaluation
 */
export const runRevaluation = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { companyId, revaluationDate } = req.body;
        if (!companyId) return res.status(400).json({ msg: "Company ID required" });
        
        const revDate = revaluationDate ? new Date(revaluationDate) : new Date();

        // 1. Get all open multi-currency transactions for this company
        const openTransactions = await db.select()
            .from(TBL_MULTI_CURRENCY_TRANSACTIONS)
            .where(and(
                eq(TBL_MULTI_CURRENCY_TRANSACTIONS.Company_ID, parseInt(companyId)),
                eq(TBL_MULTI_CURRENCY_TRANSACTIONS.STATUS, 'PENDING')
            ));

        const results = [];

        for (const tx of openTransactions) {
            if (!tx.TRANSACTION_CURRENCY_ID) continue;

            // 2. Get the CURRENT rate for this transaction's currency
            const currentRateRes = await db.select()
                .from(TBL_CURRENCY_MASTER)
                .where(eq(TBL_CURRENCY_MASTER.CURRENCY_ID, tx.TRANSACTION_CURRENCY_ID))
                .limit(1);

            if (currentRateRes.length === 0) continue;
            
            const currentRate = parseFloat(currentRateRes[0].Exchange_Rate || "1");
            const oldRate = parseFloat(tx.EXCHANGE_RATE_USED || "1");
            
            if (currentRate === oldRate) continue;

            // 3. Calculate new base amount
            const txAmount = parseFloat(tx.TRANSACTION_AMOUNT || "0");
            const newBaseAmount = txAmount * currentRate;
            const oldBaseAmount = parseFloat(tx.BASE_AMOUNT || "0");
            const diff = newBaseAmount - oldBaseAmount;

            if (Math.abs(diff) < 0.01) continue;

            const glType = diff > 0 ? 'GAIN' : 'LOSS';

            // 4. Record Unrealized GL
            const glEntry = await db.insert(TBL_UNREALIZED_GAIN_LOSS)
                .values({
                    Company_ID: parseInt(companyId),
                    TRANSACTION_ID: tx.TRANSACTION_ID,
                    ACCOUNT_TYPE: tx.DOCUMENT_TYPE === 'INVOICE' ? 'AR' : 'AP',
                    REVALUATION_DATE: toDateString(revDate),
                    OLD_BASE_AMOUNT: oldBaseAmount.toString(),
                    NEW_BASE_AMOUNT: newBaseAmount.toString(),
                    UNREALIZED_GAIN_LOSS: Math.abs(diff).toString(),
                    GL_TYPE: glType,
                    STATUS: 'ACTIVE',
                    CREATED_BY: 'System-Revaluation',
                    CREATED_DATE: new Date()
                })
                .returning();

            results.push(glEntry[0]);
        }

        return res.status(200).json({ 
            msg: "Revaluation completed", 
            processedCount: results.length,
            details: results 
        });
    } catch (error) {
        console.error("Error running revaluation:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Helper: Record multi-currency transaction
 * To be called from other controllers (Step 3)
 */
export const recordMCTransaction = async (data: {
    companyId: number,
    docType: string,
    docNumber: string,
    docDate: Date,
    currencyId: number,
    amount: number,
    exchangeRate: number,
    baseAmount: number,
    createdBy: string
}) => {
    return await db.insert(TBL_MULTI_CURRENCY_TRANSACTIONS)
        .values({
            Company_ID: data.companyId,
            DOCUMENT_TYPE: data.docType,
            DOCUMENT_NUMBER: data.docNumber,
            DOCUMENT_DATE: toDateString(data.docDate),
            TRANSACTION_CURRENCY_ID: data.currencyId,
            TRANSACTION_AMOUNT: data.amount.toString(),
            BASE_CURRENCY_ID: 1, // Defaulting to 1 for now, should lookup company base
            BASE_AMOUNT: data.baseAmount.toString(),
            EXCHANGE_RATE_USED: data.exchangeRate.toString(),
            ORIGINAL_BASE_AMOUNT: data.baseAmount.toString(),
            STATUS: 'PENDING',
            CREATED_BY: data.createdBy,
            CREATED_DATE: new Date()
        })
        .returning();
};
