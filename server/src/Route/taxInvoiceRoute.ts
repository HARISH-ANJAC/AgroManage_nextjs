import express from "express";
import { 
    getTaxInvoices, 
    getTaxInvoiceById, 
    createTaxInvoice, 
    updateTaxInvoice
} from "../Controller/taxInvoiceController.js";

export const taxInvoiceRoute = express.Router();

taxInvoiceRoute.get("/", getTaxInvoices);
taxInvoiceRoute.get("/:id", getTaxInvoiceById);
taxInvoiceRoute.post("/", createTaxInvoice);
taxInvoiceRoute.put("/:id", updateTaxInvoice);
