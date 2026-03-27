import express from "express";
import { 
    getTaxInvoices, 
    getTaxInvoiceById, 
    createTaxInvoice, 
    updateTaxInvoice,
    deleteTaxInvoice
} from "../Controller/taxInvoiceController.js";

export const taxInvoiceRoute = express.Router();

taxInvoiceRoute.get("/", getTaxInvoices);
taxInvoiceRoute.get("/:id", getTaxInvoiceById);
taxInvoiceRoute.post("/", createTaxInvoice);
taxInvoiceRoute.put("/:id", updateTaxInvoice);
taxInvoiceRoute.delete("/:id", deleteTaxInvoice);
