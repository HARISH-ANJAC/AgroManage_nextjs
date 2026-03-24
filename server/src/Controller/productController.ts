import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_PRODUCT_MASTER, TBL_PRODUCT_MAIN_CATEGORY_MASTER, TBL_PRODUCT_SUB_CATEGORY_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            PRODUCT_ID: TBL_PRODUCT_MASTER.PRODUCT_ID,
            PRODUCT_NAME: TBL_PRODUCT_MASTER.PRODUCT_NAME,
            MAIN_CATEGORY_ID: TBL_PRODUCT_MASTER.MAIN_CATEGORY_ID,
            MAIN_CATEGORY_NAME: TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_NAME,
            SUB_CATEGORY_ID: TBL_PRODUCT_MASTER.SUB_CATEGORY_ID,
            SUB_CATEGORY_NAME: TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_NAME,
            UOM: TBL_PRODUCT_MASTER.UOM,
            QTY_PER_PACKING: TBL_PRODUCT_MASTER.QTY_PER_PACKING,
            ALTERNATE_UOM: TBL_PRODUCT_MASTER.ALTERNATE_UOM,
            REMARKS: TBL_PRODUCT_MASTER.REMARKS,
            STATUS_MASTER: TBL_PRODUCT_MASTER.STATUS_MASTER,
        })
        .from(TBL_PRODUCT_MASTER)
        .leftJoin(TBL_PRODUCT_MAIN_CATEGORY_MASTER, eq(TBL_PRODUCT_MASTER.MAIN_CATEGORY_ID, TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID))
        .leftJoin(TBL_PRODUCT_SUB_CATEGORY_MASTER, eq(TBL_PRODUCT_MASTER.SUB_CATEGORY_ID, TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID));
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { productName, mainCategoryId, subCategoryId, uom, qtyPerPacking, alternateUom, remarks, statusMaster, user } = req.body as {
            productName: string;
            mainCategoryId?: number;
            subCategoryId?: number;
            uom?: string;
            qtyPerPacking?: number | string;
            alternateUom?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_PRODUCT_MASTER).values({
            PRODUCT_NAME: productName,
            MAIN_CATEGORY_ID: mainCategoryId,
            SUB_CATEGORY_ID: subCategoryId,
            UOM: uom,
            QTY_PER_PACKING: qtyPerPacking ? String(qtyPerPacking) : null,
            ALTERNATE_UOM: alternateUom,
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

export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const productId = parseInt(String(id));
        if (isNaN(productId)) return res.status(400).json({ msg: "Invalid ID" });

        const { productName, mainCategoryId, subCategoryId, uom, qtyPerPacking, alternateUom, remarks, statusMaster, user } = req.body as {
            productName: string;
            mainCategoryId?: number;
            subCategoryId?: number;
            uom?: string;
            qtyPerPacking?: number | string;
            alternateUom?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_PRODUCT_MASTER).set({
            PRODUCT_NAME: productName,
            MAIN_CATEGORY_ID: mainCategoryId,
            SUB_CATEGORY_ID: subCategoryId,
            UOM: uom,
            QTY_PER_PACKING: qtyPerPacking ? String(qtyPerPacking) : null,
            ALTERNATE_UOM: alternateUom,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster,
            MODIFIED_DATE: new Date(),
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        }).where(eq(TBL_PRODUCT_MASTER.PRODUCT_ID, productId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Product not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const productId = parseInt(String(id));
        if (isNaN(productId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_PRODUCT_MASTER).where(eq(TBL_PRODUCT_MASTER.PRODUCT_ID, productId));
        return res.status(200).json({ msg: "Product deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_PRODUCT_MASTER).where(inArray(TBL_PRODUCT_MASTER.PRODUCT_ID, numericIds));
        return res.status(200).json({ msg: "Products deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
