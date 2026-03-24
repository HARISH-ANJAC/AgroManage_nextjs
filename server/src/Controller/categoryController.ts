import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_PRODUCT_MAIN_CATEGORY_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_PRODUCT_MAIN_CATEGORY_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { mainCategoryName, remarks, statusMaster, user } = req.body as {
            mainCategoryName: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_PRODUCT_MAIN_CATEGORY_MASTER).values({
            MAIN_CATEGORY_NAME: mainCategoryName,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster || "Active",
            CREATED_DATE: new Date(),
            CREATED_BY: user,
            CREATED_MAC_ADDRESS: systemMac,
        }).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const categoryId = parseInt(String(id));
        if (isNaN(categoryId)) return res.status(400).json({ msg: "Invalid ID" });

        const { mainCategoryName, remarks, statusMaster, user } = req.body as {
            mainCategoryName: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_PRODUCT_MAIN_CATEGORY_MASTER).set({
            MAIN_CATEGORY_NAME: mainCategoryName,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster,
            MODIFIED_DATE: new Date(),
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        }).where(eq(TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID, categoryId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Category not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const categoryId = parseInt(String(id));
        if (isNaN(categoryId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_PRODUCT_MAIN_CATEGORY_MASTER).where(eq(TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID, categoryId));
        return res.status(200).json({ msg: "Category deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });
        
        await db.delete(TBL_PRODUCT_MAIN_CATEGORY_MASTER).where(inArray(TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID, numericIds));
        return res.status(200).json({ msg: "Categories deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
