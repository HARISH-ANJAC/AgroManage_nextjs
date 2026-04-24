import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_PURCHASE_ORDER_HDR, 
    TBL_PURCHASE_ORDER_CONVERSATION_DTL
} from "../db/schema/index.js";
import { eq, or } from "drizzle-orm";
import { createJournalEntry, getLedgerForSupplier, getSystemLedger } from "../utils/accountingUtils.js";

export const getPendingApprovals = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Fetch purchase orders that are pending specific approval levels.
        // This acts as a generic endpoint that frontend can filter depending on user role.
        const pendingPOs = await db.select().from(TBL_PURCHASE_ORDER_HDR)
            .where(or(
                eq(TBL_PURCHASE_ORDER_HDR.STATUS_ENTRY, "Submitted"),
                eq(TBL_PURCHASE_ORDER_HDR.STATUS_ENTRY, "In-Approval")
            ));
        
        return res.status(200).json(pendingPOs);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const approvePurchaseOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { status, remarks, user, level } = req.body; // level: "head" | "1" | "2" | "final"
        const updateObj: any = {};
        const ip = req.ip || "127.0.0.1";

        if (level === "head") {
            updateObj.PURCHASE_HEAD_RESPONSE_PERSON = user;
            updateObj.PURCHASE_HEAD_RESPONSE_DATE = new Date();
            updateObj.PURCHASE_HEAD_RESPONSE_STATUS = status;
            updateObj.PURCHASE_HEAD_RESPONSE_REMARKS = remarks;
            updateObj.PURCHASE_HEAD_RESPONSE_IP_ADDRESS = ip;
            updateObj.STATUS_ENTRY = status === "Rejected" ? "Rejected" : "In-Approval";
        } else if (level === "1") {
            updateObj.RESPONSE_1_PERSON = user;
            updateObj.RESPONSE_1_DATE = new Date();
            updateObj.RESPONSE_1_STATUS = status;
            updateObj.RESPONSE_1_REMARKS = remarks;
            updateObj.RESPONSE_1_IP_ADDRESS = ip;
        } else if (level === "2") {
            updateObj.RESPONSE_2_PERSON = user;
            updateObj.RESPONSE_2_DATE = new Date();
            updateObj.RESPONSE_2_STATUS = status;
            updateObj.RESPONSE_2_REMARKS = remarks;
            updateObj.RESPONSE_2_IP_ADDRESS = ip;
        } else if (level === "final") {
            updateObj.FINAL_RESPONSE_PERSON = user;
            updateObj.FINAL_RESPONSE_DATE = new Date();
            updateObj.FINAL_RESPONSE_STATUS = status;
            updateObj.FINAL_RESPONSE_REMARKS = remarks;
            updateObj.STATUS_ENTRY = status === "Approved" ? "Approved" : "Rejected";
        }

        await db.transaction(async (tx) => {
            await tx.update(TBL_PURCHASE_ORDER_HDR).set(updateObj).where(eq(TBL_PURCHASE_ORDER_HDR.PO_REF_NO, id as string));
            
            await tx.insert(TBL_PURCHASE_ORDER_CONVERSATION_DTL).values({
                PO_REF_NO: id as string,
                RESPOND_PERSON: user,
                DISCUSSION_DETAILS: `${level.toUpperCase()} APPROVAL: ${status}. ${remarks || ""}`,
                RESPONSE_STATUS: status,
                STATUS_ENTRY: "Active",
                CREATED_BY: user,
                CREATED_DATE: new Date(),
                CREATED_IP_ADDRESS: ip
            } as any);

        });

        return res.status(200).json({ msg: `PO ${level} approval updated successfully` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
