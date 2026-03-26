import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_PURCHASE_INVOICE_HDR, 
    TBL_PURCHASE_INVOICE_DTL,
    TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS,
    TBL_PURCHASE_INVOICE_FILES_UPLOAD,
    TBL_PURCHASE_ORDER_DTL,
    TBL_GOODS_INWARD_GRN_DTL
} from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { sql } from "drizzle-orm";

export const getPurchaseInvoices = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Aggregating unique GRN references from the detail table
        const data = await db.select({
            ...Object.fromEntries(Object.keys(TBL_PURCHASE_INVOICE_HDR).map(k => [k, TBL_PURCHASE_INVOICE_HDR[k as keyof typeof TBL_PURCHASE_INVOICE_HDR]])),
            GRN_REF_NO: sql<string>`(
                SELECT string_agg(DISTINCT "GRN_REF_NO", ', ') 
                FROM "stoentries"."TBL_PURCHASE_INVOICE_DTL" 
                WHERE "PURCHASE_INVOICE_REF_NO" = ${TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO}
            )`
        }).from(TBL_PURCHASE_INVOICE_HDR);
        
        return res.status(200).json(data);
    } catch (error) {
        console.error("Get Purchase Invoices Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getPurchaseInvoiceById = async (req: Request, res: Response): Promise<Response> => {
    try {
        let idRaw = (req.query.id || req.params.id || req.params[0]) as string;
        if (Array.isArray(idRaw)) idRaw = idRaw.join('/');
        const id = decodeURIComponent(idRaw);
        console.log("Fetching PI with ID:", id);
        const header = await db.select().from(TBL_PURCHASE_INVOICE_HDR).where(eq(TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO, id)).limit(1);
        if (!header.length) return res.status(404).json({ msg: "Purchase Invoice not found" });

        const items = await db.select().from(TBL_PURCHASE_INVOICE_DTL).where(eq(TBL_PURCHASE_INVOICE_DTL.PURCHASE_INVOICE_REF_NO, id));
        const additionalCosts = await db.select().from(TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS).where(eq(TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS.PURCHASE_INVOICE_NO, id));

        return res.status(200).json({
            header: header[0],
            items,
            additionalCosts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createPurchaseInvoice = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, additionalCosts, audit } = req.body;
            const exRate = Number(header.exchangeRate || 1);

            const hValues = {
                PURCHASE_INVOICE_REF_NO: header.purchaseInvoiceRefNo,
                INVOICE_NO: header.invoiceNo,
                INVOICE_DATE: header.invoiceDate ? new Date(header.invoiceDate) : new Date(),
                COMPANY_ID: header.companyId ? Number(header.companyId) : null,
                PO_REF_NO: header.poRefNo,
                PURCHASE_TYPE: header.purchaseType,
                SUPPLIER_ID: header.supplierId ? Number(header.supplierId) : null,
                STORE_ID: header.storeId ? Number(header.storeId) : null,
                PAYMENT_TERM_ID: header.paymentTermId ? Number(header.paymentTermId) : null,
                MODE_OF_PAYMENT: header.modeOfPayment,
                CURRENCY_ID: header.currencyId ? Number(header.currencyId) : null,
                PRICE_TERMS: header.priceTerms,
                PRODUCT_HDR_AMOUNT: Number(header.productAmount),
                TOTAL_ADDITIONAL_COST_AMOUNT: Number(header.totalAdditionalCostAmount),
                TOTAL_PRODUCT_HDR_AMOUNT: Number(header.totalProductHdrAmount),
                TOTAL_VAT_HDR_AMOUNT: Number(header.totalVatAmount),
                FINAL_INVOICE_HDR_AMOUNT: Number(header.finalAmount),
                EXCHANGE_RATE: exRate,
                // Local Currency equivalent
                PRODUCT_HDR_AMOUNT_LC: Number(header.productAmount) * exRate,
                TOTAL_ADDITIONAL_COST_AMOUNT_LC: Number(header.totalAdditionalCostAmount) * exRate,
                TOTAL_PRODUCT_HDR_AMOUNT_LC: Number(header.totalProductHdrAmount) * exRate,
                TOTAL_VAT_HDR_AMOUNT_LC: Number(header.totalVatAmount) * exRate,
                FINAL_PURCHASE_INVOICE_AMOUNT_LC: Number(header.finalAmount) * exRate,
                REMARKS: header.remarks,
                STATUS_ENTRY: header.status || "Draft",
                CREATED_BY: audit?.user,
                CREATED_IP_ADDRESS: req.ip || "127.0.0.1",
            };

            await tx.insert(TBL_PURCHASE_INVOICE_HDR).values(hValues as any);

            if (items && items.length > 0) {
                // 3-Way Matching Validation
                const poItems = await tx.select().from(TBL_PURCHASE_ORDER_DTL).where(eq(TBL_PURCHASE_ORDER_DTL.PO_REF_NO, header.poRefNo));
                const grnRefs = [...new Set(items.map((i: any) => i.grnRefNo))] as string[];
                const grnItems = await tx.select().from(TBL_GOODS_INWARD_GRN_DTL).where(inArray(TBL_GOODS_INWARD_GRN_DTL.GRN_REF_NO, grnRefs));

                for (const item of items) {
                    const poItem = poItems.find(p => Number(p.PRODUCT_ID) === Number(item.productId));
                    const grnItem = grnItems.find(g => Number(g.PRODUCT_ID) === Number(item.productId) && g.GRN_REF_NO === item.grnRefNo);

                    if (!poItem) throw new Error(`PO Item not found for Product ID ${item.productId}`);
                    if (!grnItem) throw new Error(`GRN Item not found for Product ID ${item.productId} in GRN ${item.grnRefNo}`);

                    const invoiceQty = Number(item.totalQty);
                    const invoiceRate = Number(item.ratePerQty);
                    
                    const grnQty = Number(grnItem.TOTAL_QTY || 0);
                    const poRate = Number(poItem.RATE_PER_QTY || 0);

                    if (invoiceQty > grnQty) throw new Error(`3-Way Mismatch: Invoice Qty (${invoiceQty}) exceeds GRN Qty (${grnQty}) for Product ${item.productId}`);
                    if (invoiceRate > poRate) throw new Error(`3-Way Mismatch: Invoice Rate (${invoiceRate}) exceeds PO Rate (${poRate}) for Product ${item.productId}`);
                }

                const dValues = items.map((item: any) => ({
                    PURCHASE_INVOICE_REF_NO: header.purchaseInvoiceRefNo,
                    GRN_REF_NO: item.grnRefNo,
                    MAIN_CATEGORY_ID: item.mainCategoryId ? Number(item.mainCategoryId) : null,
                    SUB_CATEGORY_ID: item.subCategoryId ? Number(item.subCategoryId) : null,
                    PRODUCT_ID: item.productId ? Number(item.productId) : null,
                    QTY_PER_PACKING: Number(item.qtyPerPacking),
                    TOTAL_QTY: Number(item.totalQty),
                    UOM: item.uom,
                    RATE_PER_QTY: Number(item.ratePerQty),
                    PRODUCT_AMOUNT: Number(item.productAmount),
                    DISCOUNT_PERCENTAGE: Number(item.discountPercentage),
                    DISCOUNT_AMOUNT: Number(item.discountAmount),
                    TOTAL_PRODUCT_AMOUNT: Number(item.totalProductAmount),
                    VAT_PERCENTAGE: Number(item.vatPercentage),
                    VAT_AMOUNT: Number(item.vatAmount),
                    FINAL_PRODUCT_AMOUNT: Number(item.finalProductAmount),
                    TOTAL_PRODUCT_AMOUNT_LC: Number(item.totalProductAmount) * exRate,
                    FINAL_PRODUCT_AMOUNT_LC: Number(item.finalProductAmount) * exRate,
                    REMARKS: item.remarks,
                    STATUS_ENTRY: "Active",
                    CREATED_BY: audit?.user,
                }));
                await tx.insert(TBL_PURCHASE_INVOICE_DTL).values(dValues as any);
            }

            if (additionalCosts && additionalCosts.length > 0) {
                const acValues = additionalCosts.map((cost: any) => ({
                    PURCHASE_INVOICE_NO: header.purchaseInvoiceRefNo,
                    ADDITIONAL_COST_TYPE_ID: cost.typeId ? Number(cost.typeId) : null,
                    ADDITIONAL_COST_AMOUNT: Number(cost.amount),
                    REMARKS: cost.remarks,
                    CREATED_BY: audit?.user,
                    STATUS_MASTER: "Active"
                }));
                await tx.insert(TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS).values(acValues as any);
            }

            return { msg: "Purchase Invoice created successfully", id: header.purchaseInvoiceRefNo };
        } catch (error: any) {
            console.error(error);
            tx.rollback();
            throw error;
        }
        });
        return res.status(201).json(transaction);
    } catch (error: any) {
        console.error("Create Purchase Invoice Error:", error);
        return res.status(400).json({ msg: error.message || "Failed to create Purchase Invoice" });
    }
};

