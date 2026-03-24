import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_PRODUCT_SUB_CATEGORY_MASTER, TBL_PRODUCT_MAIN_CATEGORY_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getSubCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            SUB_CATEGORY_ID: TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID,
            SUB_CATEGORY_NAME: TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_NAME,
            MAIN_CATEGORY_ID: TBL_PRODUCT_SUB_CATEGORY_MASTER.MAIN_CATEGORY_ID,
            MAIN_CATEGORY_NAME: TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_NAME,
            REMARKS: TBL_PRODUCT_SUB_CATEGORY_MASTER.REMARKS,
            STATUS_MASTER: TBL_PRODUCT_SUB_CATEGORY_MASTER.STATUS_MASTER,
        })
        .from(TBL_PRODUCT_SUB_CATEGORY_MASTER)
        .leftJoin(TBL_PRODUCT_MAIN_CATEGORY_MASTER, eq(TBL_PRODUCT_SUB_CATEGORY_MASTER.MAIN_CATEGORY_ID, TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID));
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createSubCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { subCategoryName, mainCategoryId, remarks, statusMaster, user } = req.body as {
            subCategoryName: string;
            mainCategoryId: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_PRODUCT_SUB_CATEGORY_MASTER).values({
            SUB_CATEGORY_NAME: subCategoryName,
            MAIN_CATEGORY_ID: mainCategoryId,
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

export const updateSubCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const subCategoryId = parseInt(String(id));
        if (isNaN(subCategoryId)) return res.status(400).json({ msg: "Invalid ID" });

        const { subCategoryName, mainCategoryId, remarks, statusMaster, user } = req.body as {
            subCategoryName: string;
            mainCategoryId: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_PRODUCT_SUB_CATEGORY_MASTER).set({
            SUB_CATEGORY_NAME: subCategoryName,
            MAIN_CATEGORY_ID: mainCategoryId,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster,
            MODIFIED_DATE: new Date(),
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        }).where(eq(TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID, subCategoryId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Subcategory not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteSubCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const subCategoryId = parseInt(String(id));
        if (isNaN(subCategoryId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_PRODUCT_SUB_CATEGORY_MASTER).where(eq(TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID, subCategoryId));
        return res.status(200).json({ msg: "Subcategory deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteSubCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_PRODUCT_SUB_CATEGORY_MASTER).where(inArray(TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID, numericIds));
        return res.status(200).json({ msg: "Subcategories deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
