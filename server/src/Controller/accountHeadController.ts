import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_ACCOUNTS_HEAD_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getAccountHeads = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_ACCOUNTS_HEAD_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createAccountHead = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { accountHeadName, remarks, statusMaster, user } = req.body as {
            accountHeadName?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            ACCOUNT_HEAD_NAME: accountHeadName,
            Created_By: user,
            Created_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) values.REMARKS = remarks;
        if (statusMaster !== undefined) values.STATUS_MASTER = statusMaster || "Active";
        
        const result = await db.insert(TBL_ACCOUNTS_HEAD_MASTER).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateAccountHead = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const accountHeadId = parseInt(String(id));
        if (isNaN(accountHeadId)) return res.status(400).json({ msg: "Invalid ID" });

        const { accountHeadName, remarks, statusMaster, user } = req.body as {
            accountHeadName?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            ACCOUNT_HEAD_NAME: accountHeadName,
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) updates.REMARKS = remarks;
        if (statusMaster !== undefined) updates.STATUS_MASTER = statusMaster;

        const result = await db.update(TBL_ACCOUNTS_HEAD_MASTER)
            .set(updates)
            .where(eq(TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_ID, accountHeadId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Account Head not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteAccountHead = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const accountHeadId = parseInt(String(id));
        if (isNaN(accountHeadId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_ACCOUNTS_HEAD_MASTER).where(eq(TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_ID, accountHeadId));
        return res.status(200).json({ msg: "Account Head deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteAccountHeads = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_ACCOUNTS_HEAD_MASTER).where(inArray(TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_ID, numericIds));
        return res.status(200).json({ msg: "Account Heads deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
