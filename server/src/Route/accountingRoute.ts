import { Router } from "express";
import * as accountingController from "../Controller/accountingController.js";

const router = Router();

// Trial Balance & Opening Balance
router.get("/trial-balance", accountingController.getTrialBalance);
router.post("/trial-balance/save", accountingController.saveTrialBalance);
router.get("/trial-balance/saved", accountingController.getSavedTrialBalances);
router.get("/trial-balance/saved/detail", accountingController.getSavedTrialBalanceById);
router.delete("/trial-balance/saved", accountingController.deleteSavedTrialBalance);
router.post("/opening-balance", accountingController.postOpeningBalance);

// Journal Entries
router.get("/journals", accountingController.getJournalEntries);
router.get("/journals/detail", accountingController.getJournalById);
router.delete("/journals", accountingController.deleteJournal);
router.get("/journals/module", accountingController.getJournalsByModule);
router.get("/ledger-report", accountingController.getLedgerReport);
router.get("/cash-book", accountingController.getCashBook);
router.get("/cash-flow", accountingController.getCashFlowStatement);

export default router;
