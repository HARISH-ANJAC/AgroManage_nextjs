import express from "express";
import { 
    getPurchaseInvoices, 
    getPurchaseInvoiceById, 
    createPurchaseInvoice, 
    updatePurchaseInvoice,
    deletePurchaseInvoice,
    uploadInvoiceFile,
    getInvoiceFiles
} from "../Controller/purchaseInvoiceController.js";

export const purchaseInvoiceRoute = express.Router();

// List all or Get by ID (if ?id= is passed)
purchaseInvoiceRoute.get("/", (req, res, next) => {
    if (req.query.id) return getPurchaseInvoiceById(req, res);
    getPurchaseInvoices(req, res);
});

// Other endpoints
purchaseInvoiceRoute.get("/files", getInvoiceFiles);
purchaseInvoiceRoute.post("/upload", uploadInvoiceFile);

purchaseInvoiceRoute.post("/", createPurchaseInvoice);
purchaseInvoiceRoute.put("/", updatePurchaseInvoice); // Handles ?id=
purchaseInvoiceRoute.delete("/", deletePurchaseInvoice); // Handles ?id=

// Legacy support for plain IDs without slashes
purchaseInvoiceRoute.get("/:id", getPurchaseInvoiceById);
purchaseInvoiceRoute.put("/:id", updatePurchaseInvoice);
purchaseInvoiceRoute.delete("/:id", deletePurchaseInvoice);
purchaseInvoiceRoute.get("/files/:id", getInvoiceFiles);
purchaseInvoiceRoute.post("/upload/:id", uploadInvoiceFile);
