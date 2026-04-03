import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_GOODS_INWARD_GRN_HDR,
    TBL_GOODS_INWARD_GRN_DTL,
    TBL_GOODS_FILES_UPLOAD,
    TBL_PURCHASE_ORDER_HDR,
    TBL_PRODUCT_MASTER,
    TBL_PURCHASE_ORDER_DTL
} from "../db/schema/index.js";
import { eq, getTableColumns } from "drizzle-orm";

export const getGoodsReceipts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_GOODS_INWARD_GRN_HDR);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getGoodsReceiptById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = decodeURIComponent(req.params.id as string);
        const header = await db.select().from(TBL_GOODS_INWARD_GRN_HDR).where(eq(TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO, id)).limit(1);
        if (!header.length) return res.status(404).json({ msg: "Goods Receipt not found" });

        const items = await db.select({
            ...getTableColumns(TBL_GOODS_INWARD_GRN_DTL),
            productName: TBL_PRODUCT_MASTER.PRODUCT_NAME,
            poQty: TBL_PURCHASE_ORDER_DTL.TOTAL_QTY
        })
        .from(TBL_GOODS_INWARD_GRN_DTL)
        .leftJoin(TBL_PRODUCT_MASTER, eq(TBL_GOODS_INWARD_GRN_DTL.PRODUCT_ID, TBL_PRODUCT_MASTER.PRODUCT_ID))
        .leftJoin(TBL_PURCHASE_ORDER_DTL, eq(TBL_GOODS_INWARD_GRN_DTL.PO_DTL_SNO, TBL_PURCHASE_ORDER_DTL.SNO))
        .where(eq(TBL_GOODS_INWARD_GRN_DTL.GRN_REF_NO, id as string));

        const filesData = await db.select().from(TBL_GOODS_FILES_UPLOAD).where(eq(TBL_GOODS_FILES_UPLOAD.GRN_REF_NO, id as string));
        const processedFiles = filesData.map(f => ({
            ...f,
            CONTENT_DATA: f.CONTENT_DATA ? f.CONTENT_DATA.toString('base64') : null
        }));

        return res.status(200).json({
            header: header[0],
            items,
            files: processedFiles
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createGoodsReceipt = async (req: Request, res: Response): Promise<Response> => {
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;
            
            if (header.poRefNo) {
                const po = await tx.select().from(TBL_PURCHASE_ORDER_HDR).where(eq(TBL_PURCHASE_ORDER_HDR.PO_REF_NO, header.poRefNo)).limit(1);
                if (!po.length) throw new Error("Purchase Order not found");
                // Simplified validation logic for creating GRN
                // if (po[0].STATUS_ENTRY !== "Approved") throw new Error("GRN cannot be created for unapproved PO");
            }

            const hValues = {
                GRN_REF_NO: header.grnRefNo,
                GRN_DATE: header.grnDate ? new Date(header.grnDate) : new Date(),
                COMPANY_ID: header.companyId,
                SOURCE_STORE_ID: header.sourceStoreId,
                GRN_STORE_ID: header.grnStoreId,
                GRN_SOURCE: header.grnSource,
                SUPPLIER_ID: header.supplierId,
                PO_REF_NO: header.poRefNo,
                DELIVERY_NOTE_REF_NO: header.deliveryNoteRefNo,
                SUPPLIER_INVOICE_NUMBER: header.supplierInvoiceNo,
                CONTAINER_NO: header.containerNo,
                DRIVER_NAME: header.driverName,
                DRIVER_CONTACT_NUMBER: header.driverContact,
                VEHICLE_NO: header.vehicleNo,
                SEAL_NO: header.sealNo,
                REMARKS: header.remarks,
                STATUS_ENTRY: header.status || "Active",
                CREATED_BY: audit?.user,
                CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.insert(TBL_GOODS_INWARD_GRN_HDR).values(hValues as any);

            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    GRN_REF_NO: header.grnRefNo,
                    PO_DTL_SNO: item.poDtlSno,
                    PRODUCT_ID: item.productId,
                    TOTAL_QTY: item.totalQty,
                    QTY_PER_PACKING: item.qtyPerPacking,
                    UOM: item.uom,
                    REMARKS: item.remarks,
                    STATUS_ENTRY: "Active",
                    CREATED_BY: audit?.user,
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_GOODS_INWARD_GRN_DTL).values(dValues as any);
            }

            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    GRN_REF_NO: header.grnRefNo,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit?.user,
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1",
                    CREATED_DATE: new Date()
                }));
                await tx.insert(TBL_GOODS_FILES_UPLOAD).values(fValues as any);
            }

            return { msg: "Goods Receipt created successfully", grnRefNo: header.grnRefNo };
        } catch (error: any) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(201).json(transaction);
};

export const updateGoodsReceipt = async (req: Request, res: Response): Promise<Response> => {
    const id = decodeURIComponent(req.params.id as string);
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;
            
            const hUpdates = {
                GRN_DATE: header.grnDate ? new Date(header.grnDate) : undefined,
                SUPPLIER_INVOICE_NUMBER: header.supplierInvoiceNo,
                CONTAINER_NO: header.containerNo,
                DRIVER_NAME: header.driverName,
                DRIVER_CONTACT_NUMBER: header.driverContact,
                VEHICLE_NO: header.vehicleNo,
                SEAL_NO: header.sealNo,
                REMARKS: header.remarks,
                STATUS_ENTRY: header.status,
                MODIFIED_BY: audit?.user,
                MODIFIED_IP_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.update(TBL_GOODS_INWARD_GRN_HDR).set(hUpdates as any).where(eq(TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO, id as string));

            await tx.delete(TBL_GOODS_INWARD_GRN_DTL).where(eq(TBL_GOODS_INWARD_GRN_DTL.GRN_REF_NO, id as string));
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    GRN_REF_NO: id as string,
                    PO_DTL_SNO: item.poDtlSno,
                    PRODUCT_ID: item.productId,
                    TOTAL_QTY: item.totalQty,
                    QTY_PER_PACKING: item.qtyPerPacking,
                    UOM: item.uom,
                    REMARKS: item.remarks,
                    STATUS_ENTRY: "Active",
                    CREATED_BY: audit?.user,
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_GOODS_INWARD_GRN_DTL).values(dValues as any);
            }

            await tx.delete(TBL_GOODS_FILES_UPLOAD).where(eq(TBL_GOODS_FILES_UPLOAD.GRN_REF_NO, id as string));
            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    GRN_REF_NO: id as string,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit?.user,
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1",
                    CREATED_DATE: new Date()
                }));
                await tx.insert(TBL_GOODS_FILES_UPLOAD).values(fValues as any);
            }

            return { msg: "Goods Receipt updated successfully" };
        } catch (error) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(200).json(transaction);
};
export const deleteGoodsReceipt = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = decodeURIComponent(req.params.id as string);
        // Archive (soft-delete) the GRN by setting status to 'Archived'
        await db.update(TBL_GOODS_INWARD_GRN_HDR)
            .set({ STATUS_ENTRY: "Archived" } as any)
            .where(eq(TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO, id));
        return res.status(200).json({ msg: "GRN archived successfully", grnRefNo: id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
