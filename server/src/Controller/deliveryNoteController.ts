import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_DELIVERY_NOTE_HDR, 
    TBL_DELIVERY_NOTE_DTL,
    TBL_COMPANY_MASTER,
    TBL_STORE_MASTER,
    TBL_CUSTOMER_MASTER,
    TBL_PRODUCT_MASTER
} from "../db/schema/index.js";
import { eq, desc } from "drizzle-orm";

export const getDeliveryNotes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            id: TBL_DELIVERY_NOTE_HDR.SNO,
            deliveryNoteRefNo: TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO,
            deliveryDate: TBL_DELIVERY_NOTE_HDR.DELIVERY_DATE,
            companyId: TBL_DELIVERY_NOTE_HDR.COMPANY_ID,
            fromStoreId: TBL_DELIVERY_NOTE_HDR.FROM_STORE_ID,
            toStoreId: TBL_DELIVERY_NOTE_HDR.TO_STORE_ID,
            customerId: TBL_DELIVERY_NOTE_HDR.CUSTOMER_ID,
            deliverySourceType: TBL_DELIVERY_NOTE_HDR.DELIVERY_SOURCE_TYPE,
            deliverySourceRefNo: TBL_DELIVERY_NOTE_HDR.DELIVERY_SOURCE_REF_NO,
            truckNo: TBL_DELIVERY_NOTE_HDR.TRUCK_NO,
            trailerNo: TBL_DELIVERY_NOTE_HDR.TRAILER_NO,
            driverName: TBL_DELIVERY_NOTE_HDR.DRIVER_NAME,
            driverContactNumber: TBL_DELIVERY_NOTE_HDR.DRIVER_CONTACT_NUMBER,
            sealNo: TBL_DELIVERY_NOTE_HDR.SEAL_NO,
            totalProductAmount: TBL_DELIVERY_NOTE_HDR.TOTAL_PRODUCT_AMOUNT,
            vatAmount: TBL_DELIVERY_NOTE_HDR.VAT_AMOUNT,
            finalSalesAmount: TBL_DELIVERY_NOTE_HDR.FINAL_SALES_AMOUNT,
            status: TBL_DELIVERY_NOTE_HDR.STATUS_ENTRY,
            remarks: TBL_DELIVERY_NOTE_HDR.REMARKS,
            companyName: TBL_COMPANY_MASTER.Company_Name,
            fromStoreName: TBL_STORE_MASTER.Store_Name,
            customerName: TBL_CUSTOMER_MASTER.Customer_Name
        })
        .from(TBL_DELIVERY_NOTE_HDR)
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_DELIVERY_NOTE_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_STORE_MASTER, eq(TBL_DELIVERY_NOTE_HDR.FROM_STORE_ID, TBL_STORE_MASTER.Store_Id))
        .leftJoin(TBL_CUSTOMER_MASTER, eq(TBL_DELIVERY_NOTE_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
        .orderBy(desc(TBL_DELIVERY_NOTE_HDR.CREATED_DATE));
        
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getDeliveryNoteById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const decodedId = decodeURIComponent(id as string);
        
        const header = await db.select({
            id: TBL_DELIVERY_NOTE_HDR.SNO,
            deliveryNoteRefNo: TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO,
            deliveryDate: TBL_DELIVERY_NOTE_HDR.DELIVERY_DATE,
            companyId: TBL_DELIVERY_NOTE_HDR.COMPANY_ID,
            fromStoreId: TBL_DELIVERY_NOTE_HDR.FROM_STORE_ID,
            toStoreId: TBL_DELIVERY_NOTE_HDR.TO_STORE_ID,
            customerId: TBL_DELIVERY_NOTE_HDR.CUSTOMER_ID,
            deliverySourceType: TBL_DELIVERY_NOTE_HDR.DELIVERY_SOURCE_TYPE,
            deliverySourceRefNo: TBL_DELIVERY_NOTE_HDR.DELIVERY_SOURCE_REF_NO,
            truckNo: TBL_DELIVERY_NOTE_HDR.TRUCK_NO,
            trailerNo: TBL_DELIVERY_NOTE_HDR.TRAILER_NO,
            driverName: TBL_DELIVERY_NOTE_HDR.DRIVER_NAME,
            driverContactNumber: TBL_DELIVERY_NOTE_HDR.DRIVER_CONTACT_NUMBER,
            sealNo: TBL_DELIVERY_NOTE_HDR.SEAL_NO,
            totalProductAmount: TBL_DELIVERY_NOTE_HDR.TOTAL_PRODUCT_AMOUNT,
            vatAmount: TBL_DELIVERY_NOTE_HDR.VAT_AMOUNT,
            finalSalesAmount: TBL_DELIVERY_NOTE_HDR.FINAL_SALES_AMOUNT,
            status: TBL_DELIVERY_NOTE_HDR.STATUS_ENTRY,
            remarks: TBL_DELIVERY_NOTE_HDR.REMARKS,
            companyName: TBL_COMPANY_MASTER.Company_Name,
            fromStoreName: TBL_STORE_MASTER.Store_Name,
            customerName: TBL_CUSTOMER_MASTER.Customer_Name
        })
        .from(TBL_DELIVERY_NOTE_HDR)
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_DELIVERY_NOTE_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_STORE_MASTER, eq(TBL_DELIVERY_NOTE_HDR.FROM_STORE_ID, TBL_STORE_MASTER.Store_Id))
        .leftJoin(TBL_CUSTOMER_MASTER, eq(TBL_DELIVERY_NOTE_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
        .where(eq(TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO, decodedId))
        .limit(1);

        if (!header.length) return res.status(404).json({ msg: "Delivery Note not found" });

        const items = await db.select({
            id: TBL_DELIVERY_NOTE_DTL.SNO,
            deliveryNoteRefNo: TBL_DELIVERY_NOTE_DTL.DELIVERY_NOTE_REF_NO,
            productId: TBL_DELIVERY_NOTE_DTL.PRODUCT_ID,
            productName: TBL_PRODUCT_MASTER.PRODUCT_NAME,
            requestQty: TBL_DELIVERY_NOTE_DTL.REQUEST_QTY,
            deliveryQty: TBL_DELIVERY_NOTE_DTL.DELIVERY_QTY,
            uom: TBL_DELIVERY_NOTE_DTL.UOM,
            rate: TBL_DELIVERY_NOTE_DTL.SALES_RATE_PER_QTY,
            amount: TBL_DELIVERY_NOTE_DTL.FINAL_SALES_AMOUNT,
            salesOrderDtlSno: TBL_DELIVERY_NOTE_DTL.SALES_ORDER_DTL_SNO
        })
        .from(TBL_DELIVERY_NOTE_DTL)
        .leftJoin(TBL_PRODUCT_MASTER, eq(TBL_DELIVERY_NOTE_DTL.PRODUCT_ID, TBL_PRODUCT_MASTER.PRODUCT_ID))
        .where(eq(TBL_DELIVERY_NOTE_DTL.DELIVERY_NOTE_REF_NO, decodedId));

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

            // Check if Delivery Note already exists for this SO Ref
            if (header.deliverySourceType === "Sales Order" && header.deliverySourceRefNo) {
                const existing = await tx.select()
                    .from(TBL_DELIVERY_NOTE_HDR)
                    .where(eq(TBL_DELIVERY_NOTE_HDR.DELIVERY_SOURCE_REF_NO, header.deliverySourceRefNo))
                    .limit(1);
                
                if (existing.length > 0) {
                    tx.rollback();
                    return { msg: "A Delivery Note already exists for this Sales Order Ref No" };
                }
            }

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
                DRIVER_CONTACT_NUMBER: header.driverContactNumber,
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
                    UOM: item.uom,
                    SALES_RATE_PER_QTY: item.rate,
                    TOTAL_PRODUCT_AMOUNT: item.amount,
                    FINAL_SALES_AMOUNT: item.amount,
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
    const decodedId = decodeURIComponent(id as string);
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;
            
            const hUpdates = {
                DELIVERY_DATE: header.deliveryDate ? new Date(header.deliveryDate) : undefined,
                TRUCK_NO: header.truckNo,
                TRAILER_NO: header.trailerNo,
                DRIVER_NAME: header.driverName,
                DRIVER_CONTACT_NUMBER: header.driverContactNumber,
                SEAL_NO: header.sealNo,
                TOTAL_PRODUCT_AMOUNT: header.totalProductAmount,
                VAT_AMOUNT: header.vatAmount,
                FINAL_SALES_AMOUNT: header.finalSalesAmount,
                STATUS_ENTRY: header.status,
                REMARKS: header.remarks,
                MODIFIED_BY: audit?.user,
                MODIFIED_MAC_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.update(TBL_DELIVERY_NOTE_HDR).set(hUpdates as any).where(eq(TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO, decodedId));

            await tx.delete(TBL_DELIVERY_NOTE_DTL).where(eq(TBL_DELIVERY_NOTE_DTL.DELIVERY_NOTE_REF_NO, decodedId));
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    DELIVERY_NOTE_REF_NO: decodedId,
                    SALES_ORDER_DTL_SNO: item.salesOrderDtlSno,
                    PRODUCT_ID: item.productId,
                    REQUEST_QTY: item.requestQty,
                    DELIVERY_QTY: item.deliveryQty,
                    UOM: item.uom,
                    SALES_RATE_PER_QTY: item.rate,
                    TOTAL_PRODUCT_AMOUNT: item.amount,
                    FINAL_SALES_AMOUNT: item.amount,
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

export const deleteDeliveryNote = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const decodedId = decodeURIComponent(id as string);
    try {
        await db.delete(TBL_DELIVERY_NOTE_DTL).where(eq(TBL_DELIVERY_NOTE_DTL.DELIVERY_NOTE_REF_NO, decodedId));
        await db.delete(TBL_DELIVERY_NOTE_HDR).where(eq(TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO, decodedId));
        return res.status(200).json({ msg: "Delivery Note deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
