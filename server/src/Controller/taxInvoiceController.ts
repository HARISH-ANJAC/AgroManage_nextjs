import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_TAX_INVOICE_HDR, TBL_TAX_INVOICE_DTL } from "../db/schema/index.js";
import { eq, desc } from "drizzle-orm";

/**
 * Get all Tax Invoices
 */
export const getTaxInvoices = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_TAX_INVOICE_HDR).orderBy(desc(TBL_TAX_INVOICE_HDR.CREATED_DATE));
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Error fetching Tax Invoices:", error);
        return res.status(500).json({ msg: error.message });
    }
};

/**
 * Create a new Tax Invoice
 */
export const createTaxInvoice = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { header, items, audit } = req.body;
        
        const createdBy = String(audit?.user || "system").substring(0, 50);
        const macAddress = String(audit?.macAddress || "").substring(0, 50);

        await db.transaction(async (tx) => {
            // Insert Header
            await tx.insert(TBL_TAX_INVOICE_HDR).values({
                TAX_INVOICE_REF_NO: header.taxInvoiceRefNo,
                INVOICE_DATE: header.invoiceDate ? new Date(header.invoiceDate) : new Date(),
                COMPANY_ID: header.companyId ? Number(header.companyId) : null,
                FROM_STORE_ID: header.fromStoreId ? Number(header.fromStoreId) : null,
                INVOICE_TYPE: header.invoiceType,
                DELIVERY_NOTE_REF_NO: header.deliveryNoteRefNo,
                CUSTOMER_ID: header.customerId ? Number(header.customerId) : null,
                CURRENCY_ID: header.currencyId ? Number(header.currencyId) : null,
                EXCHANGE_RATE: header.exchangeRate?.toString(),
                TOTAL_PRODUCT_AMOUNT: header.totalProductAmount?.toString(),
                VAT_AMOUNT: header.vatAmount?.toString(),
                FINAL_SALES_AMOUNT: header.finalSalesAmount?.toString(),
                TOTAL_PRODUCT_AMOUNT_LC: header.totalProductAmountLc?.toString(),
                FINAL_SALES_AMOUNT_LC: header.finalSalesAmountLc?.toString(),
                REMARKS: header.remarks,
                STATUS_ENTRY: header.status || "Submitted",
                CREATED_BY: createdBy,
                CREATED_DATE: new Date(),
                CREATED_MAC_ADDRESS: macAddress,
            });

            // Insert Details
            if (items && Array.isArray(items)) {
                for (const item of items) {
                    await tx.insert(TBL_TAX_INVOICE_DTL).values({
                        TAX_INVOICE_REF_NO: header.taxInvoiceRefNo,
                        DELIVERY_NOTE_DTL_SNO: item.deliveryNoteDtlSno ? Number(item.deliveryNoteDtlSno) : null,
                        PO_DTL_SNO: item.poDtlSno ? Number(item.poDtlSno) : null,
                        PO_REF_NO: item.poRefNo,
                        MAIN_CATEGORY_ID: item.mainCategoryId ? Number(item.mainCategoryId) : null,
                        SUB_CATEGORY_ID: item.subCategoryId ? Number(item.subCategoryId) : null,
                        PRODUCT_ID: item.productId ? Number(item.productId) : null,
                        SALES_RATE_PER_QTY: item.salesRatePerQty?.toString(),
                        QTY_PER_PACKING: item.qtyPerPacking?.toString(),
                        DELIVERY_QTY: item.deliveryQty?.toString(),
                        INVOICE_QTY: item.invoiceQty?.toString(),
                        UOM: item.uom,
                        TOTAL_PACKING: item.totalPacking?.toString(),
                        ALTERNATE_UOM: item.alternateUom,
                        TOTAL_PRODUCT_AMOUNT: item.totalProductAmount?.toString(),
                        VAT_PERCENTAGE: item.vatPercentage?.toString(),
                        VAT_AMOUNT: item.vatAmount?.toString(),
                        FINAL_SALES_AMOUNT: item.finalSalesAmount?.toString(),
                        TOTAL_PRODUCT_AMOUNT_LC: item.totalProductAmountLc?.toString(),
                        FINAL_SALES_AMOUNT_LC: item.finalSalesAmountLc?.toString(),
                        REMARKS: item.remarks,
                        STATUS_ENTRY: item.status || "Submitted",
                        CREATED_BY: createdBy,
                        CREATED_DATE: new Date(),
                        CREATED_MAC_ADDRESS: macAddress,
                    });
                }
            }
        });

        return res.status(201).json({ msg: "Tax Invoice created successfully" });
    } catch (error: any) {
        console.error("Error creating Tax Invoice:", error);
        return res.status(500).json({ msg: error.message });
    }
};

/**
 * Delete a Tax Invoice
 */
export const deleteTaxInvoice = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = String(req.params.id);
        await db.transaction(async (tx) => {
            await tx.delete(TBL_TAX_INVOICE_DTL).where(eq(TBL_TAX_INVOICE_DTL.TAX_INVOICE_REF_NO, id));
            await tx.delete(TBL_TAX_INVOICE_HDR).where(eq(TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO, id));
        });
        return res.status(200).json({ msg: "Tax Invoice deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting Tax Invoice:", error);
        return res.status(500).json({ msg: error.message });
    }
};
