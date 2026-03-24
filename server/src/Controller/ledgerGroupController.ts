import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_ACCOUNTS_LEDGER_GROUP_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getLedgerGroups = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_ACCOUNTS_LEDGER_GROUP_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createLedgerGroup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ledgerGroupName, remarks, statusMaster, user } = req.body as {
            ledgerGroupName?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            LEDGER_GROUP_NAME: ledgerGroupName,
            Created_By: user,
            Created_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) values.REMARKS = remarks;
        if (statusMaster !== undefined) values.STATUS_MASTER = statusMaster || "Active";
        
        const result = await db.insert(TBL_ACCOUNTS_LEDGER_GROUP_MASTER).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateLedgerGroup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const ledgerGroupId = parseInt(String(id));
        if (isNaN(ledgerGroupId)) return res.status(400).json({ msg: "Invalid ID" });

        const { ledgerGroupName, remarks, statusMaster, user } = req.body as {
            ledgerGroupName?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            LEDGER_GROUP_NAME: ledgerGroupName,
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) updates.REMARKS = remarks;
        if (statusMaster !== undefined) updates.STATUS_MASTER = statusMaster;

        const result = await db.update(TBL_ACCOUNTS_LEDGER_GROUP_MASTER)
            .set(updates)
            .where(eq(TBL_ACCOUNTS_LEDGER_GROUP_MASTER.LEDGER_GROUP_ID, ledgerGroupId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Ledger Group not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteLedgerGroup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const ledgerGroupId = parseInt(String(id));
        if (isNaN(ledgerGroupId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_ACCOUNTS_LEDGER_GROUP_MASTER).where(eq(TBL_ACCOUNTS_LEDGER_GROUP_MASTER.LEDGER_GROUP_ID, ledgerGroupId));
        return res.status(200).json({ msg: "Ledger Group deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteLedgerGroups = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_ACCOUNTS_LEDGER_GROUP_MASTER).where(inArray(TBL_ACCOUNTS_LEDGER_GROUP_MASTER.LEDGER_GROUP_ID, numericIds));
        return res.status(200).json({ msg: "Ledger Groups deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
