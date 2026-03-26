import express from "express";
import { 
    getCustomerReceipts, 
    getCustomerReceiptById, 
    createCustomerReceipt, 
    updateCustomerReceipt
} from "../Controller/customerReceiptController.js";

export const customerReceiptRoute = express.Router();

customerReceiptRoute.get("/", getCustomerReceipts);
customerReceiptRoute.get("/:id", getCustomerReceiptById);
customerReceiptRoute.post("/", createCustomerReceipt);
customerReceiptRoute.put("/:id", updateCustomerReceipt);
