import { Request, Response } from "express";
import { db } from "../db/index.js";
import {
    TBL_EXPENSE_HDR,
    TBL_EXPENSE_DTL,
    TBL_EXPENSE_FILES_UPLOAD,
    TBL_COMPANY_MASTER,
    TBL_SUPPLIER_MASTER,
    TBL_ACCOUNTS_HEAD_MASTER,
    TBL_JOURNAL_HDR,
    TBL_JOURNAL_DTL,
    TBL_COST_CENTER_ALLOCATION,
    TBL_COST_CENTER_BUDGET
} from "../db/schema/index.js";
import * as multiCurrencyController from "./multiCurrencyController.js";
import { eq, desc, sql, and, ne, lte, gte } from "drizzle-orm";
import { createJournalEntry, getSystemLedger, getLedgerForSupplier } from "../utils/accountingUtils.js";

export const getExpenses = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            id: TBL_EXPENSE_HDR.SNO,
            expenseRefNo: TBL_EXPENSE_HDR.EXPENSE_REF_NO,
            expenseDate: TBL_EXPENSE_HDR.EXPENSE_DATE,
            companyId: TBL_EXPENSE_HDR.COMPANY_ID,
            companyName: TBL_COMPANY_MASTER.Company_Name,
            expenseAgainst: TBL_EXPENSE_HDR.EXPENSE_AGAINST,
            poRefNo: TBL_EXPENSE_HDR.PO_REF_NO,
            accountHeadId: TBL_EXPENSE_HDR.ACCOUNT_HEAD_ID,
            accountHeadName: TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_NAME,
            supplierId: TBL_EXPENSE_HDR.EXPENSE_SUPPLIER_ID,
            supplierName: TBL_SUPPLIER_MASTER.Supplier_Name,
            expenseType: TBL_EXPENSE_HDR.EXPENSE_TYPE,
            traEfdReceiptNo: TBL_EXPENSE_HDR.TRA_EFD_RECEIPT_NO,
            currencyId: TBL_EXPENSE_HDR.CURRENCY_ID,
            totalExpenseAmount: TBL_EXPENSE_HDR.TOTAL_EXPENSE_AMOUNT,
            status: TBL_EXPENSE_HDR.STATUS_ENTRY,
            remarks: TBL_EXPENSE_HDR.REMARKS,
            createdBy: TBL_EXPENSE_HDR.CREATED_BY,
            createdDate: TBL_EXPENSE_HDR.CREATED_DATE
        })
            .from(TBL_EXPENSE_HDR)
            .leftJoin(TBL_COMPANY_MASTER, eq(TBL_EXPENSE_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
            .leftJoin(TBL_SUPPLIER_MASTER, eq(TBL_EXPENSE_HDR.EXPENSE_SUPPLIER_ID, TBL_SUPPLIER_MASTER.Supplier_Id))
            .leftJoin(TBL_ACCOUNTS_HEAD_MASTER, eq(TBL_EXPENSE_HDR.ACCOUNT_HEAD_ID, TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_ID))
            .orderBy(desc(TBL_EXPENSE_HDR.CREATED_DATE));

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getExpenseById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = decodeURIComponent(req.params.id as string);
        const header = await db.select({
            id: TBL_EXPENSE_HDR.SNO,
            expenseRefNo: TBL_EXPENSE_HDR.EXPENSE_REF_NO,
            expenseDate: TBL_EXPENSE_HDR.EXPENSE_DATE,
            companyId: TBL_EXPENSE_HDR.COMPANY_ID,
            expenseAgainst: TBL_EXPENSE_HDR.EXPENSE_AGAINST,
            poRefNo: TBL_EXPENSE_HDR.PO_REF_NO,
            accountHeadId: TBL_EXPENSE_HDR.ACCOUNT_HEAD_ID,
            expenseSupplierId: TBL_EXPENSE_HDR.EXPENSE_SUPPLIER_ID,
            expenseType: TBL_EXPENSE_HDR.EXPENSE_TYPE,
            traEfdReceiptNo: TBL_EXPENSE_HDR.TRA_EFD_RECEIPT_NO,
            currencyId: TBL_EXPENSE_HDR.CURRENCY_ID,
            exchangeRate: TBL_EXPENSE_HDR.EXCHANGE_RATE,
            totalExpenseAmount: TBL_EXPENSE_HDR.TOTAL_EXPENSE_AMOUNT,
            totalExpenseAmountLc: TBL_EXPENSE_HDR.TOTAL_EXPENSE_AMOUNT_LC,
            remarks: TBL_EXPENSE_HDR.REMARKS,
            status: TBL_EXPENSE_HDR.STATUS_ENTRY,
        })
            .from(TBL_EXPENSE_HDR)
            .where(eq(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id))
            .limit(1);

        if (!header.length) return res.status(404).json({ msg: "Expense not found" });

        const items = await db.select().from(TBL_EXPENSE_DTL).where(eq(TBL_EXPENSE_DTL.EXPENSE_REF_NO, id));
        const filesData = await db.select().from(TBL_EXPENSE_FILES_UPLOAD).where(eq(TBL_EXPENSE_FILES_UPLOAD.EXPENSE_REF_NO, id));
        const processedFiles = filesData.map(f => ({
            ...f,
            CONTENT_DATA: f.CONTENT_DATA ? f.CONTENT_DATA.toString('base64') : null
        }));

        return res.status(200).json({ header: header[0], items, files: processedFiles });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createExpense = async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await db.transaction(async (tx) => {
            const { header, items, audit } = req.body;

            // 0. Check for existing expense with same PO Reference (Prevent Duplicates)
            if (header.poRefNo) {
                const existing = await tx.select({ ref: TBL_EXPENSE_HDR.EXPENSE_REF_NO })
                    .from(TBL_EXPENSE_HDR)
                    .where(eq(TBL_EXPENSE_HDR.PO_REF_NO, header.poRefNo))
                    .limit(1);

                if (existing.length > 0) {
                    throw new Error(`Expense already exists for PO: ${header.poRefNo} (Ref: ${existing[0].ref})`);
                }
            }

            // 1. Generate Ref No: EXP/YY/MM/XXX
            const date = new Date();
            const yearStr = date.getFullYear().toString().slice(-2);
            const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
            const prefix = `EXP/${yearStr}/${monthStr}/`;

            const lastEntry = await tx.select({ ref: TBL_EXPENSE_HDR.EXPENSE_REF_NO })
                .from(TBL_EXPENSE_HDR)
                .where(sql`${TBL_EXPENSE_HDR.EXPENSE_REF_NO} LIKE ${prefix + '%'}`)
                .orderBy(desc(TBL_EXPENSE_HDR.EXPENSE_REF_NO))
                .limit(1);

            let newNo = "001";
            if (lastEntry.length > 0 && lastEntry[0].ref) {
                const parts = lastEntry[0].ref.split('/');
                const lastSeq = parseInt(parts[parts.length - 1]);
                if (!isNaN(lastSeq)) {
                    newNo = (lastSeq + 1).toString().padStart(3, '0');
                }
            }
            const expenseRefNo = prefix + newNo;

            const hValues = {
                EXPENSE_REF_NO: expenseRefNo,
                EXPENSE_DATE: header.expenseDate ? new Date(header.expenseDate) : new Date(),
                COMPANY_ID: header.companyId,
                EXPENSE_AGAINST: header.expenseAgainst || "PO",
                PO_REF_NO: header.poRefNo,
                ACCOUNT_HEAD_ID: header.accountHeadId,
                EXPENSE_SUPPLIER_ID: header.expenseSupplierId,
                EXPENSE_TYPE: header.expenseType || "General",
                TRA_EFD_RECEIPT_NO: header.traEfdReceiptNo,
                CURRENCY_ID: header.currencyId || 1,
                EXCHANGE_RATE: String(header.exchangeRate || 1),
                TOTAL_EXPENSE_AMOUNT: String(header.totalExpenseAmount),
                TOTAL_EXPENSE_AMOUNT_LC: String(Number(header.totalExpenseAmount) * (Number(header.exchangeRate) || 1)),
                STATUS_ENTRY: header.status || "Closed",
                REMARKS: header.remarks,
                CREATED_BY: audit?.user || "System",
                CREATED_DATE: new Date(),
                CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.insert(TBL_EXPENSE_HDR).values(hValues as any);

            // Step 3: Record in Multi-Currency Transaction Table
            if (header.currencyId && header.currencyId !== 1) { // Assuming 1 is Base
                await multiCurrencyController.recordMCTransaction({
                    companyId: header.companyId,
                    docType: 'EXPENSE',
                    docNumber: expenseRefNo,
                    docDate: hValues.EXPENSE_DATE,
                    currencyId: header.currencyId,
                    amount: Number(header.totalExpenseAmount) || 0,
                    exchangeRate: Number(header.exchangeRate) || 1,
                    baseAmount: Number(hValues.TOTAL_EXPENSE_AMOUNT_LC),
                    createdBy: audit?.user || "System"
                });
            }

            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    EXPENSE_REF_NO: expenseRefNo,
                    PO_REF_NO: item.poRefNo,
                    PO_DTL_SNO: item.poDtlSno,
                    PRODUCT_ID: item.productId,
                    EXPENSE_AMOUNT: String(item.expenseAmount),
                    EXPENSE_AMOUNT_LC: String(Number(item.expenseAmount) * (Number(header.exchangeRate) || 1)),
                    REMARKS: item.remarks,
                    STATUS_ENTRY: "Normal",
                    CREATED_BY: audit?.user || "System",
                    CREATED_DATE: new Date(),
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_EXPENSE_DTL).values(dValues as any);
            }

            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    EXPENSE_REF_NO: expenseRefNo,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit?.user || "System",
                    CREATED_DATE: new Date(),
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_EXPENSE_FILES_UPLOAD).values(fValues as any);
            }

            // 4. Generate Accounting Journal Entry
            // We'll use the Account Head ID as the Ledger ID for simplicity, 
            // OR find/create a ledger with the same name.
            const expenseAccount = await tx.select().from(TBL_ACCOUNTS_HEAD_MASTER).where(eq(TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_ID, header.accountHeadId)).limit(1);
            const expenseLedgerId = await getSystemLedger(tx, header.companyId, expenseAccount[0]?.ACCOUNT_HEAD_NAME || "General Expense", "Expense");

            const supplierLedgerId = header.expenseSupplierId
                ? await getLedgerForSupplier(tx, header.expenseSupplierId, header.companyId)
                : await getSystemLedger(tx, header.companyId, "Cash in Hand", "Asset"); // Default to Cash if no supplier

            const journalDetails = [
                {
                    ledgerId: expenseLedgerId,
                    debit: Number(header.totalExpenseAmount),
                    credit: 0,
                    remarks: `Expense - ${expenseRefNo}`
                },
                {
                    ledgerId: supplierLedgerId,
                    debit: 0,
                    credit: Number(header.totalExpenseAmount),
                    remarks: `Paid via/to ${header.expenseSupplierId ? 'Supplier' : 'Cash'}`
                }
            ];

            await createJournalEntry(tx, {
                journalDate: hValues.EXPENSE_DATE,
                companyId: hValues.COMPANY_ID!,
                moduleName: "EXPENSE",
                moduleRefNo: expenseRefNo,
                narration: `Expense: ${expenseAccount[0]?.ACCOUNT_HEAD_NAME || 'General'}`,
                createdBy: audit?.user || "System",
                ipAddress: req.ip
            }, journalDetails);

            // 5. Cost Center Allocation
            if (header.costCenterId) {
                await tx.insert(TBL_COST_CENTER_ALLOCATION).values({
                    Company_ID: header.companyId,
                    COST_CENTER_ID: header.costCenterId,
                    SOURCE_TABLE: 'TBL_EXPENSE_HDR',
                    SOURCE_REF_NO: expenseRefNo,
                    EXPENSE_DATE: hValues.EXPENSE_DATE,
                    EXPENSE_CATEGORY: header.expenseCategory || 'OTHER',
                    CURRENCY_ID: header.currencyId || 1,
                    EXPENSE_AMOUNT: String(header.totalExpenseAmount),
                    LC_AMOUNT: String(hValues.TOTAL_EXPENSE_AMOUNT_LC),
                    ALLOCATION_PERCENTAGE: '100',
                    ALLOCATED_AMOUNT: String(hValues.TOTAL_EXPENSE_AMOUNT_LC),
                    APPROVAL_STATUS: 'APPROVED',
                    STATUS_ENTRY: 'Active',
                    CREATED_BY: audit?.user || "System",
                    CREATED_DATE: new Date(),
                });

                // Update Budget actuals
                await tx.update(TBL_COST_CENTER_BUDGET)
                    .set({
                        ACTUAL_EXPENSE: sql`CAST(${TBL_COST_CENTER_BUDGET.ACTUAL_EXPENSE} AS NUMERIC) + ${hValues.TOTAL_EXPENSE_AMOUNT_LC}`
                    })
                    .where(and(
                        eq(TBL_COST_CENTER_BUDGET.COST_CENTER_ID, header.costCenterId),
                        lte(TBL_COST_CENTER_BUDGET.PERIOD_START_DATE, hValues.EXPENSE_DATE.toISOString().split('T')[0]),
                        gte(TBL_COST_CENTER_BUDGET.PERIOD_END_DATE, hValues.EXPENSE_DATE.toISOString().split('T')[0])
                    ));
            }

            return { msg: "Expense created successfully", expenseRefNo };
        });

        return res.status(201).json(result);
    } catch (error: any) {
        console.error("Create Expense Error:", error);
        return res.status(500).json({ msg: error.message || "Internal server error" });
    }
};

