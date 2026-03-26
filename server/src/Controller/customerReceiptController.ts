import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_CUSTOMER_RECEIPT_HDR, 
    TBL_CUSTOMER_RECEIPT_INVOICE_DTL 
} from "../db/schema/index.js";
import { eq } from "drizzle-orm";

export const getCustomerReceipts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_CUSTOMER_RECEIPT_HDR);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getCustomerReceiptById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const header = await db.select().from(TBL_CUSTOMER_RECEIPT_HDR).where(eq(TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO, id as string)).limit(1);
        if (!header.length) return res.status(404).json({ msg: "Customer Receipt not found" });

        const items = await db.select().from(TBL_CUSTOMER_RECEIPT_INVOICE_DTL).where(eq(TBL_CUSTOMER_RECEIPT_INVOICE_DTL.RECEIPT_REF_NO, id as string));

        return res.status(200).json({ header: header[0], items });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createCustomerReceipt = async (req: Request, res: Response): Promise<Response> => {
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;

            const hValues = {
                RECEIPT_REF_NO: header.receiptRefNo,
                RECEIPT_DATE: header.receiptDate ? new Date(header.receiptDate) : new Date(),
                PAYMENT_TYPE: header.paymentType,
                COMPANY_ID: header.companyId,
                CUSTOMER_ID: header.customerId,
                PAYMENT_MODE_ID: header.paymentModeId,
                TRANSACTION_REF_NO: header.transactionRefNo,
                CURRENCY_ID: header.currencyId,
                RECEIPT_AMOUNT: header.receiptAmount,
                EXCHANGE_RATE: header.exchangeRate,
                STATUS_ENTRY: header.status || "Active",
                REMARKS: header.remarks,
                CREATED_BY: audit?.user,
                CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.insert(TBL_CUSTOMER_RECEIPT_HDR).values(hValues as any);

            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    RECEIPT_REF_NO: header.receiptRefNo,
                    TAX_INVOICE_REF_NO: item.taxInvoiceRefNo,
                    ACTUAL_INVOICE_AMOUNT: item.actualInvoiceAmount,
                    ALREADY_PAID_AMOUNT: item.alreadyPaidAmount,
                    OUTSTANDING_INVOICE_AMOUNT: item.outstandingInvoiceAmount,
                    RECEIPT_INVOICE_ADJUST_AMOUNT: item.receiptInvoiceAdjustAmount,
                    CREATED_BY: audit?.user,
                    STATUS_ENTRY: "Active",
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_CUSTOMER_RECEIPT_INVOICE_DTL).values(dValues as any);
            }

            return { msg: "Customer Receipt created successfully", receiptRefNo: header.receiptRefNo };
        } catch (error: any) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(201).json(transaction);
};

export const updateCustomerReceipt = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;
            
            const hUpdates = {
                RECEIPT_DATE: header.receiptDate ? new Date(header.receiptDate) : undefined,
                RECEIPT_AMOUNT: header.receiptAmount,
                STATUS_ENTRY: header.status,
                REMARKS: header.remarks,
                MODIFIED_BY: audit?.user,
                MODIFIED_MAC_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.update(TBL_CUSTOMER_RECEIPT_HDR).set(hUpdates as any).where(eq(TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO, id as string));

            await tx.delete(TBL_CUSTOMER_RECEIPT_INVOICE_DTL).where(eq(TBL_CUSTOMER_RECEIPT_INVOICE_DTL.RECEIPT_REF_NO, id as string));
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    RECEIPT_REF_NO: id as string,
                    TAX_INVOICE_REF_NO: item.taxInvoiceRefNo,
                    ACTUAL_INVOICE_AMOUNT: item.actualInvoiceAmount,
                    ALREADY_PAID_AMOUNT: item.alreadyPaidAmount,
                    OUTSTANDING_INVOICE_AMOUNT: item.outstandingInvoiceAmount,
                    RECEIPT_INVOICE_ADJUST_AMOUNT: item.receiptInvoiceAdjustAmount,
                    CREATED_BY: audit?.user,
                    STATUS_ENTRY: "Active",
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_CUSTOMER_RECEIPT_INVOICE_DTL).values(dValues as any);
            }

            return { msg: "Customer Receipt updated successfully" };
        } catch (error) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(200).json(transaction);
};
