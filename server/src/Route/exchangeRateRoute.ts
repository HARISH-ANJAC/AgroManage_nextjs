import { Router } from "express";
import * as exchangeRateController from "../Controller/exchangeRateController.js";

const router = Router();

router.get("/", exchangeRateController.getExchangeRates);
router.get("/latest", exchangeRateController.getLatestRates);
router.post("/", exchangeRateController.createExchangeRate);
router.put("/:id", exchangeRateController.updateExchangeRate);
router.delete("/:id", exchangeRateController.deleteExchangeRate);

export default router;
