import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_CURRENCY_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getCurrencies = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_CURRENCY_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createCurrency = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { currencyName, address, exchangeRate, remarks, statusMaster, user } = req.body as {
            currencyName: string;
            address?: string;
            exchangeRate?: number | string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_CURRENCY_MASTER).values({
            CURRENCY_NAME: currencyName,
            ADDRESS: address,
            Exchange_Rate: exchangeRate ? String(exchangeRate) : null,
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

export const updateCurrency = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const currencyId = parseInt(String(id));
        if (isNaN(currencyId)) return res.status(400).json({ msg: "Invalid ID" });

        const { currencyName, address, exchangeRate, remarks, statusMaster, user } = req.body as {
            currencyName: string;
            address?: string;
            exchangeRate?: number | string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_CURRENCY_MASTER).set({
            CURRENCY_NAME: currencyName,
            ADDRESS: address,
            Exchange_Rate: exchangeRate ? String(exchangeRate) : null,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster,
            MODIFIED_DATE: new Date(),
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        }).where(eq(TBL_CURRENCY_MASTER.CURRENCY_ID, currencyId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Currency not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteCurrency = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const currencyId = parseInt(String(id));
        if (isNaN(currencyId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_CURRENCY_MASTER).where(eq(TBL_CURRENCY_MASTER.CURRENCY_ID, currencyId));
        return res.status(200).json({ msg: "Currency deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteCurrencies = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_CURRENCY_MASTER).where(inArray(TBL_CURRENCY_MASTER.CURRENCY_ID, numericIds));
        return res.status(200).json({ msg: "Currencies deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
