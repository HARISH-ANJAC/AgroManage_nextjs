import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_PAYMENT_TERM_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getPaymentTerms = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_PAYMENT_TERM_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createPaymentTerm = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { paymentTermName, remarks, statusEntry, user } = req.body as {
            paymentTermName: string;
            remarks?: string;
            statusEntry?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_PAYMENT_TERM_MASTER).values({
            PAYMENT_TERM_NAME: paymentTermName,
            REMARKS: remarks,
            STATUS_ENTRY: statusEntry || "Active",
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

export const updatePaymentTerm = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const ptId = parseInt(String(id));
        if (isNaN(ptId)) return res.status(400).json({ msg: "Invalid ID" });

        const { paymentTermName, remarks, statusEntry, user } = req.body as {
            paymentTermName: string;
            remarks?: string;
            statusEntry?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_PAYMENT_TERM_MASTER).set({
            PAYMENT_TERM_NAME: paymentTermName,
            REMARKS: remarks,
            STATUS_ENTRY: statusEntry,
            MODIFIED_DATE: new Date(),
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        }).where(eq(TBL_PAYMENT_TERM_MASTER.PAYMENT_TERM_ID, ptId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Payment Term not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deletePaymentTerm = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const ptId = parseInt(String(id));
        if (isNaN(ptId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_PAYMENT_TERM_MASTER).where(eq(TBL_PAYMENT_TERM_MASTER.PAYMENT_TERM_ID, ptId));
        return res.status(200).json({ msg: "Payment Term deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeletePaymentTerms = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_PAYMENT_TERM_MASTER).where(inArray(TBL_PAYMENT_TERM_MASTER.PAYMENT_TERM_ID, numericIds));
        return res.status(200).json({ msg: "Payment Terms deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
