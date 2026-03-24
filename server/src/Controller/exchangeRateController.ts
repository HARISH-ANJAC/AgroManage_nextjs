import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_EXCHANGE_RATE_MASTER, TBL_COMPANY_MASTER, TBL_CURRENCY_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getExchangeRates = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            EXCHANGE_RATE_ID: TBL_EXCHANGE_RATE_MASTER.SNO,
            Company_ID: TBL_EXCHANGE_RATE_MASTER.Company_ID,
            Company_Name: TBL_COMPANY_MASTER.Company_Name,
            CURRENCY_ID: TBL_EXCHANGE_RATE_MASTER.CURRENCY_ID,
            Currency_Name: TBL_CURRENCY_MASTER.CURRENCY_NAME,
            Exchange_Rate: TBL_EXCHANGE_RATE_MASTER.Exchange_Rate,
            REMARKS: TBL_EXCHANGE_RATE_MASTER.REMARKS,
            STATUS_MASTER: TBL_EXCHANGE_RATE_MASTER.STATUS_MASTER,
        })
        .from(TBL_EXCHANGE_RATE_MASTER)
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_EXCHANGE_RATE_MASTER.Company_ID, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_CURRENCY_MASTER, eq(TBL_EXCHANGE_RATE_MASTER.CURRENCY_ID, TBL_CURRENCY_MASTER.CURRENCY_ID));
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createExchangeRate = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { companyId, currencyId, exchangeRate, remarks, statusMaster, user } = req.body as {
            companyId?: number;
            currencyId?: number;
            exchangeRate?: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_EXCHANGE_RATE_MASTER).values({
            Company_ID: companyId,
            CURRENCY_ID: currencyId,
            Exchange_Rate: exchangeRate ? String(exchangeRate) : null,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster || "Active",
            Created_Date: new Date(),
            Created_By: user,
            Created_Mac_Address: systemMac,
        }).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateExchangeRate = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const exchangeRateId = parseInt(String(id));
        if (isNaN(exchangeRateId)) return res.status(400).json({ msg: "Invalid ID" });

        const { companyId, currencyId, exchangeRate, remarks, statusMaster, user } = req.body as {
            companyId?: number;
            currencyId?: number;
            exchangeRate?: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_EXCHANGE_RATE_MASTER).set({
            Company_ID: companyId,
            CURRENCY_ID: currencyId,
            Exchange_Rate: exchangeRate ? String(exchangeRate) : null,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster,
            Modified_Date: new Date(),
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        }).where(eq(TBL_EXCHANGE_RATE_MASTER.SNO, exchangeRateId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Exchange Rate not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteExchangeRate = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const exchangeRateId = parseInt(String(id));
        if (isNaN(exchangeRateId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_EXCHANGE_RATE_MASTER).where(eq(TBL_EXCHANGE_RATE_MASTER.SNO, exchangeRateId));
        return res.status(200).json({ msg: "Exchange Rate deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteExchangeRates = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_EXCHANGE_RATE_MASTER).where(inArray(TBL_EXCHANGE_RATE_MASTER.SNO, numericIds));
        return res.status(200).json({ msg: "Exchange Rates deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
