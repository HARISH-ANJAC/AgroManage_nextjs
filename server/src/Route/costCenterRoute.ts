import { Router } from "express";
import * as costCenterController from "../Controller/costCenterController.js";

const router = Router();

router.get("/", costCenterController.getCostCenters);
router.post("/", costCenterController.createCostCenter);
router.post("/allocate", costCenterController.allocateExpenseToCostCenter);
router.get("/report/budget-vs-actual", costCenterController.getBudgetVsActualReport);

// Budget sub-routes (must be before /:id to avoid wildcard conflict)
router.get("/budgets", costCenterController.getBudgets);
router.post("/budgets", costCenterController.createBudget);
router.put("/budgets/:id", costCenterController.updateBudget);
router.delete("/budgets/:id", costCenterController.deleteBudget);

// Ledger — all allocations for a cost center
router.get("/ledger/:id", costCenterController.getLedger);

router.put("/:id", costCenterController.updateCostCenter);
router.delete("/:id", costCenterController.deleteCostCenter);

export default router;
