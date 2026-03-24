import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_ACCOUNTS_LEDGER_MASTER, TBL_ACCOUNTS_LEDGER_GROUP_MASTER, TBL_ACCOUNTS_HEAD_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getLedgerMasters = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            LEDGER_ID: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID,
            LEDGER_NAME: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME,
            LEDGER_GROUP_ID: TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_GROUP_ID,
            Ledger_Group_Name: TBL_ACCOUNTS_LEDGER_GROUP_MASTER.LEDGER_GROUP_NAME,
            ACCOUNT_HEAD_ID: TBL_ACCOUNTS_LEDGER_MASTER.ACCOUNT_HEAD_ID,
            Account_Head_Name: TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_NAME,
            REMARKS: TBL_ACCOUNTS_LEDGER_MASTER.REMARKS,
            STATUS_MASTER: TBL_ACCOUNTS_LEDGER_MASTER.STATUS_MASTER,
        })
        .from(TBL_ACCOUNTS_LEDGER_MASTER)
        .leftJoin(TBL_ACCOUNTS_LEDGER_GROUP_MASTER, eq(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_GROUP_ID, TBL_ACCOUNTS_LEDGER_GROUP_MASTER.LEDGER_GROUP_ID))
        .leftJoin(TBL_ACCOUNTS_HEAD_MASTER, eq(TBL_ACCOUNTS_LEDGER_MASTER.ACCOUNT_HEAD_ID, TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_ID));
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createLedgerMaster = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ledgerName, ledgerGroupId, accountHeadId, remarks, statusMaster, user } = req.body as {
            ledgerName?: string;
            ledgerGroupId?: number;
            accountHeadId?: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            LEDGER_NAME: ledgerName,
            LEDGER_GROUP_ID: ledgerGroupId,
            ACCOUNT_HEAD_ID: accountHeadId,
            Created_By: user,
            Created_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) values.REMARKS = remarks;
        if (statusMaster !== undefined) values.STATUS_MASTER = statusMaster || "Active";
        
        const result = await db.insert(TBL_ACCOUNTS_LEDGER_MASTER).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateLedgerMaster = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const ledgerId = parseInt(String(id));
        if (isNaN(ledgerId)) return res.status(400).json({ msg: "Invalid ID" });

        const { ledgerName, ledgerGroupId, accountHeadId, remarks, statusMaster, user } = req.body as {
            ledgerName?: string;
            ledgerGroupId?: number;
            accountHeadId?: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            LEDGER_NAME: ledgerName,
            LEDGER_GROUP_ID: ledgerGroupId,
            ACCOUNT_HEAD_ID: accountHeadId,
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) updates.REMARKS = remarks;
        if (statusMaster !== undefined) updates.STATUS_MASTER = statusMaster;

        const result = await db.update(TBL_ACCOUNTS_LEDGER_MASTER)
            .set(updates)
            .where(eq(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID, ledgerId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Ledger Master not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteLedgerMaster = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const ledgerId = parseInt(String(id));
        if (isNaN(ledgerId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_ACCOUNTS_LEDGER_MASTER).where(eq(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID, ledgerId));
        return res.status(200).json({ msg: "Ledger Master deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteLedgerMasters = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_ACCOUNTS_LEDGER_MASTER).where(inArray(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_ID, numericIds));
        return res.status(200).json({ msg: "Ledger Masters deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
