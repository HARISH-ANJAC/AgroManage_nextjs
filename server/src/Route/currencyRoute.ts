import express from "express";
import { getCurrencies, createCurrency, updateCurrency, deleteCurrency, bulkDeleteCurrencies } from "../Controller/currencyController.js";
const router = express.Router();
router.get("/", getCurrencies);
router.post("/", createCurrency);
router.post("/bulk-delete", bulkDeleteCurrencies);
router.put("/:id", updateCurrency);
router.delete("/:id", deleteCurrency);
export default router;
