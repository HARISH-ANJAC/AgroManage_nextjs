import express from "express";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, bulkDeleteSuppliers } from "../Controller/supplierController.js";

export const supplierRoute = express.Router();

supplierRoute.get("/", getSuppliers);
supplierRoute.post("/", createSupplier);
supplierRoute.put("/:id", updateSupplier);
supplierRoute.delete("/:id", deleteSupplier);
supplierRoute.post("/bulk-delete", bulkDeleteSuppliers);
