import express from "express";
import { getPaymentTerms, createPaymentTerm, updatePaymentTerm, deletePaymentTerm, bulkDeletePaymentTerms } from "../Controller/paymentTermController.js";
const router = express.Router();
router.get("/", getPaymentTerms);
router.post("/", createPaymentTerm);
router.post("/bulk-delete", bulkDeletePaymentTerms);
router.put("/:id", updatePaymentTerm);
router.delete("/:id", deletePaymentTerm);
export default router;