export const updateExpense = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = decodeURIComponent(req.params.id as string);
        const result = await db.transaction(async (tx) => {
            const { header, items, audit } = req.body;

            // 0. Check for duplicate PO Reference on other records
            if (header.poRefNo) {
                const existing = await tx.select({ ref: TBL_EXPENSE_HDR.EXPENSE_REF_NO })
                    .from(TBL_EXPENSE_HDR)
                    .where(and(
                        eq(TBL_EXPENSE_HDR.PO_REF_NO, header.poRefNo),
                        ne(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id)
                    ))
                    .limit(1);

                if (existing.length > 0) {
                    throw new Error(`Another expense already exists for PO: ${header.poRefNo} (Ref: ${existing[0].ref})`);
                }
            }

            const hUpdates = {
                EXPENSE_DATE: header.expenseDate ? new Date(header.expenseDate) : undefined,
                COMPANY_ID: header.companyId,
                ACCOUNT_HEAD_ID: header.accountHeadId,
                EXPENSE_SUPPLIER_ID: header.expenseSupplierId,
                TRA_EFD_RECEIPT_NO: header.traEfdReceiptNo,
                TOTAL_EXPENSE_AMOUNT: String(header.totalExpenseAmount),
                TOTAL_EXPENSE_AMOUNT_LC: String(Number(header.totalExpenseAmount) * (Number(header.exchangeRate) || 1)),
                STATUS_ENTRY: header.status,
                REMARKS: header.remarks,
                MODIFIED_BY: audit?.user || "System",
                MODIFIED_DATE: new Date(),
                MODIFIED_IP_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.update(TBL_EXPENSE_HDR).set(hUpdates as any).where(eq(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id));

            // Fetch old header for Cost Center rollback
            const oldHeader = await tx.select().from(TBL_EXPENSE_HDR).where(eq(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id)).limit(1);

            if (oldHeader.length > 0 && oldHeader[0].COST_CENTER_ID) {
                // 1. Revert old budget actuals
                await tx.update(TBL_COST_CENTER_BUDGET)
                    .set({
                        ACTUAL_EXPENSE: sql`CAST(${TBL_COST_CENTER_BUDGET.ACTUAL_EXPENSE} AS NUMERIC) - ${Number(oldHeader[0].TOTAL_EXPENSE_AMOUNT_LC)}`
                    })
                    .where(and(
                        eq(TBL_COST_CENTER_BUDGET.COST_CENTER_ID, oldHeader[0].COST_CENTER_ID),
                        lte(TBL_COST_CENTER_BUDGET.PERIOD_START_DATE, oldHeader[0].EXPENSE_DATE!.toISOString().split('T')[0]),
                        gte(TBL_COST_CENTER_BUDGET.PERIOD_END_DATE, oldHeader[0].EXPENSE_DATE!.toISOString().split('T')[0])
                    ));

                // 2. Delete old allocation
                await tx.delete(TBL_COST_CENTER_ALLOCATION)
                    .where(and(
                        eq(TBL_COST_CENTER_ALLOCATION.SOURCE_REF_NO, id),
                        eq(TBL_COST_CENTER_ALLOCATION.SOURCE_TABLE, 'TBL_EXPENSE_HDR')
                    ));
            }

            await tx.delete(TBL_EXPENSE_DTL).where(eq(TBL_EXPENSE_DTL.EXPENSE_REF_NO, id));
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    EXPENSE_REF_NO: id,
                    PO_REF_NO: item.poRefNo,
                    PO_DTL_SNO: item.poDtlSno,
                    PRODUCT_ID: item.productId,
                    EXPENSE_AMOUNT: String(item.expenseAmount),
                    EXPENSE_AMOUNT_LC: String(Number(item.expenseAmount) * (Number(header.exchangeRate) || 1)),
                    REMARKS: item.remarks,
                    STATUS_ENTRY: "Normal",
                    CREATED_BY: audit?.user || "System",
                    CREATED_DATE: new Date(),
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_EXPENSE_DTL).values(dValues as any);
            }

            await tx.delete(TBL_EXPENSE_FILES_UPLOAD).where(eq(TBL_EXPENSE_FILES_UPLOAD.EXPENSE_REF_NO, id as string));
            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    EXPENSE_REF_NO: id,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit?.user || "System",
                    CREATED_DATE: new Date(),
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_EXPENSE_FILES_UPLOAD).values(fValues as any);
            }

            // Update Accounting Journal Entry
            // 1. Delete old entries
            const oldJournals = await tx.select({ journalRefNo: TBL_JOURNAL_HDR.JOURNAL_REF_NO })
                .from(TBL_JOURNAL_HDR)
                .where(and(eq(TBL_JOURNAL_HDR.MODULE_REF_NO, id), eq(TBL_JOURNAL_HDR.MODULE_NAME, "EXPENSE")));

            for (const j of oldJournals) {
                await tx.delete(TBL_JOURNAL_DTL).where(eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, j.journalRefNo));
                await tx.delete(TBL_JOURNAL_HDR).where(eq(TBL_JOURNAL_HDR.JOURNAL_REF_NO, j.journalRefNo));
            }

            // 2. Create new entry
            const expenseAccount = await tx.select().from(TBL_ACCOUNTS_HEAD_MASTER).where(eq(TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_ID, header.accountHeadId)).limit(1);
            const expenseLedgerId = await getSystemLedger(tx, header.companyId, expenseAccount[0]?.ACCOUNT_HEAD_NAME || "General Expense", "Expense");

            const supplierLedgerId = header.expenseSupplierId
                ? await getLedgerForSupplier(tx, header.expenseSupplierId, header.companyId)
                : await getSystemLedger(tx, header.companyId, "Cash in Hand", "Asset");

            const journalDetails = [
                {
                    ledgerId: expenseLedgerId,
                    debit: Number(header.totalExpenseAmount),
                    credit: 0,
                    remarks: `Expense Update - ${id}`
                },
                {
                    ledgerId: supplierLedgerId,
                    debit: 0,
                    credit: Number(header.totalExpenseAmount),
                    remarks: `Paid via/to ${header.expenseSupplierId ? 'Supplier' : 'Cash'}`
                }
            ];


            await createJournalEntry(tx, {
                journalDate: hUpdates.EXPENSE_DATE || new Date(),
                companyId: hUpdates.COMPANY_ID!,
                moduleName: "EXPENSE",
                moduleRefNo: id,
                narration: `Expense Update: ${expenseAccount[0]?.ACCOUNT_HEAD_NAME || 'General'}`,
                createdBy: audit?.user || "System",
                ipAddress: req.ip
            }, journalDetails);

            // 3. Create new Cost Center Allocation
            if (header.costCenterId) {
                const expDate = header.expenseDate ? new Date(header.expenseDate) : (oldHeader[0]?.EXPENSE_DATE || new Date());
                const totalAmountLc = Number(header.totalExpenseAmount) * (Number(header.exchangeRate) || 1);

                await tx.insert(TBL_COST_CENTER_ALLOCATION).values({
                    Company_ID: header.companyId,
                    COST_CENTER_ID: header.costCenterId,
                    SOURCE_TABLE: 'TBL_EXPENSE_HDR',
                    SOURCE_REF_NO: id,
                    EXPENSE_DATE: expDate,
                    EXPENSE_CATEGORY: header.expenseCategory || 'OTHER',
                    CURRENCY_ID: header.currencyId || 1,
                    EXPENSE_AMOUNT: String(header.totalExpenseAmount),
                    LC_AMOUNT: String(totalAmountLc),
                    ALLOCATION_PERCENTAGE: '100',
                    ALLOCATED_AMOUNT: String(totalAmountLc),
                    APPROVAL_STATUS: 'APPROVED',
                    STATUS_ENTRY: 'Active',
                    CREATED_BY: audit?.user || "System",
                    CREATED_DATE: new Date(),
                });

                // Update Budget actuals
                await tx.update(TBL_COST_CENTER_BUDGET)
                    .set({
                        ACTUAL_EXPENSE: sql`CAST(${TBL_COST_CENTER_BUDGET.ACTUAL_EXPENSE} AS NUMERIC) + ${totalAmountLc}`
                    })
                    .where(and(
                        eq(TBL_COST_CENTER_BUDGET.COST_CENTER_ID, header.costCenterId),
                        lte(TBL_COST_CENTER_BUDGET.PERIOD_START_DATE, expDate.toISOString().split('T')[0]),
                        gte(TBL_COST_CENTER_BUDGET.PERIOD_END_DATE, expDate.toISOString().split('T')[0])
                    ));
            }

            return { msg: "Expense updated successfully" };
        });

        return res.status(200).json(result);
    } catch (error: any) {
        console.error("Update Expense Error:", error);
        return res.status(500).json({ msg: error.message || "Internal server error" });
    }
};

