import express from "express";
import { 
    getSalesOrders, 
    getSalesOrderById, 
    createSalesOrder, 
    updateSalesOrder,
    deleteSalesOrder,
    bulkDeleteSalesOrders
} from "../Controller/salesOrderController.js";

export const salesOrderRoute = express.Router();

salesOrderRoute.get("/", getSalesOrders);
salesOrderRoute.get("/:id", getSalesOrderById);
salesOrderRoute.post("/", createSalesOrder);
salesOrderRoute.post("/bulk-delete", bulkDeleteSalesOrders);
salesOrderRoute.delete("/:id", deleteSalesOrder);
salesOrderRoute.put("/:id", updateSalesOrder);
