import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_PRODUCT_OPENING_STOCK, TBL_COMPANY_MASTER, TBL_STORE_MASTER, TBL_PRODUCT_MAIN_CATEGORY_MASTER, TBL_PRODUCT_SUB_CATEGORY_MASTER, TBL_PRODUCT_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getProductOpeningStocks = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            SNO: TBL_PRODUCT_OPENING_STOCK.SNO,
            OPENING_STOCK_DATE: TBL_PRODUCT_OPENING_STOCK.OPENING_STOCK_DATE,
            COMPANY_ID: TBL_PRODUCT_OPENING_STOCK.COMPANY_ID,
            Company_Name: TBL_COMPANY_MASTER.Company_Name,
            STORE_ID: TBL_PRODUCT_OPENING_STOCK.STORE_ID,
            Store_Name: TBL_STORE_MASTER.Store_Name,
            MAIN_CATEGORY_ID: TBL_PRODUCT_OPENING_STOCK.MAIN_CATEGORY_ID,
            MAIN_CATEGORY_NAME: TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_NAME,
            SUB_CATEGORY_ID: TBL_PRODUCT_OPENING_STOCK.SUB_CATEGORY_ID,
            SUB_CATEGORY_NAME: TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_NAME,
            PRODUCT_ID: TBL_PRODUCT_OPENING_STOCK.PRODUCT_ID,
            PRODUCT_NAME: TBL_PRODUCT_MASTER.PRODUCT_NAME,
            TOTAL_QTY: TBL_PRODUCT_OPENING_STOCK.TOTAL_QTY,
            REMARKS: TBL_PRODUCT_OPENING_STOCK.REMARKS,
            STATUS_MASTER: TBL_PRODUCT_OPENING_STOCK.STATUS_MASTER,
        })
        .from(TBL_PRODUCT_OPENING_STOCK)
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_PRODUCT_OPENING_STOCK.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_STORE_MASTER, eq(TBL_PRODUCT_OPENING_STOCK.STORE_ID, TBL_STORE_MASTER.Store_Id))
        .leftJoin(TBL_PRODUCT_MAIN_CATEGORY_MASTER, eq(TBL_PRODUCT_OPENING_STOCK.MAIN_CATEGORY_ID, TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID))
        .leftJoin(TBL_PRODUCT_SUB_CATEGORY_MASTER, eq(TBL_PRODUCT_OPENING_STOCK.SUB_CATEGORY_ID, TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID))
        .leftJoin(TBL_PRODUCT_MASTER, eq(TBL_PRODUCT_OPENING_STOCK.PRODUCT_ID, TBL_PRODUCT_MASTER.PRODUCT_ID));
        
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createProductOpeningStock = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { openingStockDate, companyId, storeId, mainCategoryId, subCategoryId, productId, totalQty, remarks, statusMaster, user } = req.body as {
            openingStockDate: string;
            companyId?: number;
            storeId?: number;
            mainCategoryId?: number;
            subCategoryId?: number;
            productId?: number;
            totalQty?: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            OPENING_STOCK_DATE: openingStockDate ? new Date(openingStockDate) : undefined,
            COMPANY_ID: companyId,
            STORE_ID: storeId,
            MAIN_CATEGORY_ID: mainCategoryId,
            SUB_CATEGORY_ID: subCategoryId,
            PRODUCT_ID: productId,
            TOTAL_QTY: totalQty,
            CREATED_BY: user,
            CREATED_MAC_ADDRESS: systemMac,
        };
        
        if (remarks !== undefined) values.REMARKS = remarks;
        if (statusMaster !== undefined) values.STATUS_MASTER = statusMaster || "Active";
        
        const result = await db.insert(TBL_PRODUCT_OPENING_STOCK).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateProductOpeningStock = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const stockId = parseInt(String(id));
        if (isNaN(stockId)) return res.status(400).json({ msg: "Invalid ID" });

        const { openingStockDate, companyId, storeId, mainCategoryId, subCategoryId, productId, totalQty, remarks, statusMaster, user } = req.body as {
            openingStockDate: string;
            companyId?: number;
            storeId?: number;
            mainCategoryId?: number;
            subCategoryId?: number;
            productId?: number;
            totalQty?: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            OPENING_STOCK_DATE: openingStockDate ? new Date(openingStockDate) : undefined,
            COMPANY_ID: companyId,
            STORE_ID: storeId,
            MAIN_CATEGORY_ID: mainCategoryId,
            SUB_CATEGORY_ID: subCategoryId,
            PRODUCT_ID: productId,
            TOTAL_QTY: totalQty,
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        };
        
        if (remarks !== undefined) updates.REMARKS = remarks;
        if (statusMaster !== undefined) updates.STATUS_MASTER = statusMaster;

        const result = await db.update(TBL_PRODUCT_OPENING_STOCK)
            .set(updates)
            .where(eq(TBL_PRODUCT_OPENING_STOCK.SNO, stockId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Stock record not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteProductOpeningStock = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const stockId = parseInt(String(id));
        if (isNaN(stockId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_PRODUCT_OPENING_STOCK).where(eq(TBL_PRODUCT_OPENING_STOCK.SNO, stockId));
        return res.status(200).json({ msg: "Stock record deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteProductOpeningStocks = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_PRODUCT_OPENING_STOCK).where(inArray(TBL_PRODUCT_OPENING_STOCK.SNO, numericIds));
        return res.status(200).json({ msg: "Stock records deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
