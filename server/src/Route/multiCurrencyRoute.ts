import { Router } from "express";
import * as multiCurrencyController from "../Controller/multiCurrencyController.js";

const router = Router();

router.get("/rates", multiCurrencyController.getExchangeRates);
router.get("/transactions", multiCurrencyController.getMCTransactions);
router.post("/update-rates", multiCurrencyController.updateRatesFromProvider);
router.post("/revaluation", multiCurrencyController.runRevaluation);

export default router;
