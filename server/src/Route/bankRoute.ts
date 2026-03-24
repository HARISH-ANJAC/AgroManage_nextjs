import express from "express";
import { getBanks, createBank, updateBank, deleteBank, bulkDeleteBanks } from "../Controller/bankController.js";
const router = express.Router();
router.get("/", getBanks);
router.post("/", createBank);
router.post("/bulk-delete", bulkDeleteBanks);
router.put("/:id", updateBank);
router.delete("/:id", deleteBank);
export default router;
