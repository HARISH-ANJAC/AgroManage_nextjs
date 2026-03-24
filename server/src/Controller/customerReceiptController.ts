import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_CUSTOMER_RECEIPT_HDR, TBL_CUSTOMER_RECEIPT_INVOICE_DTL } from "../db/schema/index.js";
import { eq, desc } from "drizzle-orm";

/**
 * Get all Customer Receipts
 */
export const getCustomerReceipts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_CUSTOMER_RECEIPT_HDR).orderBy(desc(TBL_CUSTOMER_RECEIPT_HDR.CREATED_DATE));
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Error fetching Customer Receipts:", error);
        return res.status(500).json({ msg: error.message });
    }
};

/**
 * Create a new Customer Receipt
 */
export const createCustomerReceipt = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { header: headerBody, invoices, audit: auditBody } = req.body;
        const header = headerBody || req.body;
        const audit = auditBody || req.body.audit;
        
        const createdBy = String(audit?.user || req.body.user || "system").substring(0, 50);
        const macAddress = String(audit?.macAddress || req.body.macAddress || "").substring(0, 50);

        await db.transaction(async (tx) => {
            // Insert Header
            await tx.insert(TBL_CUSTOMER_RECEIPT_HDR).values({
                RECEIPT_REF_NO: header.receiptRefNo,
                RECEIPT_DATE: header.receiptDate ? new Date(header.receiptDate) : new Date(),
                PAYMENT_TYPE: header.paymentType,
                COMPANY_ID: header.companyId ? Number(header.companyId) : null,
                CUSTOMER_ID: header.customerId ? Number(header.customerId) : null,
                PAYMENT_MODE_ID: header.paymentModeId ? Number(header.paymentModeId) : null,
                CR_BANK_CASH_ID: header.crBankCashId ? Number(header.crBankCashId) : null,
                CR_ACCOUNT_ID: header.crAccountId ? Number(header.crAccountId) : null,
                DR_BANK_CASH_ID: header.drBankCashId ? Number(header.drBankCashId) : null,
                TRANSACTION_REF_NO: header.transactionRefNo,
                TRANSACTION_DATE: header.transactionDate ? new Date(header.transactionDate) : null,
                CURRENCY_ID: header.currencyId ? Number(header.currencyId) : null,
                RECEIPT_AMOUNT: header.receiptAmount?.toString(),
                EXCHANGE_RATE: header.exchangeRate?.toString(),
                RECEIPT_AMOUNT_LC: header.receiptAmountLc?.toString(),
                REMARKS: header.remarks,
                STATUS_ENTRY: header.status || "Submitted",
                CREATED_BY: createdBy,
                CREATED_DATE: new Date(),
                CREATED_MAC_ADDRESS: macAddress,
            });

            // Insert Details (Tax Invoices)
            if (invoices && Array.isArray(invoices)) {
                for (const inv of invoices) {
                    await tx.insert(TBL_CUSTOMER_RECEIPT_INVOICE_DTL).values({
                        RECEIPT_REF_NO: header.receiptRefNo,
                        TAX_INVOICE_REF_NO: inv.taxInvoiceRefNo,
                        ACTUAL_INVOICE_AMOUNT: inv.actualInvoiceAmount?.toString(),
                        ALREADY_PAID_AMOUNT: inv.alreadyPaidAmount?.toString(),
                        OUTSTANDING_INVOICE_AMOUNT: inv.outstandingInvoiceAmount?.toString(),
                        RECEIPT_INVOICE_ADJUST_AMOUNT: inv.receiptInvoiceAdjustAmount?.toString(),
                        REMARKS: inv.remarks,
                        STATUS_ENTRY: inv.status || "Submitted",
                        CREATED_BY: createdBy,
                        CREATED_DATE: new Date(),
                        CREATED_MAC_ADDRESS: macAddress,
                    });
                }
            }
        });

        return res.status(201).json({ msg: "Customer Receipt created successfully" });
    } catch (error: any) {
        console.error("Error creating Customer Receipt:", error);
        return res.status(500).json({ msg: error.message });
    }
};

/**
 * Delete a Customer Receipt
 */
export const deleteCustomerReceipt = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = String(req.params.id);
        await db.transaction(async (tx) => {
            await tx.delete(TBL_CUSTOMER_RECEIPT_INVOICE_DTL).where(eq(TBL_CUSTOMER_RECEIPT_INVOICE_DTL.RECEIPT_REF_NO, id));
            await tx.delete(TBL_CUSTOMER_RECEIPT_HDR).where(eq(TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO, id));
        });
        return res.status(200).json({ msg: "Customer Receipt deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting Customer Receipt:", error);
        return res.status(500).json({ msg: error.message });
    }
};
