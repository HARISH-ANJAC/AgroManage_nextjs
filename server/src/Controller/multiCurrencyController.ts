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
import { createJournalEntry, getSystemLedger } from "../utils/accountingUtils.js";

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

        const results: any[] = [];

        for (const tx of openTransactions) {
            if (!tx.TRANSACTION_CURRENCY_ID) continue;

            await db.transaction(async (dbTx) => {
                // 2. Get the CURRENT rate for this transaction's currency from Exchange Rate Master as of revaluationDate
                const currencyId = tx.TRANSACTION_CURRENCY_ID as number;
                const currentRateRes = await dbTx.select()
                    .from(TBL_EXCHANGE_RATE_MASTER)
                    .where(and(
                        eq(TBL_EXCHANGE_RATE_MASTER.CURRENCY_ID, currencyId),
                        eq(TBL_EXCHANGE_RATE_MASTER.Company_ID, parseInt(companyId)),
                        lt(TBL_EXCHANGE_RATE_MASTER.EFFECTIVE_DATE, new Date(revDate.getTime() + 24 * 60 * 60 * 1000)) // <= revDate essentially
                    ))
                    .orderBy(desc(TBL_EXCHANGE_RATE_MASTER.EFFECTIVE_DATE))
                    .limit(1);

                if (currentRateRes.length === 0) return;
                
                const currentRate = parseFloat(currentRateRes[0].Exchange_Rate || "1");
                const oldRate = parseFloat(tx.EXCHANGE_RATE_USED || "1");
                
                if (currentRate === oldRate) return;

                // 3. Calculate new base amount
                const txAmount = parseFloat(tx.TRANSACTION_AMOUNT || "0");
                const newBaseAmount = txAmount * currentRate;
                const oldBaseAmount = parseFloat(tx.BASE_AMOUNT || "0");
                const diff = newBaseAmount - oldBaseAmount;

                if (Math.abs(diff) < 0.01) return;

                const isAR = ['TAX_INVOICE', 'SALES_INVOICE', 'SALES_ORDER', 'SALES_PROFORMA'].includes(tx.DOCUMENT_TYPE || '');
                const accountType = isAR ? 'AR' : 'AP';

                let isGain = false;
                if (isAR) {
                    isGain = diff > 0; // Asset increased in LC = GAIN
                } else {
                    isGain = diff < 0; // Liability decreased in LC = GAIN
                }

                const glType = isGain ? 'GAIN' : 'LOSS';
                const diffAmt = Math.abs(diff);

                // 4. Record Unrealized GL
                const glEntry = await dbTx.insert(TBL_UNREALIZED_GAIN_LOSS)
                    .values({
                        Company_ID: parseInt(companyId),
                        TRANSACTION_ID: tx.TRANSACTION_ID,
                        ACCOUNT_TYPE: accountType,
                        REVALUATION_DATE: toDateString(revDate),
                        OLD_BASE_AMOUNT: oldBaseAmount.toString(),
                        NEW_BASE_AMOUNT: newBaseAmount.toString(),
                        UNREALIZED_GAIN_LOSS: diffAmt.toString(),
                        GL_TYPE: glType,
                        STATUS: 'ACTIVE',
                        CREATED_BY: 'System-Revaluation',
                        CREATED_DATE: new Date()
                    })
                    .returning();

                // 5. Create Auto JV
                const glAccountId = await getSystemLedger(dbTx, parseInt(companyId), "Unrealized Exchange Gain/Loss", "P&L");
                const partyAccountId = await getSystemLedger(dbTx, parseInt(companyId), isAR ? "Accounts Receivable - FX" : "Accounts Payable - FX", isAR ? "Asset" : "Liability");

                const jvDetails = [];
                if (isGain) {
                    // Gain: Debit AR/AP, Credit P&L
                    jvDetails.push({ ledgerId: partyAccountId, debit: diffAmt, credit: 0, remarks: `Unrealized Gain on ${tx.DOCUMENT_NUMBER}` });
                    jvDetails.push({ ledgerId: glAccountId, debit: 0, credit: diffAmt, remarks: `Unrealized Gain on ${tx.DOCUMENT_NUMBER}` });
                } else {
                    // Loss: Debit P&L, Credit AR/AP
                    jvDetails.push({ ledgerId: glAccountId, debit: diffAmt, credit: 0, remarks: `Unrealized Loss on ${tx.DOCUMENT_NUMBER}` });
                    jvDetails.push({ ledgerId: partyAccountId, debit: 0, credit: diffAmt, remarks: `Unrealized Loss on ${tx.DOCUMENT_NUMBER}` });
                }

                const jvNo = await createJournalEntry(dbTx, {
                    journalDate: revDate,
                    companyId: parseInt(companyId),
                    moduleName: "EXCHANGE_REVALUATION",
                    moduleRefNo: tx.DOCUMENT_NUMBER || `REV-${glEntry[0].GL_ID}`,
                    narration: `Unrealized Exchange ${glType} for ${tx.DOCUMENT_NUMBER}`,
                    createdBy: 'System-Revaluation'
                }, jvDetails);

                await dbTx.update(TBL_UNREALIZED_GAIN_LOSS)
                    .set({ JOURNAL_VOUCHER_NO: jvNo })
                    .where(eq(TBL_UNREALIZED_GAIN_LOSS.GL_ID, glEntry[0].GL_ID));

                results.push({ ...glEntry[0], JOURNAL_VOUCHER_NO: jvNo });
            });
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

/**
 * Get Revaluation History from TBL_UNREALIZED_GAIN_LOSS
 */
export const getRevaluationHistory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId as string;

        let query = db
            .select({
                GL_ID: TBL_UNREALIZED_GAIN_LOSS.GL_ID,
                TRANSACTION_ID: TBL_UNREALIZED_GAIN_LOSS.TRANSACTION_ID,
                ACCOUNT_TYPE: TBL_UNREALIZED_GAIN_LOSS.ACCOUNT_TYPE,
                REVALUATION_DATE: TBL_UNREALIZED_GAIN_LOSS.REVALUATION_DATE,
                OLD_BASE_AMOUNT: TBL_UNREALIZED_GAIN_LOSS.OLD_BASE_AMOUNT,
                NEW_BASE_AMOUNT: TBL_UNREALIZED_GAIN_LOSS.NEW_BASE_AMOUNT,
                UNREALIZED_GAIN_LOSS: TBL_UNREALIZED_GAIN_LOSS.UNREALIZED_GAIN_LOSS,
                GL_TYPE: TBL_UNREALIZED_GAIN_LOSS.GL_TYPE,
                STATUS: TBL_UNREALIZED_GAIN_LOSS.STATUS,
                IS_REVERSED: TBL_UNREALIZED_GAIN_LOSS.IS_REVERSED,
                CREATED_BY: TBL_UNREALIZED_GAIN_LOSS.CREATED_BY,
                CREATED_DATE: TBL_UNREALIZED_GAIN_LOSS.CREATED_DATE,
                JOURNAL_VOUCHER_NO: TBL_UNREALIZED_GAIN_LOSS.JOURNAL_VOUCHER_NO,
                // From joined transaction
                DOCUMENT_TYPE: TBL_MULTI_CURRENCY_TRANSACTIONS.DOCUMENT_TYPE,
                DOCUMENT_NUMBER: TBL_MULTI_CURRENCY_TRANSACTIONS.DOCUMENT_NUMBER,
                DOCUMENT_DATE: TBL_MULTI_CURRENCY_TRANSACTIONS.DOCUMENT_DATE,
                // From joined currency
                CURRENCY_NAME: TBL_CURRENCY_MASTER.CURRENCY_NAME,
            })
            .from(TBL_UNREALIZED_GAIN_LOSS)
            .leftJoin(TBL_MULTI_CURRENCY_TRANSACTIONS, eq(TBL_UNREALIZED_GAIN_LOSS.TRANSACTION_ID, TBL_MULTI_CURRENCY_TRANSACTIONS.TRANSACTION_ID))
            .leftJoin(TBL_CURRENCY_MASTER, eq(TBL_MULTI_CURRENCY_TRANSACTIONS.TRANSACTION_CURRENCY_ID, TBL_CURRENCY_MASTER.CURRENCY_ID))
            .$dynamic();

        if (companyId) {
            query = query.where(eq(TBL_UNREALIZED_GAIN_LOSS.Company_ID, parseInt(companyId)));
        }

        const history = await query.orderBy(desc(TBL_UNREALIZED_GAIN_LOSS.CREATED_DATE));
        return res.status(200).json(history);
    } catch (error: any) {
        console.error("Error fetching revaluation history:", error);
        return res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};

