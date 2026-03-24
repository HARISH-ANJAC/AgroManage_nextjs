import express from "express";
import { getStoreProductMinimumStocks, createStoreProductMinimumStock, updateStoreProductMinimumStock, deleteStoreProductMinimumStock, bulkDeleteStoreProductMinimumStocks } from "../Controller/storeProductMinimumStockController.js";

export const storeProductMinimumStockRoute = express.Router();

storeProductMinimumStockRoute.get("/", getStoreProductMinimumStocks);
storeProductMinimumStockRoute.post("/", createStoreProductMinimumStock);
storeProductMinimumStockRoute.put("/:id", updateStoreProductMinimumStock);
storeProductMinimumStockRoute.delete("/:id", deleteStoreProductMinimumStock);
storeProductMinimumStockRoute.post("/bulk-delete", bulkDeleteStoreProductMinimumStocks);
