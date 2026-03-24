import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_PRODUCT_UOM_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getUoms = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_PRODUCT_UOM_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createUom = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { uomName, uomShortCode, remarks, statusMaster, user } = req.body as {
            uomName: string;
            uomShortCode?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_PRODUCT_UOM_MASTER).values({
            UOM_NAME: uomName,
            UOM_SHORT_CODE: uomShortCode,
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

export const updateUom = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const uomId = parseInt(String(id));
        if (isNaN(uomId)) return res.status(400).json({ msg: "Invalid ID" });

        const { uomName, uomShortCode, remarks, statusMaster, user } = req.body as {
            uomName: string;
            uomShortCode?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_PRODUCT_UOM_MASTER).set({
            UOM_NAME: uomName,
            UOM_SHORT_CODE: uomShortCode,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster,
            MODIFIED_DATE: new Date(),
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        }).where(eq(TBL_PRODUCT_UOM_MASTER.UOM_ID, uomId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "UOM not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteUom = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const uomId = parseInt(String(id));
        if (isNaN(uomId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_PRODUCT_UOM_MASTER).where(eq(TBL_PRODUCT_UOM_MASTER.UOM_ID, uomId));
        return res.status(200).json({ msg: "UOM deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteUoms = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_PRODUCT_UOM_MASTER).where(inArray(TBL_PRODUCT_UOM_MASTER.UOM_ID, numericIds));
        return res.status(200).json({ msg: "UOMs deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
