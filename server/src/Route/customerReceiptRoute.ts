import express from "express";
import { 
    getCustomerReceipts, 
    getCustomerReceiptById, 
    addCustomerReceipt, 
    deleteCustomerReceipt 
} from "../Controller/customerReceiptController.js";

const customerReceiptRoute = express.Router();

customerReceiptRoute.get("/", getCustomerReceipts);
customerReceiptRoute.get("/:id", getCustomerReceiptById);
customerReceiptRoute.post("/", addCustomerReceipt);
customerReceiptRoute.delete("/:id", deleteCustomerReceipt);

export { customerReceiptRoute };
