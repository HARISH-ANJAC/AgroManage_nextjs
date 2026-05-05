import express from "express";
import {
    getDeliveryNotes,
    getDeliveryNoteById,
    createDeliveryNote,
    deleteDeliveryNote,
    bulkDeleteDeliveryNotes,
    updateDeliveryNote
} from "../Controller/deliveryNoteController.js";

export const deliveryNoteRoute = express.Router();

deliveryNoteRoute.get("/", getDeliveryNotes);
deliveryNoteRoute.get("/:id", getDeliveryNoteById);
deliveryNoteRoute.post("/", createDeliveryNote);
deliveryNoteRoute.put("/:id", updateDeliveryNote);
deliveryNoteRoute.delete("/:id", deleteDeliveryNote);
deliveryNoteRoute.post("/bulk-delete", bulkDeleteDeliveryNotes);