export const updatePurchaseInvoice = async (req: Request, res: Response): Promise<Response | void> => {
    let idRaw = (req.query.id || req.params.id || req.params[0]) as string;
    if (Array.isArray(idRaw)) idRaw = idRaw.join('/');
    const id = decodeURIComponent(idRaw);
    try {
        const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, additionalCosts, audit } = req.body;
            const exRate = Number(header.exchangeRate || 1);
            
            const hUpdates = {
                INVOICE_NO: header.invoiceNo,
                INVOICE_DATE: header.invoiceDate ? new Date(header.invoiceDate) : undefined,
                COMPANY_ID: header.companyId ? Number(header.companyId) : null,
                PO_REF_NO: header.poRefNo,
                PURCHASE_TYPE: header.purchaseType,
                SUPPLIER_ID: header.supplierId ? Number(header.supplierId) : null,
                STORE_ID: header.storeId ? Number(header.storeId) : null,
                PAYMENT_TERM_ID: header.paymentTermId ? Number(header.paymentTermId) : null,
                MODE_OF_PAYMENT: header.modeOfPayment,
                CURRENCY_ID: header.currencyId ? Number(header.currencyId) : null,
                PRICE_TERMS: header.priceTerms,
                PRODUCT_HDR_AMOUNT: Number(header.productAmount),
                TOTAL_ADDITIONAL_COST_AMOUNT: Number(header.totalAdditionalCostAmount),
                TOTAL_PRODUCT_HDR_AMOUNT: Number(header.totalProductHdrAmount),
                TOTAL_VAT_HDR_AMOUNT: Number(header.totalVatAmount),
                FINAL_INVOICE_HDR_AMOUNT: Number(header.finalAmount),
                EXCHANGE_RATE: exRate,
                PRODUCT_HDR_AMOUNT_LC: Number(header.productAmount) * exRate,
                TOTAL_ADDITIONAL_COST_AMOUNT_LC: Number(header.totalAdditionalCostAmount) * exRate,
                TOTAL_PRODUCT_HDR_AMOUNT_LC: Number(header.totalProductHdrAmount) * exRate,
                TOTAL_VAT_HDR_AMOUNT_LC: Number(header.totalVatAmount) * exRate,
                FINAL_PURCHASE_INVOICE_AMOUNT_LC: Number(header.finalAmount) * exRate,
                REMARKS: header.remarks,
                STATUS_ENTRY: header.status,
                MODIFIED_BY: audit?.user,
                MODIFIED_DATE: new Date(),
                MODIFIED_IP_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.update(TBL_PURCHASE_INVOICE_HDR).set(hUpdates as any).where(eq(TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO, id));

            await tx.delete(TBL_PURCHASE_INVOICE_DTL).where(eq(TBL_PURCHASE_INVOICE_DTL.PURCHASE_INVOICE_REF_NO, id));
            if (items && items.length > 0) {
                // 3-Way Matching Validation
                const poItems = await tx.select().from(TBL_PURCHASE_ORDER_DTL).where(eq(TBL_PURCHASE_ORDER_DTL.PO_REF_NO, header.poRefNo));
                const grnRefs = [...new Set(items.map((i: any) => i.grnRefNo))] as string[];
                const grnItems = await tx.select().from(TBL_GOODS_INWARD_GRN_DTL).where(inArray(TBL_GOODS_INWARD_GRN_DTL.GRN_REF_NO, grnRefs));

                for (const item of items) {
                    const poItem = poItems.find(p => Number(p.PRODUCT_ID) === Number(item.productId));
                    const grnItem = grnItems.find(g => Number(g.PRODUCT_ID) === Number(item.productId) && g.GRN_REF_NO === item.grnRefNo);

                    if (!poItem) throw new Error(`PO Item not found for Product ID ${item.productId}`);
                    if (!grnItem) throw new Error(`GRN Item not found for Product ID ${item.productId} in GRN ${item.grnRefNo}`);

                    const invoiceQty = Number(item.totalQty);
                    const invoiceRate = Number(item.ratePerQty);
                    
                    const grnQty = Number(grnItem.TOTAL_QTY || 0);
                    const poRate = Number(poItem.RATE_PER_QTY || 0);

                    if (invoiceQty > grnQty) throw new Error(`3-Way Mismatch: Invoice Qty (${invoiceQty}) exceeds GRN Qty (${grnQty}) for Product ${item.productId}`);
                    if (invoiceRate > poRate) throw new Error(`3-Way Mismatch: Invoice Rate (${invoiceRate}) exceeds PO Rate (${poRate}) for Product ${item.productId}`);
                }

                const dValues = items.map((item: any) => ({
                    PURCHASE_INVOICE_REF_NO: id,
                    GRN_REF_NO: item.grnRefNo,
                    MAIN_CATEGORY_ID: item.mainCategoryId ? Number(item.mainCategoryId) : null,
                    SUB_CATEGORY_ID: item.subCategoryId ? Number(item.subCategoryId) : null,
                    PRODUCT_ID: item.productId ? Number(item.productId) : null,
                    QTY_PER_PACKING: Number(item.qtyPerPacking),
                    TOTAL_QTY: Number(item.totalQty),
                    UOM: item.uom,
                    RATE_PER_QTY: Number(item.ratePerQty),
                    PRODUCT_AMOUNT: Number(item.productAmount),
                    DISCOUNT_PERCENTAGE: Number(item.discountPercentage),
                    DISCOUNT_AMOUNT: Number(item.discountAmount),
                    TOTAL_PRODUCT_AMOUNT: Number(item.totalProductAmount),
                    VAT_PERCENTAGE: Number(item.vatPercentage),
                    VAT_AMOUNT: Number(item.vatAmount),
                    FINAL_PRODUCT_AMOUNT: Number(item.finalProductAmount),
                    TOTAL_PRODUCT_AMOUNT_LC: Number(item.totalProductAmount) * exRate,
                    FINAL_PRODUCT_AMOUNT_LC: Number(item.finalProductAmount) * exRate,
                    REMARKS: item.remarks,
                    STATUS_ENTRY: "Active",
                    CREATED_BY: audit?.user,
                }));
                await tx.insert(TBL_PURCHASE_INVOICE_DTL).values(dValues as any);
            }

            await tx.delete(TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS).where(eq(TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS.PURCHASE_INVOICE_NO, id));
            if (additionalCosts && additionalCosts.length > 0) {
                const acValues = additionalCosts.map((cost: any) => ({
                    PURCHASE_INVOICE_NO: id,
                    ADDITIONAL_COST_TYPE_ID: cost.typeId ? Number(cost.typeId) : null,
                    ADDITIONAL_COST_AMOUNT: Number(cost.amount),
                    REMARKS: cost.remarks,
                    CREATED_BY: audit?.user,
                    STATUS_MASTER: "Active"
                }));
                await tx.insert(TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS).values(acValues as any);
            }

            return { msg: "Purchase Invoice updated successfully" };
        } catch (error: any) {
            console.error(error);
            tx.rollback();
            throw error;
        }
        });
        return res.status(200).json(transaction);
    } catch (error: any) {
        console.error("Update Purchase Invoice Error:", error);
        return res.status(400).json({ msg: error.message || "Failed to update Purchase Invoice" });
    }
};



