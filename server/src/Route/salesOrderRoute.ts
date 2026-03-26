import express from "express";
import { 
    getSalesOrders, 
    getSalesOrderById, 
    createSalesOrder, 
    updateSalesOrder
} from "../Controller/salesOrderController.js";

export const salesOrderRoute = express.Router();

salesOrderRoute.get("/", getSalesOrders);
salesOrderRoute.get("/:id", getSalesOrderById);
salesOrderRoute.post("/", createSalesOrder);
salesOrderRoute.put("/:id", updateSalesOrder);
