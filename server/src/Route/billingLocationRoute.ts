import express from "express";
import { getBillingLocations, createBillingLocation, updateBillingLocation, deleteBillingLocation, bulkDeleteBillingLocations } from "../Controller/billingLocationController.js";

export const billingLocationRoute = express.Router();

billingLocationRoute.get("/", getBillingLocations);
billingLocationRoute.post("/", createBillingLocation);
billingLocationRoute.put("/:id", updateBillingLocation);
billingLocationRoute.delete("/:id", deleteBillingLocation);
billingLocationRoute.post("/bulk-delete", bulkDeleteBillingLocations);
