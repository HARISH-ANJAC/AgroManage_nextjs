import express from "express";
import {
    getSalesProformas,
    getSalesProformaById,
    createSalesProforma,
    updateSalesProforma,
    getSalesProformaPdf
} from "../Controller/salesProformaController.js";

export const salesProformaRoute = express.Router();

salesProformaRoute.get("/", getSalesProformas);
salesProformaRoute.get("/:id/pdf", getSalesProformaPdf);
salesProformaRoute.get("/:id", getSalesProformaById);
salesProformaRoute.post("/", createSalesProforma);
salesProformaRoute.put("/:id", updateSalesProforma);

