import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_BILLING_LOCATION_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getBillingLocations = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_BILLING_LOCATION_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createBillingLocation = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { billingLocationName, billingLocationDescription, remarks, statusMaster, user } = req.body as {
            billingLocationName: string;
            billingLocationDescription?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_BILLING_LOCATION_MASTER).values({
            Billing_Location_Name: billingLocationName,
            Billing_Location_Description: billingLocationDescription,
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

export const updateBillingLocation = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const billingLocationId = parseInt(String(id));
        if (isNaN(billingLocationId)) return res.status(400).json({ msg: "Invalid ID" });

        const { billingLocationName, billingLocationDescription, remarks, statusMaster, user } = req.body as {
            billingLocationName: string;
            billingLocationDescription?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_BILLING_LOCATION_MASTER).set({
            Billing_Location_Name: billingLocationName,
            Billing_Location_Description: billingLocationDescription,
            Remarks: remarks,
            Status_Master: statusMaster,
            Modified_Date: new Date(),
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        }).where(eq(TBL_BILLING_LOCATION_MASTER.Billing_Location_Id, billingLocationId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Billing Location not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteBillingLocation = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const billingLocationId = parseInt(String(id));
        if (isNaN(billingLocationId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_BILLING_LOCATION_MASTER).where(eq(TBL_BILLING_LOCATION_MASTER.Billing_Location_Id, billingLocationId));
        return res.status(200).json({ msg: "Billing Location deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteBillingLocations = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_BILLING_LOCATION_MASTER).where(inArray(TBL_BILLING_LOCATION_MASTER.Billing_Location_Id, numericIds));
        return res.status(200).json({ msg: "Billing Locations deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
