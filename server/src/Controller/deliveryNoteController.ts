import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_DELIVERY_NOTE_HDR, TBL_DELIVERY_NOTE_DTL } from "../db/schema/index.js";
import { eq, desc } from "drizzle-orm";

/**
 * Get all Delivery Notes
 */
export const getDeliveryNotes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_DELIVERY_NOTE_HDR).orderBy(desc(TBL_DELIVERY_NOTE_HDR.CREATED_DATE));
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Error fetching Delivery Notes:", error);
        return res.status(500).json({ msg: error.message });
    }
};

/**
 * Create a new Delivery Note
 */
export const createDeliveryNote = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { header, items, audit } = req.body;
        
        const createdBy = String(audit?.user || "system").substring(0, 50);
        const macAddress = String(audit?.macAddress || "").substring(0, 50);

        await db.transaction(async (tx) => {
            // Insert Header
            await tx.insert(TBL_DELIVERY_NOTE_HDR).values({
                DELIVERY_NOTE_REF_NO: header.deliveryNoteRefNo,
                DELIVERY_DATE: header.deliveryDate ? new Date(header.deliveryDate) : new Date(),
                COMPANY_ID: header.companyId ? Number(header.companyId) : null,
                FROM_STORE_ID: header.fromStoreId ? Number(header.fromStoreId) : null,
                DELIVERY_SOURCE_TYPE: header.deliverySourceType,
                DELIVERY_SOURCE_REF_NO: header.deliverySourceRefNo,
                TO_STORE_ID: header.toStoreId ? Number(header.toStoreId) : null,
                CUSTOMER_ID: header.customerId ? Number(header.customerId) : null,
                TRUCK_NO: header.truckNo,
                TRAILER_NO: header.trailerNo,
                DRIVER_NAME: header.driverName,
                DRIVER_CONTACT_NUMBER: header.driverContactNumber,
                SEAL_NO: header.sealNo,
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
                    await tx.insert(TBL_DELIVERY_NOTE_DTL).values({
                        DELIVERY_NOTE_REF_NO: header.deliveryNoteRefNo,
                        SALES_ORDER_DTL_SNO: item.salesOrderDtlSno ? Number(item.salesOrderDtlSno) : null,
                        PO_DTL_SNO: item.poDtlSno ? Number(item.poDtlSno) : null,
                        PO_REF_NO: item.poRefNo,
                        MAIN_CATEGORY_ID: item.mainCategoryId ? Number(item.mainCategoryId) : null,
                        SUB_CATEGORY_ID: item.subCategoryId ? Number(item.subCategoryId) : null,
                        PRODUCT_ID: item.productId ? Number(item.productId) : null,
                        SALES_RATE_PER_QTY: item.salesRatePerQty?.toString(),
                        QTY_PER_PACKING: item.qtyPerPacking?.toString(),
                        REQUEST_QTY: item.requestQty?.toString(),
                        DELIVERY_QTY: item.deliveryQty?.toString(),
                        UOM: item.uom,
                        TOTAL_PACKING: item.totalPacking?.toString(),
                        ALTERNATE_UOM: item.alternateUom,
                        TOTAL_PRODUCT_AMOUNT: item.totalProductAmount?.toString(),
                        VAT_PERCENTAGE: item.vatPercentage?.toString(),
                        VAT_AMOUNT: item.vatAmount?.toString(),
                        FINAL_SALES_AMOUNT: item.finalSalesAmount?.toString(),
                        TOTAL_PRODUCT_AMOUNT_LC: item.totalProductAmountLc?.toString(),
                        FINAL_SALES_AMOUNT_LC: item.finalSalesAmountLc?.toString(),
                        STORE_STOCK_PCS: item.storeStockPcs?.toString(),
                        REMARKS: item.remarks,
                        STATUS_ENTRY: item.status || "Submitted",
                        CREATED_BY: createdBy,
                        CREATED_DATE: new Date(),
                        CREATED_MAC_ADDRESS: macAddress,
                    });
                }
            }
        });

        return res.status(201).json({ msg: "Delivery Note created successfully" });
    } catch (error: any) {
        console.error("Error creating Delivery Note:", error);
        return res.status(500).json({ msg: error.message });
    }
};

/**
 * Delete a Delivery Note
 */
export const deleteDeliveryNote = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = String(req.params.id);
        await db.transaction(async (tx) => {
            await tx.delete(TBL_DELIVERY_NOTE_DTL).where(eq(TBL_DELIVERY_NOTE_DTL.DELIVERY_NOTE_REF_NO, id));
            await tx.delete(TBL_DELIVERY_NOTE_HDR).where(eq(TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO, id));
        });
        return res.status(200).json({ msg: "Delivery Note deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting Delivery Note:", error);
        return res.status(500).json({ msg: error.message });
    }
};
