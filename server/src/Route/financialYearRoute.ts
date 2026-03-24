import express from "express";
import { getFinancialYears, createFinancialYear, updateFinancialYear, deleteFinancialYear, bulkDeleteFinancialYears } from "../Controller/financialYearController.js";
const router = express.Router();
router.get("/", getFinancialYears);
router.post("/", createFinancialYear);
router.post("/bulk-delete", bulkDeleteFinancialYears);
router.put("/:id", updateFinancialYear);
router.delete("/:id", deleteFinancialYear);
export default router;
