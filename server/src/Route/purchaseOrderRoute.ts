import express from "express";
import { 
    getPurchaseOrders, 
    getPurchaseOrderById, 
    createPurchaseOrder, 
    approvePurchaseOrder, 
    deletePurchaseOrder,
    updatePurchaseOrder,
    updatePurchaseOrderPOD
} from "../Controller/purchaseOrderController.js";

export const purchaseOrderRoute = express.Router();

purchaseOrderRoute.get("/", getPurchaseOrders);
purchaseOrderRoute.post("/", createPurchaseOrder);
purchaseOrderRoute.post("/approve/:id", approvePurchaseOrder);
purchaseOrderRoute.delete("/:id", deletePurchaseOrder);
purchaseOrderRoute.put("/pod/:id", updatePurchaseOrderPOD);
purchaseOrderRoute.get("/:id", getPurchaseOrderById);
purchaseOrderRoute.put("/:id", updatePurchaseOrder);
