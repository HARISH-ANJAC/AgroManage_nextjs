import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_EXPENSE_HDR, 
    TBL_EXPENSE_DTL 
} from "../db/schema/index.js";
import { eq } from "drizzle-orm";

export const getExpenses = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_EXPENSE_HDR);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getExpenseById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const header = await db.select().from(TBL_EXPENSE_HDR).where(eq(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id as string)).limit(1);
        if (!header.length) return res.status(404).json({ msg: "Expense not found" });

        const items = await db.select().from(TBL_EXPENSE_DTL).where(eq(TBL_EXPENSE_DTL.EXPENSE_REF_NO, id as string));

        return res.status(200).json({ header: header[0], items });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createExpense = async (req: Request, res: Response): Promise<Response> => {
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;

            const hValues = {
                EXPENSE_REF_NO: header.expenseRefNo,
                EXPENSE_DATE: header.expenseDate ? new Date(header.expenseDate) : new Date(),
                COMPANY_ID: header.companyId,
                EXPENSE_AGAINST: header.expenseAgainst,
                PO_REF_NO: header.poRefNo,
                ACCOUNT_HEAD_ID: header.accountHeadId,
                EXPENSE_SUPPLIER_ID: header.expenseSupplierId,
                EXPENSE_TYPE: header.expenseType,
                TRA_EFD_RECEIPT_NO: header.traEfdReceiptNo,
                CURRENCY_ID: header.currencyId,
                EXCHANGE_RATE: header.exchangeRate,
                TOTAL_EXPENSE_AMOUNT: header.totalExpenseAmount,
                STATUS_ENTRY: header.status || "Active",
                REMARKS: header.remarks,
                CREATED_BY: audit?.user,
                CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.insert(TBL_EXPENSE_HDR).values(hValues as any);

            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    EXPENSE_REF_NO: header.expenseRefNo,
                    PO_REF_NO: item.poRefNo,
                    PO_DTL_SNO: item.poDtlSno,
                    PRODUCT_ID: item.productId,
                    EXPENSE_AMOUNT: item.expenseAmount,
                    CREATED_BY: audit?.user,
                    STATUS_ENTRY: "Active",
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_EXPENSE_DTL).values(dValues as any);
            }

            return { msg: "Expense created successfully", expenseRefNo: header.expenseRefNo };
        } catch (error: any) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(201).json(transaction);
};

export const updateExpense = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;
            
            const hUpdates = {
                EXPENSE_DATE: header.expenseDate ? new Date(header.expenseDate) : undefined,
                TOTAL_EXPENSE_AMOUNT: header.totalExpenseAmount,
                STATUS_ENTRY: header.status,
                REMARKS: header.remarks,
                MODIFIED_BY: audit?.user,
                MODIFIED_IP_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.update(TBL_EXPENSE_HDR).set(hUpdates as any).where(eq(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id as string));

            await tx.delete(TBL_EXPENSE_DTL).where(eq(TBL_EXPENSE_DTL.EXPENSE_REF_NO, id as string));
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    EXPENSE_REF_NO: id as string,
                    PO_REF_NO: item.poRefNo,
                    PO_DTL_SNO: item.poDtlSno,
                    PRODUCT_ID: item.productId,
                    EXPENSE_AMOUNT: item.expenseAmount,
                    CREATED_BY: audit?.user,
                    STATUS_ENTRY: "Active",
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_EXPENSE_DTL).values(dValues as any);
            }

            return { msg: "Expense updated successfully" };
        } catch (error) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(200).json(transaction);
};
