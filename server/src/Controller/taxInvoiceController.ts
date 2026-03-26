import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_TAX_INVOICE_HDR, 
    TBL_TAX_INVOICE_DTL 
} from "../db/schema/index.js";
import { eq } from "drizzle-orm";

export const getTaxInvoices = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_TAX_INVOICE_HDR);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getTaxInvoiceById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const header = await db.select().from(TBL_TAX_INVOICE_HDR).where(eq(TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO, id as string)).limit(1);
        if (!header.length) return res.status(404).json({ msg: "Tax Invoice not found" });

        const items = await db.select().from(TBL_TAX_INVOICE_DTL).where(eq(TBL_TAX_INVOICE_DTL.TAX_INVOICE_REF_NO, id as string));

        return res.status(200).json({ header: header[0], items });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createTaxInvoice = async (req: Request, res: Response): Promise<Response> => {
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;

            const hValues = {
                TAX_INVOICE_REF_NO: header.taxInvoiceRefNo,
                INVOICE_DATE: header.invoiceDate ? new Date(header.invoiceDate) : new Date(),
                COMPANY_ID: header.companyId,
                FROM_STORE_ID: header.fromStoreId,
                INVOICE_TYPE: header.invoiceType,
                DELIVERY_NOTE_REF_NO: header.deliveryNoteRefNo,
                CUSTOMER_ID: header.customerId,
                CURRENCY_ID: header.currencyId,
                EXCHANGE_RATE: header.exchangeRate,
                TOTAL_PRODUCT_AMOUNT: header.totalProductAmount,
                VAT_AMOUNT: header.vatAmount,
                FINAL_SALES_AMOUNT: header.finalSalesAmount,
                STATUS_ENTRY: header.status || "Active",
                REMARKS: header.remarks,
                CREATED_BY: audit?.user,
                CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.insert(TBL_TAX_INVOICE_HDR).values(hValues as any);

            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    TAX_INVOICE_REF_NO: header.taxInvoiceRefNo,
                    DELIVERY_NOTE_DTL_SNO: item.deliveryNoteDtlSno,
                    PRODUCT_ID: item.productId,
                    DELIVERY_QTY: item.deliveryQty,
                    INVOICE_QTY: item.invoiceQty,
                    SALES_RATE_PER_QTY: item.rate,
                    TOTAL_PRODUCT_AMOUNT: item.amount,
                    VAT_PERCENTAGE: item.vatPercent,
                    VAT_AMOUNT: item.vatAmount,
                    FINAL_SALES_AMOUNT: item.finalAmount,
                    CREATED_BY: audit?.user,
                    STATUS_ENTRY: "Active",
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_TAX_INVOICE_DTL).values(dValues as any);
            }

            return { msg: "Tax Invoice created successfully", taxInvoiceRefNo: header.taxInvoiceRefNo };
        } catch (error: any) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(201).json(transaction);
};

export const updateTaxInvoice = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;
            
            const hUpdates = {
                INVOICE_DATE: header.invoiceDate ? new Date(header.invoiceDate) : undefined,
                TOTAL_PRODUCT_AMOUNT: header.totalProductAmount,
                VAT_AMOUNT: header.vatAmount,
                FINAL_SALES_AMOUNT: header.finalSalesAmount,
                STATUS_ENTRY: header.status,
                REMARKS: header.remarks,
                MODIFIED_BY: audit?.user,
                MODIFIED_MAC_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.update(TBL_TAX_INVOICE_HDR).set(hUpdates as any).where(eq(TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO, id as string));

            await tx.delete(TBL_TAX_INVOICE_DTL).where(eq(TBL_TAX_INVOICE_DTL.TAX_INVOICE_REF_NO, id as string));
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    TAX_INVOICE_REF_NO: id as string,
                    DELIVERY_NOTE_DTL_SNO: item.deliveryNoteDtlSno,
                    PRODUCT_ID: item.productId,
                    DELIVERY_QTY: item.deliveryQty,
                    INVOICE_QTY: item.invoiceQty,
                    SALES_RATE_PER_QTY: item.rate,
                    TOTAL_PRODUCT_AMOUNT: item.amount,
                    VAT_PERCENTAGE: item.vatPercent,
                    VAT_AMOUNT: item.vatAmount,
                    FINAL_SALES_AMOUNT: item.finalAmount,
                    CREATED_BY: audit?.user,
                    STATUS_ENTRY: "Active",
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_TAX_INVOICE_DTL).values(dValues as any);
            }

            return { msg: "Tax Invoice updated successfully" };
        } catch (error) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(200).json(transaction);
};
