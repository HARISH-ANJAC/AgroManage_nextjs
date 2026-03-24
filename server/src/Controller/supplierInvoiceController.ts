import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_PURCHASE_INVOICE_HDR, TBL_PURCHASE_INVOICE_DTL } from "../db/schema/index.js";
import { eq, desc } from "drizzle-orm";

export const getSupplierInvoices = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_PURCHASE_INVOICE_HDR).orderBy(desc(TBL_PURCHASE_INVOICE_HDR.CREATED_DATE));
        return res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
};

export const createSupplierInvoice = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { header, items, audit } = req.body;

        const createdBy = String(audit?.user || "system").substring(0, 50);
        const ipAddress = String(audit?.macAddress || "").substring(0, 50);

        await db.transaction(async (tx) => {
            await tx.insert(TBL_PURCHASE_INVOICE_HDR).values({
                PURCHASE_INVOICE_REF_NO: header.invoiceRefNo,
                INVOICE_NO: header.invoiceNo,
                INVOICE_DATE: header.invoiceDate ? new Date(header.invoiceDate) : new Date(),
                PO_REF_NO: header.poRefNo,
                COMPANY_ID: header.companyId ? Number(header.companyId) : null,
                SUPPLIER_ID: header.supplierId ? Number(header.supplierId) : null,
                STORE_ID: header.storeId ? Number(header.storeId) : null,
                FINAL_INVOICE_HDR_AMOUNT: header.finalAmount?.toString(),
                STATUS_ENTRY: header.status || "Confirmed",
                CREATED_BY: createdBy,
                CREATED_DATE: new Date(),
                CREATED_IP_ADDRESS: ipAddress,
            });

            if (items && Array.isArray(items)) {
                for (const item of items) {
                    await tx.insert(TBL_PURCHASE_INVOICE_DTL).values({
                        PURCHASE_INVOICE_REF_NO: header.invoiceRefNo,
                        GRN_REF_NO: item.grnRefNo, // 3-Way matching link
                        PRODUCT_ID: item.productId ? Number(item.productId) : null,
                        TOTAL_QTY: item.totalQty?.toString(),
                        RATE_PER_QTY: item.rate?.toString(),
                        FINAL_PRODUCT_AMOUNT: item.finalAmount?.toString(),
                        CREATED_BY: createdBy,
                        CREATED_DATE: new Date(),
                    });
                }
            }
        });

        return res.status(201).json({ msg: "Supplier Invoice created successfully" });
    } catch (error: any) {
        console.error("Error creating Supplier Invoice:", error);
        return res.status(500).json({ msg: error.message });
    }
};

export const deleteSupplierInvoice = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        await db.transaction(async (tx) => {
            const invoiceId = String(id);
            await tx.delete(TBL_PURCHASE_INVOICE_DTL).where(eq(TBL_PURCHASE_INVOICE_DTL.PURCHASE_INVOICE_REF_NO, invoiceId));
            await tx.delete(TBL_PURCHASE_INVOICE_HDR).where(eq(TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO, invoiceId));
        });
        return res.status(200).json({ msg: "Supplier Invoice deleted successfully" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
};
