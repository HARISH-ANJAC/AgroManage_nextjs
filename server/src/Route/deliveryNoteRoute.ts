import express from "express";
import { getDeliveryNotes, createDeliveryNote, deleteDeliveryNote } from "../Controller/deliveryNoteController.js";

export const deliveryNoteRoute = express.Router();
deliveryNoteRoute.get("/", getDeliveryNotes);
deliveryNoteRoute.post("/", createDeliveryNote);
deliveryNoteRoute.delete("/:id", deleteDeliveryNote);
