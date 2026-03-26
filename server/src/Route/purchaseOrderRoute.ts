import express from "express";
import { 
    getPurchaseOrders, 
    getPurchaseOrderById, 
    createPurchaseOrder, 
    approvePurchaseOrder, 
    archivePurchaseOrder,
    updatePurchaseOrder
} from "../Controller/purchaseOrderController.js";

export const purchaseOrderRoute = express.Router();

purchaseOrderRoute.get("/", getPurchaseOrders);
purchaseOrderRoute.post("/", createPurchaseOrder);
purchaseOrderRoute.post("/approve/:id", approvePurchaseOrder);
purchaseOrderRoute.put("/archive/:id", archivePurchaseOrder);
purchaseOrderRoute.get("/:id", getPurchaseOrderById);
purchaseOrderRoute.put("/:id", updatePurchaseOrder);
