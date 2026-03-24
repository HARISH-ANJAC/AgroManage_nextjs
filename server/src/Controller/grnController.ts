import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_GOODS_INWARD_GRN_HDR, TBL_GOODS_INWARD_GRN_DTL } from "../db/schema/index.js";
import { eq, desc } from "drizzle-orm";

export const getGoodsReceipts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_GOODS_INWARD_GRN_HDR).orderBy(desc(TBL_GOODS_INWARD_GRN_HDR.CREATED_DATE));
        return res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
};

export const createGoodsReceipt = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { header, items, audit } = req.body;
        
        const createdBy = String(audit?.user || "system").substring(0, 50);
        const ipAddress = String(audit?.macAddress || "").substring(0, 50);

        await db.transaction(async (tx) => {
            await tx.insert(TBL_GOODS_INWARD_GRN_HDR).values({
                GRN_REF_NO: header.grnRefNo,
                GRN_DATE: header.grnDate ? new Date(header.grnDate) : new Date(),
                COMPANY_ID: header.companyId ? Number(header.companyId) : null,
                SOURCE_STORE_ID: header.sourceStoreId ? Number(header.sourceStoreId) : null,
                GRN_STORE_ID: header.grnStoreId ? Number(header.grnStoreId) : null,
                GRN_SOURCE: header.grnSource || "Purchase Order",
                DELIVERY_NOTE_REF_NO: header.deliveryNoteRefNo,
                SUPPLIER_ID: header.supplierId ? Number(header.supplierId) : null,
                PO_REF_NO: header.poRefNo,
                SUPPLIER_INVOICE_NUMBER: header.supplierInvoiceNumber,
                VEHICLE_NO: header.vehicleNo,
                REMARKS: header.remarks,
                STATUS_ENTRY: header.status || "Received",
                CREATED_BY: createdBy,
                CREATED_DATE: new Date(),
                CREATED_IP_ADDRESS: ipAddress,
            });

            if (items && Array.isArray(items)) {
                for (const item of items) {
                    await tx.insert(TBL_GOODS_INWARD_GRN_DTL).values({
                        GRN_REF_NO: header.grnRefNo,
                        PRODUCT_ID: item.productId ? Number(item.productId) : null,
                        TOTAL_QTY: item.totalQty?.toString(),
                        UOM: item.uom,
                        REMARKS: item.remarks,
                        CREATED_BY: createdBy,
                        CREATED_DATE: new Date(),
                    });
                }
            }
        });

        return res.status(201).json({ msg: "GRN created successfully" });
    } catch (error: any) {
        console.error("Error creating GRN:", error);
        return res.status(500).json({ msg: error.message });
    }
};

export const deleteGoodsReceipt = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        await db.transaction(async (tx) => {
            const grnId = String(id);
            await tx.delete(TBL_GOODS_INWARD_GRN_DTL).where(eq(TBL_GOODS_INWARD_GRN_DTL.GRN_REF_NO, grnId));
            await tx.delete(TBL_GOODS_INWARD_GRN_HDR).where(eq(TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO, grnId));
        });
        return res.status(200).json({ msg: "GRN deleted successfully" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
};
