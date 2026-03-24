import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_COUNTRY_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getCountries = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_COUNTRY_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createCountry = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { countryName, nicename, iso3, numcode, phonecode, batchNo, remarks, statusMaster, user } = req.body as {
            countryName: string;
            nicename?: string;
            iso3?: string;
            numcode?: number;
            phonecode?: number;
            batchNo?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_COUNTRY_MASTER).values({
            Country_Name: countryName,
            nicename: nicename,
            iso3: iso3,
            numcode: numcode,
            phonecode: phonecode,
            Batch_No: batchNo,
            Remarks: remarks,
            Status_Master: statusMaster || "Active",
            Created_Date: new Date(),
            Created_User: user,
            Created_Mac_Address: systemMac,
        }).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateCountry = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const countryId = parseInt(String(id));
        if (isNaN(countryId)) return res.status(400).json({ msg: "Invalid ID" });

        const { countryName, nicename, iso3, numcode, phonecode, batchNo, remarks, statusMaster, user } = req.body as {
            countryName: string;
            nicename?: string;
            iso3?: string;
            numcode?: number;
            phonecode?: number;
            batchNo?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_COUNTRY_MASTER).set({
            Country_Name: countryName,
            nicename: nicename,
            iso3: iso3,
            numcode: numcode,
            phonecode: phonecode,
            Batch_No: batchNo,
            Remarks: remarks,
            Status_Master: statusMaster,
            Modified_Date: new Date(),
            Modified_User: user,
            Modified_Mac_Address: systemMac,
        }).where(eq(TBL_COUNTRY_MASTER.Country_Id, countryId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Country not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteCountry = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const countryId = parseInt(String(id));
        if (isNaN(countryId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_COUNTRY_MASTER).where(eq(TBL_COUNTRY_MASTER.Country_Id, countryId));
        return res.status(200).json({ msg: "Country deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteCountries = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_COUNTRY_MASTER).where(inArray(TBL_COUNTRY_MASTER.Country_Id, numericIds));
        return res.status(200).json({ msg: "Countries deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
