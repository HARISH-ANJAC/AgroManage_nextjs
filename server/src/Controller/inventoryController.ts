import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_GOODS_INWARD_GRN_HDR,
    TBL_GOODS_INWARD_GRN_DTL,
    TBL_DELIVERY_NOTE_HDR,
    TBL_DELIVERY_NOTE_DTL,
    TBL_PRODUCT_OPENING_STOCK,
    TBL_PRODUCT_MASTER,
    TBL_STORE_MASTER
} from "../db/schema/index.js";
import { eq, and, sql, desc, asc } from "drizzle-orm";

/**
 * Fetches the stock ledger for a specific store and product
 */
export const getStockLedger = async (req: Request, res: Response): Promise<Response> => {
    try {
        const storeId = req.query.storeId ? Number(req.query.storeId) : null;
        const productId = req.query.productId ? Number(req.query.productId) : null;

        if (!storeId) {
            return res.status(400).json({ msg: "Store ID is required" });
        }

        // 1. Fetch Opening Stock
        const openingStock = await db.select({
            date: TBL_PRODUCT_OPENING_STOCK.OPENING_STOCK_DATE,
            refNo: sql<string>`'OPENING-STOCK'`,
            type: sql<string>`'Opening'`,
            inQty: TBL_PRODUCT_OPENING_STOCK.TOTAL_QTY,
            outQty: sql<number>`0`,
            remarks: TBL_PRODUCT_OPENING_STOCK.REMARKS
        })
        .from(TBL_PRODUCT_OPENING_STOCK)
        .where(
            and(
                eq(TBL_PRODUCT_OPENING_STOCK.STORE_ID, storeId),
                productId ? eq(TBL_PRODUCT_OPENING_STOCK.PRODUCT_ID, productId) : undefined
            )
        );

        // 2. Fetch Goods Receipts (Stock In)
        const grns = await db.select({
            date: TBL_GOODS_INWARD_GRN_HDR.GRN_DATE,
            refNo: TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO,
            type: sql<string>`'Inward (GRN)'`,
            inQty: TBL_GOODS_INWARD_GRN_DTL.TOTAL_QTY,
            outQty: sql<number>`0`,
            remarks: TBL_GOODS_INWARD_GRN_DTL.REMARKS
        })
        .from(TBL_GOODS_INWARD_GRN_DTL)
        .innerJoin(TBL_GOODS_INWARD_GRN_HDR, eq(TBL_GOODS_INWARD_GRN_DTL.GRN_REF_NO, TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO))
        .where(
            and(
                eq(TBL_GOODS_INWARD_GRN_HDR.GRN_STORE_ID, storeId),
                productId ? eq(TBL_GOODS_INWARD_GRN_DTL.PRODUCT_ID, productId) : undefined
            )
        );

        // 3. Fetch Delivery Notes (Stock Out)
        const dns = await db.select({
            date: TBL_DELIVERY_NOTE_HDR.DELIVERY_DATE,
            refNo: TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO,
            type: sql<string>`'Outward (DN)'`,
            inQty: sql<number>`0`,
            outQty: TBL_DELIVERY_NOTE_DTL.DELIVERY_QTY,
            remarks: TBL_DELIVERY_NOTE_DTL.REMARKS
        })
        .from(TBL_DELIVERY_NOTE_DTL)
        .innerJoin(TBL_DELIVERY_NOTE_HDR, eq(TBL_DELIVERY_NOTE_DTL.DELIVERY_NOTE_REF_NO, TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO))
        .where(
            and(
                eq(TBL_DELIVERY_NOTE_HDR.FROM_STORE_ID, storeId),
                productId ? eq(TBL_DELIVERY_NOTE_DTL.PRODUCT_ID, productId) : undefined
            )
        );

        // Combine and Sort
        const combined = [
            ...openingStock.map(x => ({ ...x, date: x.date || new Date(0) })), 
            ...grns.map(x => ({ ...x, date: x.date || new Date() })), 
            ...dns.map(x => ({ ...x, date: x.date || new Date() }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return res.status(200).json(combined);
    } catch (error) {
        console.error("Stock Ledger Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
