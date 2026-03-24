import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_STORE_MASTER, TBL_LOCATION_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getStores = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            Store_Id: TBL_STORE_MASTER.Store_Id,
            Store_Name: TBL_STORE_MASTER.Store_Name,
            Location_Id: TBL_STORE_MASTER.Location_Id,
            Location_Name: TBL_LOCATION_MASTER.Location_Name,
            Manager_Name: TBL_STORE_MASTER.Manager_Name,
            Store_Short_Code: TBL_STORE_MASTER.Store_Short_Code,
            Store_Short_Name: TBL_STORE_MASTER.Store_Short_Name,
            Email_Address: TBL_STORE_MASTER.Email_Address,
            CC_Email_Address: TBL_STORE_MASTER.CC_Email_Address,
            BCC_Email_Address: TBL_STORE_MASTER.BCC_Email_Address,
            Response_Directors_Name: TBL_STORE_MASTER.Response_Directors_Name,
            Remarks: TBL_STORE_MASTER.Remarks,
            Status_Master: TBL_STORE_MASTER.Status_Master,
        })
        .from(TBL_STORE_MASTER)
        .leftJoin(TBL_LOCATION_MASTER, eq(TBL_STORE_MASTER.Location_Id, TBL_LOCATION_MASTER.Location_Id));
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createStore = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { 
            storeName, locationId, managerName, storeShortCode, 
            storeShortName, emailAddress, ccEmailAddress, bccEmailAddress, 
            responseDirectorsName, remarks, statusMaster, user 
        } = req.body as {
            storeName: string;
            locationId?: number;
            managerName?: string;
            storeShortCode?: string;
            storeShortName?: string;
            emailAddress?: string;
            ccEmailAddress?: string;
            bccEmailAddress?: string;
            responseDirectorsName?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_STORE_MASTER).values({
            Store_Name: storeName,
            Location_Id: locationId,
            Manager_Name: managerName,
            Store_Short_Code: storeShortCode,
            Store_Short_Name: storeShortName,
            Email_Address: emailAddress,
            CC_Email_Address: ccEmailAddress,
            BCC_Email_Address: bccEmailAddress,
            Response_Directors_Name: responseDirectorsName,
            Remarks: remarks,
            Status_Master: statusMaster || "Active",
            Created_By: user,
            Created_Date: new Date(),
            Created_Mac_Address: systemMac,
        }).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateStore = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const storeId = parseInt(String(id));
        if (isNaN(storeId)) return res.status(400).json({ msg: "Invalid ID" });

        const { 
            storeName, locationId, managerName, storeShortCode, 
            storeShortName, emailAddress, ccEmailAddress, bccEmailAddress, 
            responseDirectorsName, remarks, statusMaster, user 
        } = req.body as {
            storeName: string;
            locationId?: number;
            managerName?: string;
            storeShortCode?: string;
            storeShortName?: string;
            emailAddress?: string;
            ccEmailAddress?: string;
            bccEmailAddress?: string;
            responseDirectorsName?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_STORE_MASTER).set({
            Store_Name: storeName,
            Location_Id: locationId,
            Manager_Name: managerName,
            Store_Short_Code: storeShortCode,
            Store_Short_Name: storeShortName,
            Email_Address: emailAddress,
            CC_Email_Address: ccEmailAddress,
            BCC_Email_Address: bccEmailAddress,
            Response_Directors_Name: responseDirectorsName,
            Remarks: remarks,
            Status_Master: statusMaster,
            Modified_By: user,
            Modified_Date: new Date(),
            Modified_Mac_Address: systemMac,
        }).where(eq(TBL_STORE_MASTER.Store_Id, storeId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Store not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteStore = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const storeId = parseInt(String(id));
        if (isNaN(storeId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_STORE_MASTER).where(eq(TBL_STORE_MASTER.Store_Id, storeId));
        return res.status(200).json({ msg: "Store deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteStores = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_STORE_MASTER).where(inArray(TBL_STORE_MASTER.Store_Id, numericIds));
        return res.status(200).json({ msg: "Stores deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
