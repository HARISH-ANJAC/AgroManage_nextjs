import express from "express";
import { getTaxInvoices, createTaxInvoice, deleteTaxInvoice } from "../Controller/taxInvoiceController.js";

export const taxInvoiceRoute = express.Router();
taxInvoiceRoute.get("/", getTaxInvoices);
taxInvoiceRoute.post("/", createTaxInvoice);
taxInvoiceRoute.delete("/:id", deleteTaxInvoice);
