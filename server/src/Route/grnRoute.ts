import express from "express";
import { getGoodsReceipts, createGoodsReceipt, deleteGoodsReceipt } from "../Controller/grnController.js";

export const grnRoute = express.Router();
grnRoute.get("/", getGoodsReceipts);
grnRoute.post("/", createGoodsReceipt);
grnRoute.delete("/:id", deleteGoodsReceipt);
