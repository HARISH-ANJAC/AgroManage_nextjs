import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_PURCHASE_ORDER_HDR, 
    TBL_PURCHASE_ORDER_DTL, 
    TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS, 
    TBL_PURCHASE_ORDER_FILES_UPLOAD, 
    TBL_PURCHASE_ORDER_CONVERSATION_DTL,
    TBL_PRODUCT_MASTER
} from "../db/schema/index.js";
import { eq, and, sql, like, desc } from "drizzle-orm";

export const getPurchaseOrders = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_PURCHASE_ORDER_HDR);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getPurchaseOrderById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = decodeURIComponent(req.params.id);
        const header = await db.select().from(TBL_PURCHASE_ORDER_HDR).where(eq(TBL_PURCHASE_ORDER_HDR.PO_REF_NO, id)).limit(1);
        if (!header.length) return res.status(404).json({ msg: "Purchase Order not found" });

        const items = await db.select().from(TBL_PURCHASE_ORDER_DTL).where(eq(TBL_PURCHASE_ORDER_DTL.PO_REF_NO, id as string));
        const additionalCosts = await db.select().from(TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS).where(eq(TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS.PO_REF_NO, id as string));
        const files = await db.select().from(TBL_PURCHASE_ORDER_FILES_UPLOAD).where(eq(TBL_PURCHASE_ORDER_FILES_UPLOAD.PO_REF_NO, id as string));
        const conversations = await db.select().from(TBL_PURCHASE_ORDER_CONVERSATION_DTL).where(eq(TBL_PURCHASE_ORDER_CONVERSATION_DTL.PO_REF_NO, id as string)).orderBy(sql`${TBL_PURCHASE_ORDER_CONVERSATION_DTL.CREATED_DATE} ASC`);

        const processedFiles = files.map(f => ({
            ...f,
            CONTENT_DATA: f.CONTENT_DATA ? f.CONTENT_DATA.toString('base64') : null
        }));

        return res.status(200).json({
            header: header[0],
            items,
            additionalCosts,
            files: processedFiles,
            conversations
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createPurchaseOrder = async (req: Request, res: Response): Promise<Response> => {
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, additionalCosts, files, audit } = req.body;
            
            let finalPoRefNo = header.poRefNo;

            // Generate PO Ref uniquely based on product code and month
            if (items && items.length > 0 && items[0].productId) {
                const prodQuery = await tx.select().from(TBL_PRODUCT_MASTER).where(eq(TBL_PRODUCT_MASTER.PRODUCT_ID, items[0].productId)).limit(1);
                let prdCode = "GN";
                if (prodQuery.length > 0 && prodQuery[0].PRODUCT_NAME) {
                    prdCode = prodQuery[0].PRODUCT_NAME.substring(0, 2).toUpperCase();
                }

                const poDate = header.poDate ? new Date(header.poDate) : new Date();
                const mStr = (poDate.getMonth() + 1).toString().padStart(2, '0');
                
                // e.g., PO/MA/02/
                const searchPrefix = `PO/${prdCode}/${mStr}/%`;

                const latestPo = await tx.select({ poRef: TBL_PURCHASE_ORDER_HDR.PO_REF_NO })
                    .from(TBL_PURCHASE_ORDER_HDR)
                    .where(like(TBL_PURCHASE_ORDER_HDR.PO_REF_NO, searchPrefix))
                    .orderBy(desc(TBL_PURCHASE_ORDER_HDR.PO_REF_NO))
                    .limit(1);

                let nextSeq = 1;
                if (latestPo.length > 0 && latestPo[0].poRef) {
                    const parts = latestPo[0].poRef.split('/');
                    if (parts.length === 4) {
                        nextSeq = parseInt(parts[3], 10) + 1;
                    }
                }
                finalPoRefNo = `PO/${prdCode}/${mStr}/${nextSeq.toString().padStart(3, '0')}`;
            }

            // 1. Insert Header
            const hValues = {
                PO_REF_NO: finalPoRefNo,
                PO_DATE: header.poDate ? new Date(header.poDate) : new Date(),
                PURCHASE_TYPE: header.purchaseType,
                COMPANY_ID: header.companyId,
                SUPPLIER_ID: header.supplierId,
                PO_STORE_ID: header.storeId,
                PAYMENT_TERM_ID: header.paymentTermId,
                MODE_OF_PAYMENT: header.modeOfPayment,
                CURRENCY_ID: header.currencyId,
                SUPLIER_PROFORMA_NUMBER: header.proformaNo,
                SHIPMENT_MODE: header.shipmentMode,
                PRICE_TERMS: header.priceTerms,
                ESTIMATED_SHIPMENT_DATE: header.estShipmentDate ? new Date(header.estShipmentDate) : null,
                PRODUCT_HDR_AMOUNT: header.productAmount,
                TOTAL_VAT_HDR_AMOUNT: header.totalVatAmount,
                FINAL_PURCHASE_HDR_AMOUNT: header.finalAmount,
                EXCHANGE_RATE: header.exchangeRate,
                STATUS_ENTRY: header.status || "Draft",
                CREATED_BY: audit.user,
                CREATED_IP_ADDRESS: req.ip || "127.0.0.1",
                SUBMITTED_BY: header.status === "Submitted" ? audit.user : null,
                SUBMITTED_DATE: header.status === "Submitted" ? new Date() : null,
                SHIPMENT_REMARKS: header.shipmentRemarks
            };

            await tx.insert(TBL_PURCHASE_ORDER_HDR).values(hValues as any);

            // 2. Insert Details
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    PO_REF_NO: finalPoRefNo,
                    REQUEST_STORE_ID: header.storeId,
                    PRODUCT_ID: item.productId,
                    TOTAL_QTY: item.totalQty,
                    UOM: item.uom,
                    QTY_PER_PACKING: item.qtyPerPack,
                    TOTAL_PACKING: item.qtyPerPack ? Number((item.totalQty / item.qtyPerPack).toFixed(2)) : 0,
                    RATE_PER_QTY: item.rate,
                    PRODUCT_AMOUNT: item.amount,
                    DISCOUNT_PERCENTAGE: item.discPercent,
                    VAT_PERCENTAGE: item.vatPercent,
                    FINAL_PRODUCT_AMOUNT: item.amount - (item.amount * (item.discPercent || 0) / 100) + ((item.amount - (item.amount * (item.discPercent || 0) / 100)) * (item.vatPercent || 0) / 100),
                    CREATED_BY: audit.user,
                    STATUS_ENTRY: "Active"
                }));
                await tx.insert(TBL_PURCHASE_ORDER_DTL).values(dValues as any);
            }

            // 3. Insert Additional Costs
            if (additionalCosts && additionalCosts.length > 0) {
                const acValues = additionalCosts.map((cost: any) => ({
                    PO_REF_NO: finalPoRefNo,
                    ADDITIONAL_COST_TYPE_ID: cost.typeId,
                    ADDITIONAL_COST_AMOUNT: cost.amount,
                    CREATED_BY: audit.user,
                    STATUS_MASTER: "Active"
                }));
                await tx.insert(TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS).values(acValues as any);
            }

            // 4. Insert Files
            if (files && files.length > 0) {
                const fValues = files.map((f: any) => ({
                    PO_REF_NO: finalPoRefNo,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit.user,
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1",
                    CREATED_DATE: new Date()
                }));
                await tx.insert(TBL_PURCHASE_ORDER_FILES_UPLOAD).values(fValues as any);
            }

            return { msg: "Purchase Order created successfully", poRefNo: finalPoRefNo };
        } catch (error) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(201).json(transaction);
};

