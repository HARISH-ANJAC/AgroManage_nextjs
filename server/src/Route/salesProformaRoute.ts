import express from "express";
import {
    getSalesProformas,
    getSalesProformaById,
    createSalesProforma,
    updateSalesProforma,
    deleteSalesProforma,
    bulkDeleteSalesProformas,
    getSalesProformaPdf
} from "../Controller/salesProformaController.js";

export const salesProformaRoute = express.Router();

salesProformaRoute.get("/", getSalesProformas);
salesProformaRoute.get("/:id/pdf", getSalesProformaPdf);
salesProformaRoute.get("/:id", getSalesProformaById);
salesProformaRoute.post("/", createSalesProforma);
salesProformaRoute.post("/bulk-delete", bulkDeleteSalesProformas);
salesProformaRoute.delete("/:id", deleteSalesProforma);
salesProformaRoute.put("/:id", updateSalesProforma);

