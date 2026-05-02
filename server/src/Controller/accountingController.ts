import { Request, Response } from "express";
import { db } from "../db/index.js";
import {
    TBL_JOURNAL_DTL,
    TBL_ACCOUNTS_LEDGER_MASTER,
    TBL_ACCOUNTS_LEDGER_GROUP_MASTER,
    TBL_JOURNAL_HDR,
    TBL_TRIAL_BALANCE_HDR,
    TBL_TRIAL_BALANCE_DTL
} from "../db/schema/index.js";
import { eq, sql, desc, and, like } from "drizzle-orm";
import { createJournalEntry } from "../utils/accountingUtils.js";

/**
 * Fetches the Trial Balance data
 * Calculates total debits and credits per ledger
 */
export const getTrialBalance = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId ? Number(req.query.companyId) : null;

        const results = await db.select({
            ledgerId: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID,
            ledgerName: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME,
            ledgerType: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_TYPE,
            groupId: TBL_ACCOUNTS_LEDGER_GROUP_MASTER.LEDGER_GROUP_ID,
            groupName: TBL_ACCOUNTS_LEDGER_GROUP_MASTER.LEDGER_GROUP_NAME,
            totalDebit: sql<string>`COALESCE(SUM(${TBL_JOURNAL_DTL.DEBIT}), 0)`,
            totalCredit: sql<string>`COALESCE(SUM(${TBL_JOURNAL_DTL.CREDIT}), 0)`
        })
            .from(TBL_ACCOUNTS_LEDGER_MASTER)
            .leftJoin(TBL_ACCOUNTS_LEDGER_GROUP_MASTER, eq(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_GROUP_ID, TBL_ACCOUNTS_LEDGER_GROUP_MASTER.LEDGER_GROUP_ID))
            .leftJoin(TBL_JOURNAL_DTL, eq(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID, TBL_JOURNAL_DTL.LEDGER_ID))
            .where(companyId ? eq(TBL_ACCOUNTS_LEDGER_MASTER.Company_id, companyId) : undefined)
            .groupBy(
                TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID,
                TBL_ACCOUNTS_LEDGER_GROUP_MASTER.LEDGER_GROUP_ID
            );

        // Process data for the UI (calculate closing balances)
        const trialBalance = results.map(row => {
            const dr = Number(row.totalDebit);
            const cr = Number(row.totalCredit);
            const balance = dr - cr;

            return {
                ...row,
                debit: dr,
                credit: cr,
                closingBalance: balance,
                balanceType: balance >= 0 ? "Dr" : "Cr"
            };
        });

        return res.status(200).json(trialBalance);
    } catch (error) {
        console.error("Trial Balance Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Records an Opening Balance for a Ledger
 */
export const postOpeningBalance = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ledgerId, amount, balanceType, journalDate, companyId, audit } = req.body;

        const result = await db.transaction(async (tx) => {
            const isDebit = balanceType === "Dr";

            // For Opening Balance, we usually offset against an "Opening Balance Equity" account
            // or simply record it as a single-sided entry in a specialized module.
            // Here, we'll follow the double-entry rule:
            // Dr. Ledger / Cr. Opening Balance Equity (or vice-versa)

            // Find or create "Opening Balance Equity" Ledger
            let equityLedger = await tx.select()
                .from(TBL_ACCOUNTS_LEDGER_MASTER)
                .where(eq(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME, "Opening Balance Equity"))
                .limit(1);

            let equityLedgerId: number;
            if (equityLedger.length === 0) {
                const inserted = await tx.insert(TBL_ACCOUNTS_LEDGER_MASTER).values({
                    LEDGER_NAME: "Opening Balance Equity",
                    LEDGER_TYPE: "Equity",
                    Company_id: companyId,
                    STATUS_MASTER: "Active"
                } as any).returning();
                equityLedgerId = inserted[0].LEDGER_ID;
            } else {
                equityLedgerId = equityLedger[0].LEDGER_ID;
            }

            const details = [
                {
                    ledgerId: Number(ledgerId),
                    debit: isDebit ? Number(amount) : 0,
                    credit: !isDebit ? Number(amount) : 0,
                    remarks: "Opening Balance"
                },
                {
                    ledgerId: equityLedgerId,
                    debit: !isDebit ? Number(amount) : 0,
                    credit: isDebit ? Number(amount) : 0,
                    remarks: `Offset for Ledger ID ${ledgerId}`
                }
            ];

            return await createJournalEntry(tx, {
                journalDate: journalDate ? new Date(journalDate) : new Date(),
                companyId: companyId,
                moduleName: "OPENING_BALANCE",
                moduleRefNo: `OB-${ledgerId}`,
                narration: "Initialization of Ledger Balance",
                createdBy: audit?.user || "System"
            }, details);
        });

        return res.status(201).json({ msg: "Opening balance recorded", journalRefNo: result });
    } catch (error: any) {
        console.error("Opening Balance Error:", error);
        return res.status(400).json({ msg: error.message || "Failed to record opening balance" });
    }
};

