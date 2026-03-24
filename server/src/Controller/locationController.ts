import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_LOCATION_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getLocations = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_LOCATION_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createLocation = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { locationName, locationDescription, remarks, statusMaster, user } = req.body as {
            locationName: string;
            locationDescription?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_LOCATION_MASTER).values({
            Location_Name: locationName,
            Location_Description: locationDescription,
            Remarks: remarks,
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

export const updateLocation = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const locationId = parseInt(String(id));
        if (isNaN(locationId)) return res.status(400).json({ msg: "Invalid ID" });

        const { locationName, locationDescription, remarks, statusMaster, user } = req.body as {
            locationName: string;
            locationDescription?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_LOCATION_MASTER).set({
            Location_Name: locationName,
            Location_Description: locationDescription,
            Remarks: remarks,
            Status_Master: statusMaster,
            Modified_Date: new Date(),
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        }).where(eq(TBL_LOCATION_MASTER.Location_Id, locationId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Location not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteLocation = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const locationId = parseInt(String(id));
        if (isNaN(locationId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_LOCATION_MASTER).where(eq(TBL_LOCATION_MASTER.Location_Id, locationId));
        return res.status(200).json({ msg: "Location deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteLocations = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_LOCATION_MASTER).where(inArray(TBL_LOCATION_MASTER.Location_Id, numericIds));
        return res.status(200).json({ msg: "Locations deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
