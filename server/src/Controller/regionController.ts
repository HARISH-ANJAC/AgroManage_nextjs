import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_REGION_MASTER, TBL_COUNTRY_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getRegions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            REGION_ID: TBL_REGION_MASTER.REGION_ID,
            REGION_NAME: TBL_REGION_MASTER.REGION_NAME,
            COUNTRY_ID: TBL_REGION_MASTER.COUNTRY_ID,
            Country_Name: TBL_COUNTRY_MASTER.Country_Name,
            CAPITAL: TBL_REGION_MASTER.CAPITAL,
            NO_OF_DISTRICTS: TBL_REGION_MASTER.NO_OF_DISTRICTS,
            TOTAL_POPULATION: TBL_REGION_MASTER.TOTAL_POPULATION,
            ZONE_NAME: TBL_REGION_MASTER.ZONE_NAME,
            DISTANCE_FROM_ARUSHA: TBL_REGION_MASTER.DISTANCE_FROM_ARUSHA,
            STATUS_MASTER: TBL_REGION_MASTER.STATUS_MASTER,
        })
        .from(TBL_REGION_MASTER)
        .leftJoin(TBL_COUNTRY_MASTER, eq(TBL_REGION_MASTER.COUNTRY_ID, TBL_COUNTRY_MASTER.Country_Id));
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createRegion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { regionName, countryId, capital, noOfDistricts, totalPopulation, zoneName, distanceFromArusha, statusMaster, user } = req.body as {
            regionName: string;
            countryId?: number;
            capital?: string;
            noOfDistricts?: number;
            totalPopulation?: number;
            zoneName?: string;
            distanceFromArusha?: number;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_REGION_MASTER).values({
            REGION_NAME: regionName,
            COUNTRY_ID: countryId,
            CAPITAL: capital,
            NO_OF_DISTRICTS: noOfDistricts ? parseInt(String(noOfDistricts)) : null,
            TOTAL_POPULATION: totalPopulation ? String(totalPopulation) : null,
            ZONE_NAME: zoneName,
            DISTANCE_FROM_ARUSHA: distanceFromArusha ? String(distanceFromArusha) : null,
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

export const updateRegion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const regionId = parseInt(String(id));
        if (isNaN(regionId)) return res.status(400).json({ msg: "Invalid ID" });

        const { regionName, countryId, capital, noOfDistricts, totalPopulation, zoneName, distanceFromArusha, statusMaster, user } = req.body as {
            regionName: string;
            countryId?: number;
            capital?: string;
            noOfDistricts?: number;
            totalPopulation?: number;
            zoneName?: string;
            distanceFromArusha?: number;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_REGION_MASTER).set({
            REGION_NAME: regionName,
            COUNTRY_ID: countryId,
            CAPITAL: capital,
            NO_OF_DISTRICTS: noOfDistricts ? parseInt(String(noOfDistricts)) : null,
            TOTAL_POPULATION: totalPopulation ? String(totalPopulation) : null,
            ZONE_NAME: zoneName,
            DISTANCE_FROM_ARUSHA: distanceFromArusha ? String(distanceFromArusha) : null,
            STATUS_MASTER: statusMaster,
            MODIFIED_DATE: new Date(),
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        }).where(eq(TBL_REGION_MASTER.REGION_ID, regionId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Region not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteRegion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const regionId = parseInt(String(id));
        if (isNaN(regionId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_REGION_MASTER).where(eq(TBL_REGION_MASTER.REGION_ID, regionId));
        return res.status(200).json({ msg: "Region deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteRegions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_REGION_MASTER).where(inArray(TBL_REGION_MASTER.REGION_ID, numericIds));
        return res.status(200).json({ msg: "Regions deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