export const uploadInvoiceFile = async (req: Request, res: Response): Promise<Response> => {
    try {
        let rawId = req.query.id || req.params.id || req.params[0];
        if (Array.isArray(rawId)) rawId = rawId.join('/');
        const id = decodeURIComponent(rawId as string);
        const { documentType, description, fileName, contentType, contentData, audit } = req.body;

        await db.insert(TBL_PURCHASE_INVOICE_FILES_UPLOAD).values({
            PURCHASE_INVOICE_REF_NO: id,
            DOCUMENT_TYPE: documentType,
            DESCRIPTION_DETAILS: description,
            FILE_NAME: fileName,
            CONTENT_TYPE: contentType,
            CONTENT_DATA: contentData, // base64 or bytea
            STATUS_MASTER: "Active",
            CREATED_BY: audit?.user,
            CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
        } as any);

        return res.status(200).json({ msg: "File uploaded successfully" });
    } catch (error: any) {
        return res.status(500).json({ msg: "Upload failed", error: error.message });
    }
};

export const getInvoiceFiles = async (req: Request, res: Response): Promise<Response> => {
    try {
        let idRaw = (req.query.id || req.params.id || req.params[0]) as string;
        if (Array.isArray(idRaw)) idRaw = idRaw.join('/');
        const id = decodeURIComponent(idRaw);
        const files = await db.select().from(TBL_PURCHASE_INVOICE_FILES_UPLOAD).where(eq(TBL_PURCHASE_INVOICE_FILES_UPLOAD.PURCHASE_INVOICE_REF_NO, id));
        return res.status(200).json(files);
    } catch (error: any) {
        return res.status(500).json({ msg: "Fetch failed", error: error.message });
    }
};

export const deletePurchaseInvoice = async (req: Request, res: Response): Promise<Response | void> => {
    let idRaw = (req.query.id || req.params.id || req.params[0]) as string;
    if (Array.isArray(idRaw)) idRaw = idRaw.join('/');
    const id = decodeURIComponent(idRaw);
    try {
        await db.transaction(async (tx) => {
            await tx.delete(TBL_PURCHASE_INVOICE_DTL).where(eq(TBL_PURCHASE_INVOICE_DTL.PURCHASE_INVOICE_REF_NO, id));
            await tx.delete(TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS).where(eq(TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS.PURCHASE_INVOICE_NO, id));
            await tx.delete(TBL_PURCHASE_INVOICE_FILES_UPLOAD).where(eq(TBL_PURCHASE_INVOICE_FILES_UPLOAD.PURCHASE_INVOICE_REF_NO, id));
            await tx.delete(TBL_PURCHASE_INVOICE_HDR).where(eq(TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO, id));
        });
        return res.status(200).json({ msg: "Purchase Invoice deleted successfully" });
    } catch (error: any) {
        console.error("Delete Purchase Invoice Error:", error);
        return res.status(400).json({ msg: error.message || "Failed to delete Purchase Invoice" });
    }
};
