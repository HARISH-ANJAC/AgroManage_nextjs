import express from "express";
import { getLedgerGroups, createLedgerGroup, updateLedgerGroup, deleteLedgerGroup, bulkDeleteLedgerGroups } from "../Controller/ledgerGroupController.js";

export const ledgerGroupRoute = express.Router();

ledgerGroupRoute.get("/", getLedgerGroups);
ledgerGroupRoute.post("/", createLedgerGroup);
ledgerGroupRoute.put("/:id", updateLedgerGroup);
ledgerGroupRoute.delete("/:id", deleteLedgerGroup);
ledgerGroupRoute.post("/bulk-delete", bulkDeleteLedgerGroups);
