import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_DISTRICT_MASTER, TBL_COUNTRY_MASTER, TBL_REGION_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getDistricts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            District_id: TBL_DISTRICT_MASTER.District_id,
            Country_Id: TBL_DISTRICT_MASTER.Country_Id,
            Country_Name: TBL_COUNTRY_MASTER.Country_Name,
            Region_Id: TBL_DISTRICT_MASTER.Region_Id,
            Region_Name: TBL_REGION_MASTER.REGION_NAME,
            District_Name: TBL_DISTRICT_MASTER.District_Name,
            Total_Population: TBL_DISTRICT_MASTER.Total_Population,
            Zone_Name: TBL_DISTRICT_MASTER.Zone_Name,
            Distance_From_Arusha: TBL_DISTRICT_MASTER.Distance_From_Arusha,
            Status_Master: TBL_DISTRICT_MASTER.Status_Master,
        })
        .from(TBL_DISTRICT_MASTER)
        .leftJoin(TBL_COUNTRY_MASTER, eq(TBL_DISTRICT_MASTER.Country_Id, TBL_COUNTRY_MASTER.Country_Id))
        .leftJoin(TBL_REGION_MASTER, eq(TBL_DISTRICT_MASTER.Region_Id, TBL_REGION_MASTER.REGION_ID));
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createDistrict = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { districtName, countryId, regionId, totalPopulation, zoneName, distanceFromArusha, statusMaster, user } = req.body as {
            districtName: string;
            countryId?: number;
            regionId?: number;
            totalPopulation?: number;
            zoneName?: string;
            distanceFromArusha?: number;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_DISTRICT_MASTER).values({
            District_Name: districtName,
            Country_Id: countryId,
            Region_Id: regionId,
            Total_Population: totalPopulation ? String(totalPopulation) : null,
            Zone_Name: zoneName,
            Distance_From_Arusha: distanceFromArusha ? String(distanceFromArusha) : null,
            Status_Master: statusMaster || "Active",
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

export const updateDistrict = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const districtId = parseInt(String(id));
        if (isNaN(districtId)) return res.status(400).json({ msg: "Invalid ID" });

        const { districtName, countryId, regionId, totalPopulation, zoneName, distanceFromArusha, statusMaster, user } = req.body as {
            districtName: string;
            countryId?: number;
            regionId?: number;
            totalPopulation?: number;
            zoneName?: string;
            distanceFromArusha?: number;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_DISTRICT_MASTER).set({
            District_Name: districtName,
            Country_Id: countryId,
            Region_Id: regionId,
            Total_Population: totalPopulation ? String(totalPopulation) : null,
            Zone_Name: zoneName,
            Distance_From_Arusha: distanceFromArusha ? String(distanceFromArusha) : null,
            Status_Master: statusMaster,
            Modified_Date: new Date(),
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        }).where(eq(TBL_DISTRICT_MASTER.District_id, districtId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "District not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteDistrict = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const districtId = parseInt(String(id));
        if (isNaN(districtId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_DISTRICT_MASTER).where(eq(TBL_DISTRICT_MASTER.District_id, districtId));
        return res.status(200).json({ msg: "District deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteDistricts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_DISTRICT_MASTER).where(inArray(TBL_DISTRICT_MASTER.District_id, numericIds));
        return res.status(200).json({ msg: "Districts deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
