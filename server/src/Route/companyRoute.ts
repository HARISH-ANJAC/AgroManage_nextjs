import express from "express";
import { getCompanies, createCompany, updateCompany, deleteCompany, bulkDeleteCompanies } from "../Controller/companyController.js";
const router = express.Router();
router.get("/", getCompanies);
router.post("/", createCompany);
router.post("/bulk-delete", bulkDeleteCompanies);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);
export default router;
