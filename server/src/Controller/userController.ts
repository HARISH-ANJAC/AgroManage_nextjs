import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_USER_INFO_HDR } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_USER_INFO_HDR);
        const mappedData = data.map(record => ({ ...record, id: record.LOGIN_ID_USER_HDR }));
        return res.status(200).json(mappedData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { 
            loginName, 
            passwordUserHdr,
            role, roleUserHdr, 
            mobileNo, mobileNoUserHdr,
            mailId, mailIdUserHdr,
            stockShowStatus, 
            outsideAccess, outsideAccessYN,
            remarks, remarksUserHdr,
            status, statusUserHdr,
            user 
        } = req.body as any;
        const systemMac = getSystemMacAddress();
        
        let finalPassword = passwordUserHdr;
        if (!finalPassword && loginName) {
            finalPassword = `${loginName}123`;
        }
        
        const hashedPassword = await bcrypt.hash(finalPassword || "123456", 10);
        
        const values: any = {
            LOGIN_NAME: loginName,
            PASSWORD_USER_HDR: hashedPassword,
            ROLE_USER_HDR: roleUserHdr || role,
            MOBILE_NO_USER_HDR: mobileNoUserHdr || mobileNo,
            MAIL_ID_USER_HDR: mailIdUserHdr || mailId,
            STOCK_SHOW_STATUS: stockShowStatus,
            OUTSIDE_ACCESS_Y_N: outsideAccessYN || outsideAccess,
            CREATED_USER_USER_HDR: user,
            CREATED_MAC_ADDR_USER_HDR: systemMac,
        };
        
        if (remarksUserHdr !== undefined || remarks !== undefined) values.REMARKS_USER_HDR = remarksUserHdr ?? remarks;
        if (statusUserHdr !== undefined || status !== undefined) values.STATUS_USER_HDR = statusUserHdr ?? (status || "Active");
        
        const result = await db.insert(TBL_USER_INFO_HDR).values(values).returning();
        return res.status(201).json({ ...result[0], id: result[0].LOGIN_ID_USER_HDR });
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
            loginName, 
            passwordUserHdr,
            role, roleUserHdr, 
            mobileNo, mobileNoUserHdr,
            mailId, mailIdUserHdr,
            stockShowStatus, 
            outsideAccess, outsideAccessYN,
            remarks, remarksUserHdr,
            status, statusUserHdr,
            user 
        } = req.body as any;
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            LOGIN_NAME: loginName,
            ROLE_USER_HDR: roleUserHdr || role,
            MOBILE_NO_USER_HDR: mobileNoUserHdr || mobileNo,
            MAIL_ID_USER_HDR: mailIdUserHdr || mailId,
            STOCK_SHOW_STATUS: stockShowStatus,
            OUTSIDE_ACCESS_Y_N: outsideAccessYN || outsideAccess,
            MODIFIED_USER_USER_HDR: user,
            MODIFIED_MAC_ADDR_USER_HDR: systemMac,
        };
        
        if (remarksUserHdr !== undefined || remarks !== undefined) updates.REMARKS_USER_HDR = remarksUserHdr ?? remarks;
        if (statusUserHdr !== undefined || status !== undefined) updates.STATUS_USER_HDR = statusUserHdr ?? (status);
        if (passwordUserHdr !== undefined && passwordUserHdr !== "") {
            updates.PASSWORD_USER_HDR = await bcrypt.hash(passwordUserHdr, 10);
        }

        const result = await db.update(TBL_USER_INFO_HDR)
            .set(updates)
            .where(eq(TBL_USER_INFO_HDR.LOGIN_ID_USER_HDR, userId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "User not found" });
        return res.status(200).json({ ...result[0], id: result[0].LOGIN_ID_USER_HDR });
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
