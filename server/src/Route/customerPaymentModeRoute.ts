import express from "express";
import { getCustomerPaymentModes, createCustomerPaymentMode, updateCustomerPaymentMode, deleteCustomerPaymentMode, bulkDeleteCustomerPaymentModes } from "../Controller/customerPaymentModeController.js";

export const customerPaymentModeRoute = express.Router();

customerPaymentModeRoute.get("/", getCustomerPaymentModes);
customerPaymentModeRoute.post("/", createCustomerPaymentMode);
customerPaymentModeRoute.put("/:id", updateCustomerPaymentMode);
customerPaymentModeRoute.delete("/:id", deleteCustomerPaymentMode);
customerPaymentModeRoute.post("/bulk-delete", bulkDeleteCustomerPaymentModes);
