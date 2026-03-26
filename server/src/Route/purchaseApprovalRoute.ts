import express from "express";
import { 
    getPendingApprovals, 
    approvePurchaseOrder
} from "../Controller/purchaseApprovalController.js";

export const purchaseApprovalRoute = express.Router();

purchaseApprovalRoute.get("/pending", getPendingApprovals);
purchaseApprovalRoute.post("/:id", approvePurchaseOrder);
