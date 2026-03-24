import express from "express";
import { getSalesPersons, createSalesPerson, updateSalesPerson, deleteSalesPerson, bulkDeleteSalesPersons } from "../Controller/salesPersonController.js";

export const salesPersonRoute = express.Router();

salesPersonRoute.get("/", getSalesPersons);
salesPersonRoute.post("/", createSalesPerson);
salesPersonRoute.put("/:id", updateSalesPerson);
salesPersonRoute.delete("/:id", deleteSalesPerson);
salesPersonRoute.post("/bulk-delete", bulkDeleteSalesPersons);
