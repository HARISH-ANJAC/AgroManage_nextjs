import express from "express";
import { getPaymentModes, createPaymentMode, updatePaymentMode, deletePaymentMode, bulkDeletePaymentModes } from "../Controller/paymentModeController.js";

export const paymentModeRoute = express.Router();

paymentModeRoute.get("/", getPaymentModes);
paymentModeRoute.post("/", createPaymentMode);
paymentModeRoute.put("/:id", updatePaymentMode);
paymentModeRoute.delete("/:id", deletePaymentMode);
paymentModeRoute.post("/bulk-delete", bulkDeletePaymentModes);
