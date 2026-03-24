import express from "express";
import { getExchangeRates, createExchangeRate, updateExchangeRate, deleteExchangeRate, bulkDeleteExchangeRates } from "../Controller/exchangeRateController.js";

export const exchangeRateRoute = express.Router();

exchangeRateRoute.get("/", getExchangeRates);
exchangeRateRoute.post("/", createExchangeRate);
exchangeRateRoute.put("/:id", updateExchangeRate);
exchangeRateRoute.delete("/:id", deleteExchangeRate);
exchangeRateRoute.post("/bulk-delete", bulkDeleteExchangeRates);
