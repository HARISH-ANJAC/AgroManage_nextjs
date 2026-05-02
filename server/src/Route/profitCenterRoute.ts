import { Router } from "express";
import * as profitCenterController from "../Controller/profitCenterController.js";

const router = Router();

router.get("/", profitCenterController.getProfitCenters);
router.post("/", profitCenterController.createProfitCenter);
router.post("/allocate", profitCenterController.allocateRevenueToProfitCenter);
router.get("/report/target-vs-actual", profitCenterController.getTargetVsActualReport);

// Target sub-routes (must be before /:id to avoid wildcard conflict)
router.get("/targets", profitCenterController.getTargets);
router.post("/targets", profitCenterController.createTarget);
router.put("/targets/:id", profitCenterController.updateTarget);
router.delete("/targets/:id", profitCenterController.deleteTarget);

// Revenue ledger — all allocations for a profit center
router.get("/ledger/:id", profitCenterController.getRevenueLedger);

router.put("/:id", profitCenterController.updateProfitCenter);
router.delete("/:id", profitCenterController.deleteProfitCenter);

export default router;
