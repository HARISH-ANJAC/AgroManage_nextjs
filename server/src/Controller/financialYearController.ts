import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_FINANCIAL_YEAR_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getFinancialYears = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_FINANCIAL_YEAR_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createFinancialYear = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { fyName, startDate, endDate, remarks, statusMaster, user } = req.body as {
            fyName: string;
            startDate?: string;
            endDate?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_FINANCIAL_YEAR_MASTER).values({
            FY_NAME: fyName,
            START_DATE: startDate ? new Date(startDate) : null,
            END_DATE: endDate ? new Date(endDate) : null,
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

export const updateFinancialYear = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const fyId = parseInt(String(id));
        if (isNaN(fyId)) return res.status(400).json({ msg: "Invalid ID" });

        const { fyName, startDate, endDate, remarks, statusMaster, user } = req.body as {
            fyName: string;
            startDate?: string;
            endDate?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_FINANCIAL_YEAR_MASTER).set({
            FY_NAME: fyName,
            START_DATE: startDate ? new Date(startDate) : null,
            END_DATE: endDate ? new Date(endDate) : null,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster,
            MODIFIED_DATE: new Date(),
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        }).where(eq(TBL_FINANCIAL_YEAR_MASTER.FY_ID, fyId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Financial year not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteFinancialYear = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const fyId = parseInt(String(id));
        if (isNaN(fyId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_FINANCIAL_YEAR_MASTER).where(eq(TBL_FINANCIAL_YEAR_MASTER.FY_ID, fyId));
        return res.status(200).json({ msg: "Financial year deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteFinancialYears = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_FINANCIAL_YEAR_MASTER).where(inArray(TBL_FINANCIAL_YEAR_MASTER.FY_ID, numericIds));
        return res.status(200).json({ msg: "Financial years deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
