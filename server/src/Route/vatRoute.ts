import express from "express";
import { getVats, createVat, updateVat, deleteVat, bulkDeleteVats } from "../Controller/vatController.js";
const router = express.Router();
router.get("/", getVats);
router.post("/", createVat);
router.post("/bulk-delete", bulkDeleteVats);
router.put("/:id", updateVat);
router.delete("/:id", deleteVat);
export default router;
