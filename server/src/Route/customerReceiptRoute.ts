import express from "express";
import { getCustomerReceipts, createCustomerReceipt, deleteCustomerReceipt } from "../Controller/customerReceiptController.js";

export const customerReceiptRoute = express.Router();
customerReceiptRoute.get("/", getCustomerReceipts);
customerReceiptRoute.post("/", createCustomerReceipt);
customerReceiptRoute.delete("/:id", deleteCustomerReceipt);
