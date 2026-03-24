import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_CUSTOMER_PAYMENT_MODE_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getCustomerPaymentModes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_CUSTOMER_PAYMENT_MODE_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createCustomerPaymentMode = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { paymentModeName, shortCode, remarks, statusMaster, user } = req.body as {
            paymentModeName?: string;
            shortCode?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_CUSTOMER_PAYMENT_MODE_MASTER).values({
            PAYMENT_MODE_NAME: paymentModeName,
            SHORT_CODE: shortCode,
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

export const updateCustomerPaymentMode = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const paymentModeId = parseInt(String(id));
        if (isNaN(paymentModeId)) return res.status(400).json({ msg: "Invalid ID" });

        const { paymentModeName, shortCode, remarks, statusMaster, user } = req.body as {
            paymentModeName?: string;
            shortCode?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_CUSTOMER_PAYMENT_MODE_MASTER).set({
            PAYMENT_MODE_NAME: paymentModeName,
            SHORT_CODE: shortCode,
            REMARKS: remarks,
            STATUS_MASTER: statusMaster,
            MODIFIED_DATE: new Date(),
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        }).where(eq(TBL_CUSTOMER_PAYMENT_MODE_MASTER.PAYMENT_MODE_ID, paymentModeId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Customer Payment Mode not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteCustomerPaymentMode = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const paymentModeId = parseInt(String(id));
        if (isNaN(paymentModeId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_CUSTOMER_PAYMENT_MODE_MASTER).where(eq(TBL_CUSTOMER_PAYMENT_MODE_MASTER.PAYMENT_MODE_ID, paymentModeId));
        return res.status(200).json({ msg: "Customer Payment Mode deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteCustomerPaymentModes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_CUSTOMER_PAYMENT_MODE_MASTER).where(inArray(TBL_CUSTOMER_PAYMENT_MODE_MASTER.PAYMENT_MODE_ID, numericIds));
        return res.status(200).json({ msg: "Customer Payment Modes deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
