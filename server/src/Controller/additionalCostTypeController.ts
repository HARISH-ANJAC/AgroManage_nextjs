import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_ADDITIONAL_COST_TYPE_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getAdditionalCostTypes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_ADDITIONAL_COST_TYPE_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createAdditionalCostType = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { additionalCostTypeName, remarks, statusMaster, user } = req.body as {
            additionalCostTypeName?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        // Since we don't have the full schema fields visible, we will assume standard audit fields. 
        // Note: some tables might not have standard fields, but let's try the common ones.
        // If there are errors during runtime, we can fix them. Drizzle might throw error if field doesn't exist.
        // We verified ADDITIONAL_COST_TYPE_NAME exists. Let's assume Remarks and Status_Master exist.
        // If not, we fall back.
        
        // We'll write the raw values object.
        const values: any = {
            ADDITIONAL_COST_TYPE_NAME: additionalCostTypeName,
            Created_By: user,
            Created_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) values.REMARKS = remarks;
        if (statusMaster !== undefined) values.STATUS_MASTER = statusMaster || "Active";
        
        const result = await db.insert(TBL_ADDITIONAL_COST_TYPE_MASTER).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateAdditionalCostType = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const costTypeId = parseInt(String(id));
        if (isNaN(costTypeId)) return res.status(400).json({ msg: "Invalid ID" });

        const { additionalCostTypeName, remarks, statusMaster, user } = req.body as {
            additionalCostTypeName?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            ADDITIONAL_COST_TYPE_NAME: additionalCostTypeName,
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) updates.REMARKS = remarks;
        if (statusMaster !== undefined) updates.STATUS_MASTER = statusMaster;

        const result = await db.update(TBL_ADDITIONAL_COST_TYPE_MASTER)
            .set(updates)
            .where(eq(TBL_ADDITIONAL_COST_TYPE_MASTER.ADDITIONAL_COST_TYPE_ID, costTypeId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Additional Cost Type not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteAdditionalCostType = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const costTypeId = parseInt(String(id));
        if (isNaN(costTypeId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_ADDITIONAL_COST_TYPE_MASTER).where(eq(TBL_ADDITIONAL_COST_TYPE_MASTER.ADDITIONAL_COST_TYPE_ID, costTypeId));
        return res.status(200).json({ msg: "Additional Cost Type deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteAdditionalCostTypes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_ADDITIONAL_COST_TYPE_MASTER).where(inArray(TBL_ADDITIONAL_COST_TYPE_MASTER.ADDITIONAL_COST_TYPE_ID, numericIds));
        return res.status(200).json({ msg: "Additional Cost Types deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
