import express from "express";
import {
    getPurchasePayments,
    getPurchasePaymentById,
    addPurchasePayment,
    updatePurchasePayment,
    deletePurchasePayment
} from "../Controller/purchasePaymentController.js";

const router = express.Router();

router.get("/", getPurchasePayments);
router.get("/:id", getPurchasePaymentById);
router.post("/", addPurchasePayment);
router.put("/:id", updatePurchasePayment);
router.delete("/:id", deletePurchasePayment);

export default router;
