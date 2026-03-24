import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_ROLE_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getRoles = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_ROLE_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createRole = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { roleName, roleDescription, remarks, statusMaster, user } = req.body as {
            roleName: string;
            roleDescription?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_ROLE_MASTER).values({
            ROLE_NAME: roleName,
            ROLE_DESCRIPTION: roleDescription,
            REMARKS: remarks,
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

export const updateRole = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const roleId = parseInt(String(id));
        if (isNaN(roleId)) return res.status(400).json({ msg: "Invalid ID" });

        const { roleName, roleDescription, remarks, statusMaster, user } = req.body as {
            roleName: string;
            roleDescription?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_ROLE_MASTER).set({
            ROLE_NAME: roleName,
            ROLE_DESCRIPTION: roleDescription,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster,
            MODIFIED_DATE: new Date(),
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        }).where(eq(TBL_ROLE_MASTER.ROLE_ID, roleId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Role not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteRole = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const roleId = parseInt(String(id));
        if (isNaN(roleId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_ROLE_MASTER).where(eq(TBL_ROLE_MASTER.ROLE_ID, roleId));
        return res.status(200).json({ msg: "Role deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteRoles = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_ROLE_MASTER).where(inArray(TBL_ROLE_MASTER.ROLE_ID, numericIds));
        return res.status(200).json({ msg: "Roles deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
