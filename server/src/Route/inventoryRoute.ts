import { Router } from "express";
import * as inventoryController from "../Controller/inventoryController.js";

const router = Router();

router.get("/stock-ledger", inventoryController.getStockLedger);

export default router;
