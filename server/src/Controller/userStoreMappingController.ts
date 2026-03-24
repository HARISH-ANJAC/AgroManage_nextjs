import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_USER_TO_STORE_MAPPING, TBL_USER_INFO_HDR, TBL_COMPANY_MASTER, TBL_STORE_MASTER, TBL_ROLE_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getUserStoreMappings = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            Id: TBL_USER_TO_STORE_MAPPING.USER_TO_LOCATION_ID_USER_TO_ROLE,
            USER_ID_USER_TO_ROLE: TBL_USER_TO_STORE_MAPPING.USER_ID_USER_TO_ROLE,
            LOGIN_NAME: TBL_USER_INFO_HDR.LOGIN_NAME,
            COMPANY_ID: TBL_USER_TO_STORE_MAPPING.COMPANY_ID,
            Company_Name: TBL_COMPANY_MASTER.Company_Name,
            STORE_ID_USER_TO_ROLE: TBL_USER_TO_STORE_MAPPING.STORE_ID_USER_TO_ROLE,
            Store_Name: TBL_STORE_MASTER.Store_Name,
            ROLE_ID_USER_TO_ROLE: TBL_USER_TO_STORE_MAPPING.ROLE_ID_USER_TO_ROLE,
            ROLE_NAME: TBL_ROLE_MASTER.ROLE_NAME,
            STATUS_USER_TO_ROLE: TBL_USER_TO_STORE_MAPPING.STATUS_USER_TO_ROLE,
        })
        .from(TBL_USER_TO_STORE_MAPPING)
        .leftJoin(TBL_USER_INFO_HDR, eq(TBL_USER_TO_STORE_MAPPING.USER_ID_USER_TO_ROLE, TBL_USER_INFO_HDR.LOGIN_ID_USER_HDR))
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_USER_TO_STORE_MAPPING.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_STORE_MASTER, eq(TBL_USER_TO_STORE_MAPPING.STORE_ID_USER_TO_ROLE, TBL_STORE_MASTER.Store_Id))
        .leftJoin(TBL_ROLE_MASTER, eq(TBL_USER_TO_STORE_MAPPING.ROLE_ID_USER_TO_ROLE, TBL_ROLE_MASTER.ROLE_ID));
        
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createUserStoreMapping = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId, companyId, storeId, roleId, status, user } = req.body as {
            userId?: number;
            companyId?: number;
            storeId?: number;
            roleId?: number;
            status?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            USER_ID_USER_TO_ROLE: userId,
            COMPANY_ID: companyId,
            STORE_ID_USER_TO_ROLE: storeId,
            ROLE_ID_USER_TO_ROLE: roleId,
            CREATED_USER_USER_TO_ROLE: user,
            CREATED_MAC_ADDR_USER_TO_ROLE: systemMac,
        };
        
        if (status !== undefined) values.STATUS_USER_TO_ROLE = status || "Active";
        
        const result = await db.insert(TBL_USER_TO_STORE_MAPPING).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateUserStoreMapping = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const mappingId = parseInt(String(id));
        if (isNaN(mappingId)) return res.status(400).json({ msg: "Invalid ID" });

        const { userId, companyId, storeId, roleId, status, user } = req.body as {
            userId?: number;
            companyId?: number;
            storeId?: number;
            roleId?: number;
            status?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            USER_ID_USER_TO_ROLE: userId,
            COMPANY_ID: companyId,
            STORE_ID_USER_TO_ROLE: storeId,
            ROLE_ID_USER_TO_ROLE: roleId,
            MODIFIED_USER_USER_TO_ROLE: user,
            MODIFIED_MAC_ADDR_USER_TO_ROLE: systemMac,
        };
        
        if (status !== undefined) updates.STATUS_USER_TO_ROLE = status;

        const result = await db.update(TBL_USER_TO_STORE_MAPPING)
            .set(updates)
            .where(eq(TBL_USER_TO_STORE_MAPPING.USER_TO_LOCATION_ID_USER_TO_ROLE, mappingId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Mapping not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteUserStoreMapping = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const mappingId = parseInt(String(id));
        if (isNaN(mappingId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_USER_TO_STORE_MAPPING).where(eq(TBL_USER_TO_STORE_MAPPING.USER_TO_LOCATION_ID_USER_TO_ROLE, mappingId));
        return res.status(200).json({ msg: "Mapping deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteUserStoreMappings = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_USER_TO_STORE_MAPPING).where(inArray(TBL_USER_TO_STORE_MAPPING.USER_TO_LOCATION_ID_USER_TO_ROLE, numericIds));
        return res.status(200).json({ msg: "Mappings deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