/**
 * Fetches all Journal Entries (headers list with summary)
 */
export const getJournalEntries = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId ? Number(req.query.companyId) : null;
        const moduleName = req.query.module as string | undefined;

        const data = await db.select({
            journalRefNo: TBL_JOURNAL_HDR.JOURNAL_REF_NO,
            journalDate: TBL_JOURNAL_HDR.JOURNAL_DATE,
            companyId: TBL_JOURNAL_HDR.COMPANY_ID,
            moduleName: TBL_JOURNAL_HDR.MODULE_NAME,
            moduleRefNo: TBL_JOURNAL_HDR.MODULE_REF_NO,
            narration: TBL_JOURNAL_HDR.NARRATION,
            statusEntry: TBL_JOURNAL_HDR.STATUS_ENTRY,
            createdBy: TBL_JOURNAL_HDR.CREATED_BY,
            createdDate: TBL_JOURNAL_HDR.CREATED_DATE,
            lineCount: sql<number>`COUNT(${TBL_JOURNAL_DTL.SNO})`
        })
            .from(TBL_JOURNAL_HDR)
            .leftJoin(TBL_JOURNAL_DTL, eq(TBL_JOURNAL_HDR.JOURNAL_REF_NO, TBL_JOURNAL_DTL.JOURNAL_REF_NO))
            .where(
                companyId && moduleName
                    ? and(eq(TBL_JOURNAL_HDR.COMPANY_ID, companyId), eq(TBL_JOURNAL_HDR.MODULE_NAME, moduleName))
                    : companyId
                        ? eq(TBL_JOURNAL_HDR.COMPANY_ID, companyId)
                        : moduleName
                            ? eq(TBL_JOURNAL_HDR.MODULE_NAME, moduleName)
                            : undefined
            )
            .groupBy(TBL_JOURNAL_HDR.JOURNAL_REF_NO)
            .orderBy(desc(TBL_JOURNAL_HDR.JOURNAL_DATE));

        return res.status(200).json(data);
    } catch (error) {
        console.error("Get Journals Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Fetches a single Journal Entry by Ref No (header + full detail lines)
 */
export const getJournalById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refNo = req.query.id as string;
        if (!refNo) return res.status(400).json({ msg: "Journal ID is required" });

        const header = await db.select()
            .from(TBL_JOURNAL_HDR)
            .where(eq(TBL_JOURNAL_HDR.JOURNAL_REF_NO, refNo))
            .limit(1);

        if (!header.length) {
            return res.status(404).json({ msg: "Journal entry not found" });
        }

        const details = await db.select({
            sno: TBL_JOURNAL_DTL.SNO,
            journalRefNo: TBL_JOURNAL_DTL.JOURNAL_REF_NO,
            ledgerId: TBL_JOURNAL_DTL.LEDGER_ID,
            ledgerName: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME,
            ledgerType: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_TYPE,
            debit: TBL_JOURNAL_DTL.DEBIT,
            credit: TBL_JOURNAL_DTL.CREDIT,
            remarks: TBL_JOURNAL_DTL.REMARKS
        })
            .from(TBL_JOURNAL_DTL)
            .leftJoin(TBL_ACCOUNTS_LEDGER_MASTER, eq(TBL_JOURNAL_DTL.LEDGER_ID, TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID))
            .where(eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, refNo));

        const totalDebit = details.reduce((sum, d) => sum + Number(d.debit), 0);
        const totalCredit = details.reduce((sum, d) => sum + Number(d.credit), 0);

        return res.status(200).json({
            header: header[0],
            details,
            summary: { totalDebit, totalCredit, isBalanced: Math.abs(totalDebit - totalCredit) < 0.01 }
        });
    } catch (error) {
        console.error("Get Journal By Id Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Fetches all Journal Entries for a specific module reference
 * e.g. GET /accounting/journals/module/PURCHASE_INVOICE/PI/26/05/001
 */
export const getJournalsByModule = async (req: Request, res: Response): Promise<Response> => {
    try {
        const moduleName = req.query.module as string;
        const moduleRefNo = req.query.ref as string;

        if (!moduleName || !moduleRefNo) {
            return res.status(400).json({ msg: "Module name and reference are required" });
        }

        const headers = await db.select()
            .from(TBL_JOURNAL_HDR)
            .where(
                and(
                    eq(TBL_JOURNAL_HDR.MODULE_NAME, moduleName),
                    eq(TBL_JOURNAL_HDR.MODULE_REF_NO, moduleRefNo)
                )
            )
            .orderBy(desc(TBL_JOURNAL_HDR.JOURNAL_DATE));

        const result = await Promise.all(
            headers.map(async (hdr) => {
                const details = await db.select({
                    sno: TBL_JOURNAL_DTL.SNO,
                    ledgerId: TBL_JOURNAL_DTL.LEDGER_ID,
                    ledgerName: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME,
                    ledgerType: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_TYPE,
                    debit: TBL_JOURNAL_DTL.DEBIT,
                    credit: TBL_JOURNAL_DTL.CREDIT,
                    remarks: TBL_JOURNAL_DTL.REMARKS
                })
                    .from(TBL_JOURNAL_DTL)
                    .leftJoin(TBL_ACCOUNTS_LEDGER_MASTER, eq(TBL_JOURNAL_DTL.LEDGER_ID, TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID))
                    .where(eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, hdr.JOURNAL_REF_NO));
                return { header: hdr, details };
            })
        );

        return res.status(200).json(result);
    } catch (error) {
        console.error("Get Journals By Module Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Deletes a Journal Entry (header + all detail lines) by Ref No
 */
export const deleteJournal = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refNo = req.query.id as string;
        if (!refNo) return res.status(400).json({ msg: "Journal ID is required" });

        const existing = await db.select({ ref: TBL_JOURNAL_HDR.JOURNAL_REF_NO })
            .from(TBL_JOURNAL_HDR)
            .where(eq(TBL_JOURNAL_HDR.JOURNAL_REF_NO, refNo))
            .limit(1);

        if (!existing.length) {
            return res.status(404).json({ msg: "Journal entry not found" });
        }

        await db.transaction(async (tx) => {
            await tx.delete(TBL_JOURNAL_DTL).where(eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, refNo));
            await tx.delete(TBL_JOURNAL_HDR).where(eq(TBL_JOURNAL_HDR.JOURNAL_REF_NO, refNo));
        });

        return res.status(200).json({ msg: `Journal ${refNo} deleted successfully` });
    } catch (error) {
        console.error("Delete Journal Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
/**
 * Fetches the transaction history for a specific Ledger Account
 */
export const getLedgerReport = async (req: Request, res: Response): Promise<Response> => {
    try {
        const ledgerId = req.query.ledgerId ? Number(req.query.ledgerId) : null;
        const groupId = req.query.groupId ? Number(req.query.groupId) : null;

        if (!ledgerId && !groupId) {
            return res.status(400).json({ msg: "Ledger ID or Group ID is required" });
        }

        let query = db.select({
            journalRefNo: TBL_JOURNAL_DTL.JOURNAL_REF_NO,
            journalDate: TBL_JOURNAL_HDR.JOURNAL_DATE,
            narration: TBL_JOURNAL_HDR.NARRATION,
            moduleName: TBL_JOURNAL_HDR.MODULE_NAME,
            moduleRefNo: TBL_JOURNAL_HDR.MODULE_REF_NO,
            debit: TBL_JOURNAL_DTL.DEBIT,
            credit: TBL_JOURNAL_DTL.CREDIT,
            remarks: TBL_JOURNAL_DTL.REMARKS
        })
            .from(TBL_JOURNAL_DTL)
            .leftJoin(TBL_JOURNAL_HDR, eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, TBL_JOURNAL_HDR.JOURNAL_REF_NO));

        if (ledgerId) {
            query = query.where(eq(TBL_JOURNAL_DTL.LEDGER_ID, ledgerId)) as any;
        } else if (groupId) {
            query = query.innerJoin(TBL_ACCOUNTS_LEDGER_MASTER, eq(TBL_JOURNAL_DTL.LEDGER_ID, TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID))
                .where(eq(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_GROUP_ID, groupId)) as any;
        }

        const data = await query.orderBy(desc(TBL_JOURNAL_HDR.JOURNAL_DATE));

        return res.status(200).json(data);
    } catch (error) {
        console.error("Ledger Report Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Saves a generated Trial Balance as a permanent snapshot
 */
export const saveTrialBalance = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { companyId, financialYear, asOfDate, details, audit } = req.body;

        if (!companyId || !asOfDate || !details || !details.length) {
            return res.status(400).json({ msg: "Company ID, As of Date, and Details are required" });
        }

        const dateCode = new Date(asOfDate).toISOString().split('T')[0].replace(/-/g, '');
        const tbRefNo = `TB-${companyId}-${dateCode}-${Math.floor(1000 + Math.random() * 9000)}`;

        const totalDebit = details.reduce((sum: number, d: any) => sum + Number(d.closingDebit || d.debit || 0), 0);
        const totalCredit = details.reduce((sum: number, d: any) => sum + Number(d.closingCredit || d.credit || 0), 0);

        const result = await db.transaction(async (tx) => {
            // 1. Insert Header
            await tx.insert(TBL_TRIAL_BALANCE_HDR).values({
                TB_REF_NO: tbRefNo,
                AS_OF_DATE: new Date(asOfDate),
                COMPANY_ID: companyId,
                FINANCIAL_YEAR: financialYear || null,
                TOTAL_DEBIT: totalDebit.toString(),
                TOTAL_CREDIT: totalCredit.toString(),
                STATUS_ENTRY: "Finalized",
                CREATED_BY: audit?.user || "System",
                CREATED_IP_ADDRESS: audit?.macAddress || null
            } as any);

            // 2. Insert Details
            const dtlValues = details.map((d: any) => ({
                TB_REF_NO: tbRefNo,
                LEDGER_ID: d.ledgerId,
                OPENING_DEBIT: (d.openingDebit || 0).toString(),
                OPENING_CREDIT: (d.openingCredit || 0).toString(),
                PERIOD_DEBIT: (d.periodDebit || 0).toString(),
                PERIOD_CREDIT: (d.periodCredit || 0).toString(),
                CLOSING_DEBIT: (d.closingDebit || d.debit || 0).toString(),
                CLOSING_CREDIT: (d.closingCredit || d.credit || 0).toString(),
                REMARKS: d.remarks || null
            }));

            await tx.insert(TBL_TRIAL_BALANCE_DTL).values(dtlValues);

            return tbRefNo;
        });

        return res.status(201).json({ msg: "Trial Balance saved successfully", tbRefNo: result });
    } catch (error: any) {
        console.error("Save Trial Balance Error:", error);
        return res.status(500).json({ msg: error.message || "Failed to save trial balance" });
    }
};

/**
 * Fetches all saved Trial Balances (headers)
 */
export const getSavedTrialBalances = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId ? Number(req.query.companyId) : null;

        let query = db.select()
            .from(TBL_TRIAL_BALANCE_HDR);

        if (companyId) {
            query = query.where(eq(TBL_TRIAL_BALANCE_HDR.COMPANY_ID, companyId)) as any;
        }

        const data = await query.orderBy(desc(TBL_TRIAL_BALANCE_HDR.AS_OF_DATE));

        return res.status(200).json(data);
    } catch (error) {
        console.error("Get Saved Trial Balances Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Fetches a specific saved Trial Balance by TB_REF_NO
 */
export const getSavedTrialBalanceById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tbRefNo = req.query.id as string;
        if (!tbRefNo) return res.status(400).json({ msg: "Trial Balance Ref No is required" });

        const header = await db.select()
            .from(TBL_TRIAL_BALANCE_HDR)
            .where(eq(TBL_TRIAL_BALANCE_HDR.TB_REF_NO, tbRefNo))
            .limit(1);

        if (!header.length) {
            return res.status(404).json({ msg: "Trial Balance not found" });
        }

        const details = await db.select({
            sno: TBL_TRIAL_BALANCE_DTL.SNO,
            tbRefNo: TBL_TRIAL_BALANCE_DTL.TB_REF_NO,
            ledgerId: TBL_TRIAL_BALANCE_DTL.LEDGER_ID,
            ledgerName: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME,
            ledgerType: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_TYPE,
            openingDebit: TBL_TRIAL_BALANCE_DTL.OPENING_DEBIT,
            openingCredit: TBL_TRIAL_BALANCE_DTL.OPENING_CREDIT,
            periodDebit: TBL_TRIAL_BALANCE_DTL.PERIOD_DEBIT,
            periodCredit: TBL_TRIAL_BALANCE_DTL.PERIOD_CREDIT,
            closingDebit: TBL_TRIAL_BALANCE_DTL.CLOSING_DEBIT,
            closingCredit: TBL_TRIAL_BALANCE_DTL.CLOSING_CREDIT,
            remarks: TBL_TRIAL_BALANCE_DTL.REMARKS
        })
            .from(TBL_TRIAL_BALANCE_DTL)
            .leftJoin(TBL_ACCOUNTS_LEDGER_MASTER, eq(TBL_TRIAL_BALANCE_DTL.LEDGER_ID, TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID))
            .where(eq(TBL_TRIAL_BALANCE_DTL.TB_REF_NO, tbRefNo));

        return res.status(200).json({
            header: header[0],
            details
        });
    } catch (error) {
        console.error("Get Saved Trial Balance By Id Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Deletes a saved Trial Balance (header + details) by TB_REF_NO
 */
export const deleteSavedTrialBalance = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tbRefNo = req.query.id as string;
        if (!tbRefNo) return res.status(400).json({ msg: "Trial Balance Ref No is required" });

        const existing = await db.select({ ref: TBL_TRIAL_BALANCE_HDR.TB_REF_NO })
            .from(TBL_TRIAL_BALANCE_HDR)
            .where(eq(TBL_TRIAL_BALANCE_HDR.TB_REF_NO, tbRefNo))
            .limit(1);

        if (!existing.length) {
            return res.status(404).json({ msg: "Trial Balance not found" });
        }

        await db.transaction(async (tx) => {
            await tx.delete(TBL_TRIAL_BALANCE_DTL).where(eq(TBL_TRIAL_BALANCE_DTL.TB_REF_NO, tbRefNo));
            await tx.delete(TBL_TRIAL_BALANCE_HDR).where(eq(TBL_TRIAL_BALANCE_HDR.TB_REF_NO, tbRefNo));
        });

        return res.status(200).json({ msg: `Trial Balance ${tbRefNo} deleted successfully` });
    } catch (error) {
        console.error("Delete Saved Trial Balance Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Fetches the Cash Book data
 * Combines transactions for all Cash and Bank ledgers
 */
export const getCashBook = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId ? Number(req.query.companyId) : null;
        const startDate = req.query.startDate ? new Date(req.query.startDate as string) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate as string) : null;

        // 1. Identify Cash and Bank Ledgers
        const ledgers = await db.select({
            id: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID,
            name: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME,
            type: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_TYPE
        })
            .from(TBL_ACCOUNTS_LEDGER_MASTER)
            .where(
                and(
                    companyId ? eq(TBL_ACCOUNTS_LEDGER_MASTER.Company_id, companyId) : undefined,
                    sql`(${TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_TYPE} ILIKE '%Cash%' OR ${TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_TYPE} ILIKE '%Bank%' OR ${TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME} ILIKE '%Cash%' OR ${TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME} ILIKE '%Bank%')`
                )
            );

        if (!ledgers.length) {
            return res.status(200).json({ entries: [], summary: { opening: 0, receipts: 0, payments: 0, closing: 0 } });
        }

        const ledgerIds = ledgers.map(l => l.id);

        // 2. Fetch Opening Balance (transactions before startDate)
        let openingBalance = 0;
        if (startDate) {
            const obResult = await db.select({
                debit: sql<string>`SUM(${TBL_JOURNAL_DTL.DEBIT})`,
                credit: sql<string>`SUM(${TBL_JOURNAL_DTL.CREDIT})`
            })
                .from(TBL_JOURNAL_DTL)
                .innerJoin(TBL_JOURNAL_HDR, eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, TBL_JOURNAL_HDR.JOURNAL_REF_NO))
                .where(
                    and(
                        sql`${TBL_JOURNAL_DTL.LEDGER_ID} IN ${ledgerIds}`,
                        sql`${TBL_JOURNAL_HDR.JOURNAL_DATE} < ${startDate}`
                    )
                );
            openingBalance = Number(obResult[0]?.debit || 0) - Number(obResult[0]?.credit || 0);
        }

        // 3. Fetch Transactions within range
        const entries = await db.select({
            journalRefNo: TBL_JOURNAL_DTL.JOURNAL_REF_NO,
            date: TBL_JOURNAL_HDR.JOURNAL_DATE,
            narration: TBL_JOURNAL_HDR.NARRATION,
            moduleName: TBL_JOURNAL_HDR.MODULE_NAME,
            moduleRefNo: TBL_JOURNAL_HDR.MODULE_REF_NO,
            ledgerId: TBL_JOURNAL_DTL.LEDGER_ID,
            ledgerName: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME,
            debit: TBL_JOURNAL_DTL.DEBIT,
            credit: TBL_JOURNAL_DTL.CREDIT,
            remarks: TBL_JOURNAL_DTL.REMARKS
        })
            .from(TBL_JOURNAL_DTL)
            .innerJoin(TBL_JOURNAL_HDR, eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, TBL_JOURNAL_HDR.JOURNAL_REF_NO))
            .innerJoin(TBL_ACCOUNTS_LEDGER_MASTER, eq(TBL_JOURNAL_DTL.LEDGER_ID, TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID))
            .where(
                and(
                    sql`${TBL_JOURNAL_DTL.LEDGER_ID} IN ${ledgerIds}`,
                    startDate ? sql`${TBL_JOURNAL_HDR.JOURNAL_DATE} >= ${startDate}` : undefined,
                    endDate ? sql`${TBL_JOURNAL_HDR.JOURNAL_DATE} <= ${endDate}` : undefined
                )
            )
            .orderBy(desc(TBL_JOURNAL_HDR.JOURNAL_DATE));

        const totalReceipts = entries.reduce((s, e) => s + Number(e.debit), 0);
        const totalPayments = entries.reduce((s, e) => s + Number(e.credit), 0);

        return res.status(200).json({
            entries,
            summary: {
                opening: openingBalance,
                receipts: totalReceipts,
                payments: totalPayments,
                closing: openingBalance + totalReceipts - totalPayments
            }
        });
    } catch (error) {
        console.error("Cash Book Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Generates a Cash Flow Statement (Indirect Method)
 */
export const getCashFlowStatement = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId ? Number(req.query.companyId) : null;
        const startDate = req.query.startDate ? new Date(req.query.startDate as string) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate as string) : null;

        // Simplified logic for an Indirect Cash Flow:
        // 1. Net Profit = Total Revenue - Total Expense (from journal entries)
        const revenueResult = await db.select({ total: sql<string>`SUM(${TBL_JOURNAL_DTL.CREDIT} - ${TBL_JOURNAL_DTL.DEBIT})` })
            .from(TBL_JOURNAL_DTL)
            .innerJoin(TBL_ACCOUNTS_LEDGER_MASTER, eq(TBL_JOURNAL_DTL.LEDGER_ID, TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID))
            .where(and(eq(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_TYPE, "Revenue"), companyId ? eq(TBL_ACCOUNTS_LEDGER_MASTER.Company_id, companyId) : undefined));
        
        const expenseResult = await db.select({ total: sql<string>`SUM(${TBL_JOURNAL_DTL.DEBIT} - ${TBL_JOURNAL_DTL.CREDIT})` })
            .from(TBL_JOURNAL_DTL)
            .innerJoin(TBL_ACCOUNTS_LEDGER_MASTER, eq(TBL_JOURNAL_DTL.LEDGER_ID, TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID))
            .where(and(eq(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_TYPE, "Expense"), companyId ? eq(TBL_ACCOUNTS_LEDGER_MASTER.Company_id, companyId) : undefined));

        const netProfit = Number(revenueResult[0]?.total || 0) - Number(expenseResult[0]?.total || 0);

        // 2. Adjustments (Non-cash items like Depreciation)
        const depreciation = await db.select({ total: sql<string>`SUM(${TBL_JOURNAL_DTL.DEBIT})` })
            .from(TBL_JOURNAL_DTL)
            .innerJoin(TBL_ACCOUNTS_LEDGER_MASTER, eq(TBL_JOURNAL_DTL.LEDGER_ID, TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID))
            .where(and(like(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME, "%Depreciation%"), companyId ? eq(TBL_ACCOUNTS_LEDGER_MASTER.Company_id, companyId) : undefined));

        // 3. Changes in Working Capital (placeholder logic - usually requires comparing two periods)
        // Here we'll return a structured response that the UI can represent.

        return res.status(200).json({
            operating: {
                netProfit,
                adjustments: [
                    { label: "Depreciation", amount: Number(depreciation[0]?.total || 0) }
                ],
                workingCapital: [
                    { label: "Accounts Receivable", amount: 0 }, // Would require period comparison
                    { label: "Accounts Payable", amount: 0 },
                    { label: "Inventory", amount: 0 }
                ]
            },
            investing: [
                { label: "Purchase of Fixed Assets", amount: 0 }
            ],
            financing: [
                { label: "Proceeds from Loans", amount: 0 }
            ]
        });
    } catch (error) {
        console.error("Cash Flow Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
