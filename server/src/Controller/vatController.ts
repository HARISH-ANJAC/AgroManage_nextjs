import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_VAT_PERCENTAGE_SETTING, TBL_COMPANY_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getVats = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            SNO: TBL_VAT_PERCENTAGE_SETTING.SNO,
            COMPANY_ID: TBL_VAT_PERCENTAGE_SETTING.COMPANY_ID,
            Company_Name: TBL_COMPANY_MASTER.Company_Name,
            VAT_PERCENTAGE: TBL_VAT_PERCENTAGE_SETTING.VAT_PERCENTAGE,
            EFFECTIVE_FROM: TBL_VAT_PERCENTAGE_SETTING.EFFECTIVE_FROM,
            EFFECTIVE_TO: TBL_VAT_PERCENTAGE_SETTING.EFFECTIVE_TO,
            REMARKS: TBL_VAT_PERCENTAGE_SETTING.REMARKS,
            STATUS_MASTER: TBL_VAT_PERCENTAGE_SETTING.STATUS_MASTER,
        })
        .from(TBL_VAT_PERCENTAGE_SETTING)
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_VAT_PERCENTAGE_SETTING.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id));
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createVat = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { companyId, vatPercentage, effectiveFrom, effectiveTo, remarks, statusMaster, user } = req.body as {
            companyId?: number;
            vatPercentage: number | string;
            effectiveFrom?: string;
            effectiveTo?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_VAT_PERCENTAGE_SETTING).values({
            COMPANY_ID: companyId,
            VAT_PERCENTAGE: vatPercentage ? String(vatPercentage) : null,
            EFFECTIVE_FROM: effectiveFrom ? new Date(effectiveFrom) : null,
            EFFECTIVE_TO: effectiveTo ? new Date(effectiveTo) : null,
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

export const updateVat = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const vatId = parseInt(String(id));
        if (isNaN(vatId)) return res.status(400).json({ msg: "Invalid ID" });

        const { companyId, vatPercentage, effectiveFrom, effectiveTo, remarks, statusMaster, user } = req.body as {
            companyId?: number;
            vatPercentage: number | string;
            effectiveFrom?: string;
            effectiveTo?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_VAT_PERCENTAGE_SETTING).set({
            COMPANY_ID: companyId,
            VAT_PERCENTAGE: vatPercentage ? String(vatPercentage) : null,
            EFFECTIVE_FROM: effectiveFrom ? new Date(effectiveFrom) : null,
            EFFECTIVE_TO: effectiveTo ? new Date(effectiveTo) : null,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster,
            MODIFIED_DATE: new Date(),
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        }).where(eq(TBL_VAT_PERCENTAGE_SETTING.SNO, vatId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "VAT ID not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteVat = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const vatId = parseInt(String(id));
        if (isNaN(vatId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_VAT_PERCENTAGE_SETTING).where(eq(TBL_VAT_PERCENTAGE_SETTING.SNO, vatId));
        return res.status(200).json({ msg: "VAT status deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteVats = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_VAT_PERCENTAGE_SETTING).where(inArray(TBL_VAT_PERCENTAGE_SETTING.SNO, numericIds));
        return res.status(200).json({ msg: "VAT settings deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
