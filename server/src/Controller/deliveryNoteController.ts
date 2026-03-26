import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_DELIVERY_NOTE_HDR, 
    TBL_DELIVERY_NOTE_DTL,
    TBL_SALES_ORDER_HDR
} from "../db/schema/index.js";
import { eq } from "drizzle-orm";

export const getDeliveryNotes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_DELIVERY_NOTE_HDR);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getDeliveryNoteById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const header = await db.select().from(TBL_DELIVERY_NOTE_HDR).where(eq(TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO, id as string)).limit(1);
        if (!header.length) return res.status(404).json({ msg: "Delivery Note not found" });

        const items = await db.select().from(TBL_DELIVERY_NOTE_DTL).where(eq(TBL_DELIVERY_NOTE_DTL.DELIVERY_NOTE_REF_NO, id as string));

        return res.status(200).json({ header: header[0], items });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createDeliveryNote = async (req: Request, res: Response): Promise<Response> => {
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;

            const hValues = {
                DELIVERY_NOTE_REF_NO: header.deliveryNoteRefNo,
                DELIVERY_DATE: header.deliveryDate ? new Date(header.deliveryDate) : new Date(),
                COMPANY_ID: header.companyId,
                FROM_STORE_ID: header.fromStoreId,
                DELIVERY_SOURCE_TYPE: header.deliverySourceType,
                DELIVERY_SOURCE_REF_NO: header.deliverySourceRefNo,
                TO_STORE_ID: header.toStoreId,
                CUSTOMER_ID: header.customerId,
                TRUCK_NO: header.truckNo,
                TRAILER_NO: header.trailerNo,
                DRIVER_NAME: header.driverName,
                DRIVER_CONTACT_NUMBER: header.driverContact,
                SEAL_NO: header.sealNo,
                TOTAL_PRODUCT_AMOUNT: header.totalProductAmount,
                VAT_AMOUNT: header.vatAmount,
                FINAL_SALES_AMOUNT: header.finalSalesAmount,
                STATUS_ENTRY: header.status || "Active",
                REMARKS: header.remarks,
                CREATED_BY: audit?.user,
                CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.insert(TBL_DELIVERY_NOTE_HDR).values(hValues as any);

            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    DELIVERY_NOTE_REF_NO: header.deliveryNoteRefNo,
                    SALES_ORDER_DTL_SNO: item.salesOrderDtlSno,
                    PRODUCT_ID: item.productId,
                    REQUEST_QTY: item.requestQty,
                    DELIVERY_QTY: item.deliveryQty,
                    SALES_RATE_PER_QTY: item.rate,
                    TOTAL_PRODUCT_AMOUNT: item.amount,
                    VAT_PERCENTAGE: item.vatPercent,
                    VAT_AMOUNT: item.vatAmount,
                    FINAL_SALES_AMOUNT: item.finalAmount,
                    CREATED_BY: audit?.user,
                    STATUS_ENTRY: "Active",
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_DELIVERY_NOTE_DTL).values(dValues as any);
            }

            return { msg: "Delivery Note created successfully", deliveryNoteRefNo: header.deliveryNoteRefNo };
        } catch (error: any) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(201).json(transaction);
};

export const updateDeliveryNote = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;
            
            const hUpdates = {
                DELIVERY_DATE: header.deliveryDate ? new Date(header.deliveryDate) : undefined,
                TOTAL_PRODUCT_AMOUNT: header.totalProductAmount,
                VAT_AMOUNT: header.vatAmount,
                FINAL_SALES_AMOUNT: header.finalSalesAmount,
                STATUS_ENTRY: header.status,
                REMARKS: header.remarks,
                MODIFIED_BY: audit?.user,
                MODIFIED_MAC_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.update(TBL_DELIVERY_NOTE_HDR).set(hUpdates as any).where(eq(TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO, id as string));

            await tx.delete(TBL_DELIVERY_NOTE_DTL).where(eq(TBL_DELIVERY_NOTE_DTL.DELIVERY_NOTE_REF_NO, id as string));
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    DELIVERY_NOTE_REF_NO: id as string,
                    SALES_ORDER_DTL_SNO: item.salesOrderDtlSno,
                    PRODUCT_ID: item.productId,
                    REQUEST_QTY: item.requestQty,
                    DELIVERY_QTY: item.deliveryQty,
                    SALES_RATE_PER_QTY: item.rate,
                    TOTAL_PRODUCT_AMOUNT: item.amount,
                    VAT_PERCENTAGE: item.vatPercent,
                    VAT_AMOUNT: item.vatAmount,
                    FINAL_SALES_AMOUNT: item.finalAmount,
                    CREATED_BY: audit?.user,
                    STATUS_ENTRY: "Active",
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_DELIVERY_NOTE_DTL).values(dValues as any);
            }

            return { msg: "Delivery Note updated successfully" };
        } catch (error) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(200).json(transaction);
};
