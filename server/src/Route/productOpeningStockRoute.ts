import express from "express";
import { getProductOpeningStocks, createProductOpeningStock, updateProductOpeningStock, deleteProductOpeningStock, bulkDeleteProductOpeningStocks } from "../Controller/productOpeningStockController.js";

export const productOpeningStockRoute = express.Router();

productOpeningStockRoute.get("/", getProductOpeningStocks);
productOpeningStockRoute.post("/", createProductOpeningStock);
productOpeningStockRoute.put("/:id", updateProductOpeningStock);
productOpeningStockRoute.delete("/:id", deleteProductOpeningStock);
productOpeningStockRoute.post("/bulk-delete", bulkDeleteProductOpeningStocks);
