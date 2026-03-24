import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_STORE_PRODUCT_MINIMUM_STOCK, TBL_COMPANY_MASTER, TBL_STORE_MASTER, TBL_PRODUCT_MAIN_CATEGORY_MASTER, TBL_PRODUCT_SUB_CATEGORY_MASTER, TBL_PRODUCT_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getStoreProductMinimumStocks = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            Sno: TBL_STORE_PRODUCT_MINIMUM_STOCK.Sno,
            Company_id: TBL_STORE_PRODUCT_MINIMUM_STOCK.Company_id,
            Company_Name: TBL_COMPANY_MASTER.Company_Name,
            Store_Id: TBL_STORE_PRODUCT_MINIMUM_STOCK.Store_Id,
            Store_Name: TBL_STORE_MASTER.Store_Name,
            Main_Category_Id: TBL_STORE_PRODUCT_MINIMUM_STOCK.Main_Category_Id,
            MAIN_CATEGORY_NAME: TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_NAME,
            Sub_Category_Id: TBL_STORE_PRODUCT_MINIMUM_STOCK.Sub_Category_Id,
            SUB_CATEGORY_NAME: TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_NAME,
            Product_Id: TBL_STORE_PRODUCT_MINIMUM_STOCK.Product_Id,
            PRODUCT_NAME: TBL_PRODUCT_MASTER.PRODUCT_NAME,
            Minimum_Stock_Pcs: TBL_STORE_PRODUCT_MINIMUM_STOCK.Minimum_Stock_Pcs,
            Purchase_Alert_Qty: TBL_STORE_PRODUCT_MINIMUM_STOCK.Purchase_Alert_Qty,
            Requested_By: TBL_STORE_PRODUCT_MINIMUM_STOCK.Requested_By,
            Effective_From: TBL_STORE_PRODUCT_MINIMUM_STOCK.Effective_From,
            Effective_To: TBL_STORE_PRODUCT_MINIMUM_STOCK.Effective_To,
            Remarks: TBL_STORE_PRODUCT_MINIMUM_STOCK.Remarks,
            Status_Master: TBL_STORE_PRODUCT_MINIMUM_STOCK.Status_Master,
        })
        .from(TBL_STORE_PRODUCT_MINIMUM_STOCK)
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_STORE_PRODUCT_MINIMUM_STOCK.Company_id, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_STORE_MASTER, eq(TBL_STORE_PRODUCT_MINIMUM_STOCK.Store_Id, TBL_STORE_MASTER.Store_Id))
        .leftJoin(TBL_PRODUCT_MAIN_CATEGORY_MASTER, eq(TBL_STORE_PRODUCT_MINIMUM_STOCK.Main_Category_Id, TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID))
        .leftJoin(TBL_PRODUCT_SUB_CATEGORY_MASTER, eq(TBL_STORE_PRODUCT_MINIMUM_STOCK.Sub_Category_Id, TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID))
        .leftJoin(TBL_PRODUCT_MASTER, eq(TBL_STORE_PRODUCT_MINIMUM_STOCK.Product_Id, TBL_PRODUCT_MASTER.PRODUCT_ID));
        
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createStoreProductMinimumStock = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { companyId, storeId, mainCategoryId, subCategoryId, productId, minimumStockPcs, purchaseAlertQty, requestedBy, effectiveFrom, effectiveTo, remarks, statusMaster, user } = req.body as {
            companyId?: number;
            storeId?: number;
            mainCategoryId?: number;
            subCategoryId?: number;
            productId?: number;
            minimumStockPcs?: number;
            purchaseAlertQty?: number;
            requestedBy?: string;
            effectiveFrom?: string;
            effectiveTo?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            Company_id: companyId,
            Store_Id: storeId,
            Main_Category_Id: mainCategoryId,
            Sub_Category_Id: subCategoryId,
            Product_Id: productId,
            Minimum_Stock_Pcs: minimumStockPcs,
            Purchase_Alert_Qty: purchaseAlertQty,
            Requested_By: requestedBy,
            Effective_From: effectiveFrom ? new Date(effectiveFrom) : undefined,
            Effective_To: effectiveTo ? new Date(effectiveTo) : undefined,
            Created_By: user,
            Created_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) values.Remarks = remarks;
        if (statusMaster !== undefined) values.Status_Master = statusMaster || "Active";
        
        const result = await db.insert(TBL_STORE_PRODUCT_MINIMUM_STOCK).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateStoreProductMinimumStock = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const stockId = parseInt(String(id));
        if (isNaN(stockId)) return res.status(400).json({ msg: "Invalid ID" });

        const { companyId, storeId, mainCategoryId, subCategoryId, productId, minimumStockPcs, purchaseAlertQty, requestedBy, effectiveFrom, effectiveTo, remarks, statusMaster, user } = req.body as {
            companyId?: number;
            storeId?: number;
            mainCategoryId?: number;
            subCategoryId?: number;
            productId?: number;
            minimumStockPcs?: number;
            purchaseAlertQty?: number;
            requestedBy?: string;
            effectiveFrom?: string;
            effectiveTo?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            Company_id: companyId,
            Store_Id: storeId,
            Main_Category_Id: mainCategoryId,
            Sub_Category_Id: subCategoryId,
            Product_Id: productId,
            Minimum_Stock_Pcs: minimumStockPcs,
            Purchase_Alert_Qty: purchaseAlertQty,
            Requested_By: requestedBy,
            Effective_From: effectiveFrom ? new Date(effectiveFrom) : undefined,
            Effective_To: effectiveTo ? new Date(effectiveTo) : undefined,
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) updates.Remarks = remarks;
        if (statusMaster !== undefined) updates.Status_Master = statusMaster;

        const result = await db.update(TBL_STORE_PRODUCT_MINIMUM_STOCK)
            .set(updates)
            .where(eq(TBL_STORE_PRODUCT_MINIMUM_STOCK.Sno, stockId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Stock record not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteStoreProductMinimumStock = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const stockId = parseInt(String(id));
        if (isNaN(stockId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_STORE_PRODUCT_MINIMUM_STOCK).where(eq(TBL_STORE_PRODUCT_MINIMUM_STOCK.Sno, stockId));
        return res.status(200).json({ msg: "Stock record deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteStoreProductMinimumStocks = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_STORE_PRODUCT_MINIMUM_STOCK).where(inArray(TBL_STORE_PRODUCT_MINIMUM_STOCK.Sno, numericIds));
        return res.status(200).json({ msg: "Stock records deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