export const deleteExpense = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = decodeURIComponent(req.params.id as string);
        await db.transaction(async (tx) => {
            // Delete Journal Entries
            const oldJournals = await tx.select({ journalRefNo: TBL_JOURNAL_HDR.JOURNAL_REF_NO })
                .from(TBL_JOURNAL_HDR)
                .where(and(eq(TBL_JOURNAL_HDR.MODULE_REF_NO, id), eq(TBL_JOURNAL_HDR.MODULE_NAME, "EXPENSE")));

            for (const j of oldJournals) {
                await tx.delete(TBL_JOURNAL_DTL).where(eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, j.journalRefNo));
                await tx.delete(TBL_JOURNAL_HDR).where(eq(TBL_JOURNAL_HDR.JOURNAL_REF_NO, j.journalRefNo));
            }

            await tx.delete(TBL_EXPENSE_DTL).where(eq(TBL_EXPENSE_DTL.EXPENSE_REF_NO, id));

            // Fetch old header for Cost Center rollback
            const oldHeader = await tx.select().from(TBL_EXPENSE_HDR).where(eq(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id)).limit(1);

            if (oldHeader.length > 0 && oldHeader[0].COST_CENTER_ID) {
                // Revert budget actuals
                await tx.update(TBL_COST_CENTER_BUDGET)
                    .set({
                        ACTUAL_EXPENSE: sql`CAST(${TBL_COST_CENTER_BUDGET.ACTUAL_EXPENSE} AS NUMERIC) - ${Number(oldHeader[0].TOTAL_EXPENSE_AMOUNT_LC)}`
                    })
                    .where(and(
                        eq(TBL_COST_CENTER_BUDGET.COST_CENTER_ID, oldHeader[0].COST_CENTER_ID),
                        lte(TBL_COST_CENTER_BUDGET.PERIOD_START_DATE, oldHeader[0].EXPENSE_DATE!.toISOString().split('T')[0]),
                        gte(TBL_COST_CENTER_BUDGET.PERIOD_END_DATE, oldHeader[0].EXPENSE_DATE!.toISOString().split('T')[0])
                    ));

                // Delete allocation
                await tx.delete(TBL_COST_CENTER_ALLOCATION)
                    .where(and(
                        eq(TBL_COST_CENTER_ALLOCATION.SOURCE_REF_NO, id),
                        eq(TBL_COST_CENTER_ALLOCATION.SOURCE_TABLE, 'TBL_EXPENSE_HDR')
                    ));
            }

            await tx.delete(TBL_EXPENSE_HDR).where(eq(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id));
        });
        return res.status(200).json({ msg: "Expense deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
