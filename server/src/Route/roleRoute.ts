import express from "express";
import { getRoles, createRole, updateRole, deleteRole, bulkDeleteRoles } from "../Controller/roleController.js";
const router = express.Router();
router.get("/", getRoles);
router.post("/", createRole);
router.post("/bulk-delete", bulkDeleteRoles);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);
export default router;
