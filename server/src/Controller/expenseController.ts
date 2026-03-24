import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_EXPENSE_HDR, TBL_EXPENSE_DTL } from "../db/schema/index.js";
import { eq, desc } from "drizzle-orm";

/**
 * Get all Expenses
 */
export const getExpenses = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_EXPENSE_HDR).orderBy(desc(TBL_EXPENSE_HDR.CREATED_DATE));
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Error fetching Expenses:", error);
        return res.status(500).json({ msg: error.message });
    }
};

/**
 * Create a new Expense
 */
export const createExpense = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { header: headerBody, items, audit: auditBody } = req.body;
        const header = headerBody || req.body;
        const audit = auditBody || req.body.audit;
        
        const createdBy = String(audit?.user || req.body.user || "system").substring(0, 50);
        const ipAddress = String(audit?.macAddress || req.body.macAddress || "").substring(0, 50);

        await db.transaction(async (tx) => {
            // Insert Header
            await tx.insert(TBL_EXPENSE_HDR).values({
                EXPENSE_REF_NO: header.expenseRefNo,
                EXPENSE_DATE: header.expenseDate ? new Date(header.expenseDate) : new Date(),
                COMPANY_ID: header.companyId ? Number(header.companyId) : null,
                EXPENSE_AGAINST: header.expenseAgainst,
                PO_REF_NO: header.poRefNo,
                ACCOUNT_HEAD_ID: header.accountHeadId ? Number(header.accountHeadId) : null,
                EXPENSE_SUPPLIER_ID: header.expenseSupplierId ? Number(header.expenseSupplierId) : null,
                EXPENSE_TYPE: header.expenseType,
                TRA_EFD_RECEIPT_NO: header.traEfdReceiptNo,
                CURRENCY_ID: header.currencyId ? Number(header.currencyId) : null,
                EXCHANGE_RATE: header.exchangeRate?.toString(),
                TOTAL_EXPENSE_AMOUNT: header.totalExpenseAmount?.toString(),
                TOTAL_EXPENSE_AMOUNT_LC: header.totalExpenseAmountLc?.toString(),
                REMARKS: header.remarks,
                STATUS_ENTRY: header.status || "Submitted",
                CREATED_BY: createdBy,
                CREATED_DATE: new Date(),
                CREATED_IP_ADDRESS: ipAddress,
            });

            // Insert Details
            if (items && Array.isArray(items)) {
                for (const item of items) {
                    await tx.insert(TBL_EXPENSE_DTL).values({
                        EXPENSE_REF_NO: header.expenseRefNo,
                        PO_REF_NO: item.poRefNo,
                        PO_DTL_SNO: item.poDtlSno ? Number(item.poDtlSno) : null,
                        PRODUCT_ID: item.productId ? Number(item.productId) : null,
                        EXPENSE_AMOUNT: item.expenseAmount?.toString(),
                        EXPENSE_AMOUNT_LC: item.expenseAmountLc?.toString(),
                        REMARKS: item.remarks,
                        STATUS_ENTRY: item.status || "Submitted",
                        CREATED_BY: createdBy,
                        CREATED_DATE: new Date(),
                        CREATED_IP_ADDRESS: ipAddress,
                    });
                }
            }
        });

        return res.status(201).json({ msg: "Expense record created successfully" });
    } catch (error: any) {
        console.error("Error creating Expense:", error);
        return res.status(500).json({ msg: error.message });
    }
};

/**
 * Delete an Expense
 */
export const deleteExpense = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = String(req.params.id);
        await db.transaction(async (tx) => {
            await tx.delete(TBL_EXPENSE_DTL).where(eq(TBL_EXPENSE_DTL.EXPENSE_REF_NO, id));
            await tx.delete(TBL_EXPENSE_HDR).where(eq(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id));
        });
        return res.status(200).json({ msg: "Expense record deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting Expense:", error);
        return res.status(500).json({ msg: error.message });
    }
};