export const approvePurchaseOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = decodeURIComponent(req.params.id);
        const { status, remarks, user, level } = req.body; // level: "head" | "1" | "2" | "final"
        const updateObj: any = {};
        const ip = req.ip || "127.0.0.1";

        if (level === "head") {
            updateObj.PURCHASE_HEAD_RESPONSE_PERSON = user;
            updateObj.PURCHASE_HEAD_RESPONSE_DATE = new Date();
            updateObj.PURCHASE_HEAD_RESPONSE_STATUS = status;
            updateObj.PURCHASE_HEAD_RESPONSE_REMARKS = remarks;
            updateObj.PURCHASE_HEAD_RESPONSE_IP_ADDRESS = ip;
        } else if (level === "1") {
            updateObj.RESPONSE_1_PERSON = user;
            updateObj.RESPONSE_1_DATE = new Date();
            updateObj.RESPONSE_1_STATUS = status;
            updateObj.RESPONSE_1_REMARKS = remarks;
            updateObj.RESPONSE_1_IP_ADDRESS = ip;
        } else if (level === "2") {
            updateObj.RESPONSE_2_PERSON = user;
            updateObj.RESPONSE_2_DATE = new Date();
            updateObj.RESPONSE_2_STATUS = status;
            updateObj.RESPONSE_2_REMARKS = remarks;
            updateObj.RESPONSE_2_IP_ADDRESS = ip;
        } else if (level === "final") {
            updateObj.FINAL_RESPONSE_PERSON = user;
            updateObj.FINAL_RESPONSE_DATE = new Date();
            updateObj.FINAL_RESPONSE_STATUS = status;
            updateObj.FINAL_RESPONSE_REMARKS = remarks;
            updateObj.STATUS_ENTRY = status === "Approved" ? "Approved" : "Rejected";
        }

        await db.transaction(async (tx) => {
            await tx.update(TBL_PURCHASE_ORDER_HDR).set(updateObj).where(eq(TBL_PURCHASE_ORDER_HDR.PO_REF_NO, id as string));
            
            // Add entry to Conversation/History table
            await tx.insert(TBL_PURCHASE_ORDER_CONVERSATION_DTL).values({
                PO_REF_NO: id as string,
                RESPOND_PERSON: user,
                DISCUSSION_DETAILS: `${level.toUpperCase()} APPROVAL: ${status}. ${remarks || ""}`,
                RESPONSE_STATUS: status,
                STATUS_ENTRY: "Active",
                CREATED_BY: user,
                CREATED_DATE: new Date(),
                CREATED_IP_ADDRESS: ip
            } as any);
        });

        return res.status(200).json({ msg: `PO ${level} approval updated and logged` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updatePurchaseOrder = async (req: Request, res: Response): Promise<Response> => {
    const id = decodeURIComponent(req.params.id);
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, additionalCosts, files, audit } = req.body;
            
            // 1. Update Header
            const hUpdates = {
                PO_DATE: header.poDate ? new Date(header.poDate) : undefined,
                PURCHASE_TYPE: header.purchaseType,
                COMPANY_ID: header.companyId,
                SUPPLIER_ID: header.supplierId,
                PO_STORE_ID: header.storeId,
                PAYMENT_TERM_ID: header.paymentTermId,
                MODE_OF_PAYMENT: header.modeOfPayment,
                CURRENCY_ID: header.currencyId,
                SUPLIER_PROFORMA_NUMBER: header.proformaNo,
                SHIPMENT_MODE: header.shipmentMode,
                PRICE_TERMS: header.priceTerms,
                ESTIMATED_SHIPMENT_DATE: header.estShipmentDate ? new Date(header.estShipmentDate) : null,
                PRODUCT_HDR_AMOUNT: header.productAmount,
                TOTAL_VAT_HDR_AMOUNT: header.totalVatAmount,
                FINAL_PURCHASE_HDR_AMOUNT: header.finalAmount,
                EXCHANGE_RATE: header.exchangeRate,
                STATUS_ENTRY: header.status,
                MODIFIED_BY: audit.user,
                MODIFIED_IP_ADDRESS: req.ip || "127.0.0.1",
                SHIPMENT_REMARKS: header.shipmentRemarks
            };

            await tx.update(TBL_PURCHASE_ORDER_HDR).set(hUpdates as any).where(eq(TBL_PURCHASE_ORDER_HDR.PO_REF_NO, id as string));

            // 2. Refresh Details (delete then insert)
            await tx.delete(TBL_PURCHASE_ORDER_DTL).where(eq(TBL_PURCHASE_ORDER_DTL.PO_REF_NO, id as string));
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    PO_REF_NO: id as string,
                    REQUEST_STORE_ID: header.storeId,
                    PRODUCT_ID: item.productId,
                    TOTAL_QTY: item.totalQty,
                    UOM: item.uom,
                    QTY_PER_PACKING: item.qtyPerPack,
                    TOTAL_PACKING: item.qtyPerPack ? Number((item.totalQty / item.qtyPerPack).toFixed(2)) : 0,
                    RATE_PER_QTY: item.rate,
                    PRODUCT_AMOUNT: item.amount,
                    DISCOUNT_PERCENTAGE: item.discPercent,
                    VAT_PERCENTAGE: item.vatPercent,
                    FINAL_PRODUCT_AMOUNT: item.amount - (item.amount * (item.discPercent || 0) / 100) + ((item.amount - (item.amount * (item.discPercent || 0) / 100)) * (item.vatPercent || 0) / 100),
                    CREATED_BY: audit.user,
                    STATUS_ENTRY: "Active"
                }));
                await tx.insert(TBL_PURCHASE_ORDER_DTL).values(dValues as any);
            }

            // 3. Refresh Additional Costs
            await tx.delete(TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS).where(eq(TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS.PO_REF_NO, id as string));
            if (additionalCosts && additionalCosts.length > 0) {
                const acValues = additionalCosts.map((cost: any) => ({
                    PO_REF_NO: id as string,
                    ADDITIONAL_COST_TYPE_ID: cost.typeId,
                    ADDITIONAL_COST_AMOUNT: cost.amount,
                    CREATED_BY: audit.user,
                    STATUS_MASTER: "Active"
                }));
                await tx.insert(TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS).values(acValues as any);
            }

            // 4. Refresh Files
            await tx.delete(TBL_PURCHASE_ORDER_FILES_UPLOAD).where(eq(TBL_PURCHASE_ORDER_FILES_UPLOAD.PO_REF_NO, id as string));
            if (files && files.length > 0) {
                const fValues = files.map((f: any) => ({
                    PO_REF_NO: id as string,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit.user,
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1",
                    CREATED_DATE: new Date()
                }));
                await tx.insert(TBL_PURCHASE_ORDER_FILES_UPLOAD).values(fValues as any);
            }

            return { msg: "Purchase Order updated successfully" };
        } catch (error) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(200).json(transaction);
};

export const archivePurchaseOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = decodeURIComponent(req.params.id);
        await db.update(TBL_PURCHASE_ORDER_HDR)
            .set({ STATUS_ENTRY: "Archived" })
            .where(eq(TBL_PURCHASE_ORDER_HDR.PO_REF_NO, id as string));
        return res.status(200).json({ msg: "PO archived" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
