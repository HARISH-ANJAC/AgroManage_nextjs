import express from "express";
import { getProductCompanyCategoryMappings, createProductCompanyCategoryMapping, updateProductCompanyCategoryMapping, deleteProductCompanyCategoryMapping, bulkDeleteProductCompanyCategoryMappings } from "../Controller/productCompanyCategoryMappingController.js";

export const productCompanyCategoryMappingRoute = express.Router();

productCompanyCategoryMappingRoute.get("/", getProductCompanyCategoryMappings);
productCompanyCategoryMappingRoute.post("/", createProductCompanyCategoryMapping);
productCompanyCategoryMappingRoute.put("/:id", updateProductCompanyCategoryMapping);
productCompanyCategoryMappingRoute.delete("/:id", deleteProductCompanyCategoryMapping);
productCompanyCategoryMappingRoute.post("/bulk-delete", bulkDeleteProductCompanyCategoryMappings);
