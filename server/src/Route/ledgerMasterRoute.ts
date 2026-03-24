import express from "express";
import { getLedgerMasters, createLedgerMaster, updateLedgerMaster, deleteLedgerMaster, bulkDeleteLedgerMasters } from "../Controller/ledgerMasterController.js";

export const ledgerMasterRoute = express.Router();

ledgerMasterRoute.get("/", getLedgerMasters);
ledgerMasterRoute.post("/", createLedgerMaster);
ledgerMasterRoute.put("/:id", updateLedgerMaster);
ledgerMasterRoute.delete("/:id", deleteLedgerMaster);
ledgerMasterRoute.post("/bulk-delete", bulkDeleteLedgerMasters);
