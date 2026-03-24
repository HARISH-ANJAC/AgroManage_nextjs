import express from "express";
import { getSupplierInvoices, createSupplierInvoice, deleteSupplierInvoice } from "../Controller/supplierInvoiceController.js";

export const supplierInvoiceRoute = express.Router();
supplierInvoiceRoute.get("/", getSupplierInvoices);
supplierInvoiceRoute.post("/", createSupplierInvoice);
supplierInvoiceRoute.delete("/:id", deleteSupplierInvoice);
