import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_USER_INFO_HDR } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_USER_INFO_HDR);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { 
            loginName, role, mobileNo, mailId, stockShowStatus, outsideAccess, remarks, status, user 
        } = req.body as {
            loginName?: string;
            role?: string;
            mobileNo?: string;
            mailId?: string;
            stockShowStatus?: string;
            outsideAccess?: string;
            remarks?: string;
            status?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            LOGIN_NAME: loginName,
            ROLE_USER_HDR: role,
            MOBILE_NO_USER_HDR: mobileNo,
            MAIL_ID_USER_HDR: mailId,
            STOCK_SHOW_STATUS: stockShowStatus,
            OUTSIDE_ACCESS_Y_N: outsideAccess,
            CREATED_USER_USER_HDR: user,
            CREATED_MAC_ADDR_USER_HDR: systemMac,
        };
        
        if (remarks !== undefined) values.REMARKS_USER_HDR = remarks;
        if (status !== undefined) values.STATUS_USER_HDR = status || "Active";
        
        const result = await db.insert(TBL_USER_INFO_HDR).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userId = parseInt(String(id));
        if (isNaN(userId)) return res.status(400).json({ msg: "Invalid ID" });

        const { 
            loginName, role, mobileNo, mailId, stockShowStatus, outsideAccess, remarks, status, user 
        } = req.body as {
            loginName?: string;
            role?: string;
            mobileNo?: string;
            mailId?: string;
            stockShowStatus?: string;
            outsideAccess?: string;
            remarks?: string;
            status?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            LOGIN_NAME: loginName,
            ROLE_USER_HDR: role,
            MOBILE_NO_USER_HDR: mobileNo,
            MAIL_ID_USER_HDR: mailId,
            STOCK_SHOW_STATUS: stockShowStatus,
            OUTSIDE_ACCESS_Y_N: outsideAccess,
            MODIFIED_USER_USER_HDR: user,
            MODIFIED_MAC_ADDR_USER_HDR: systemMac,
        };
        
        if (remarks !== undefined) updates.REMARKS_USER_HDR = remarks;
        if (status !== undefined) updates.STATUS_USER_HDR = status;

        const result = await db.update(TBL_USER_INFO_HDR)
            .set(updates)
            .where(eq(TBL_USER_INFO_HDR.LOGIN_ID_USER_HDR, userId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "User not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userId = parseInt(String(id));
        if (isNaN(userId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_USER_INFO_HDR).where(eq(TBL_USER_INFO_HDR.LOGIN_ID_USER_HDR, userId));
        return res.status(200).json({ msg: "User deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_USER_INFO_HDR).where(inArray(TBL_USER_INFO_HDR.LOGIN_ID_USER_HDR, numericIds));
        return res.status(200).json({ msg: "Users deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
