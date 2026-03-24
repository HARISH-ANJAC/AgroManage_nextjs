import express from "express";
import { getSalesOrders, createSalesOrder, deleteSalesOrder } from "../Controller/salesOrderController.js";

export const salesOrderRoute = express.Router();
salesOrderRoute.get("/", getSalesOrders);
salesOrderRoute.post("/", createSalesOrder);
salesOrderRoute.delete("/:id", deleteSalesOrder);
