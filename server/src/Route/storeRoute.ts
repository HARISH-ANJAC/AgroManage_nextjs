import express from "express";
import { getStores, createStore, updateStore, deleteStore, bulkDeleteStores } from "../Controller/storeController.js";
const router = express.Router();
router.get("/", getStores);
router.post("/", createStore);
router.post("/bulk-delete", bulkDeleteStores);
router.put("/:id", updateStore);
router.delete("/:id", deleteStore);
export default router;
