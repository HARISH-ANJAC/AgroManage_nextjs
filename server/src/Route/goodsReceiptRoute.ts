import express from "express";
import { 
    getGoodsReceipts, 
    getGoodsReceiptById, 
    createGoodsReceipt, 
    updateGoodsReceipt,
    deleteGoodsReceipt
} from "../Controller/goodsReceiptController.js";

export const goodsReceiptRoute = express.Router();

goodsReceiptRoute.get("/", getGoodsReceipts);
goodsReceiptRoute.get("/:id", getGoodsReceiptById);
goodsReceiptRoute.post("/", createGoodsReceipt);
goodsReceiptRoute.put("/:id", updateGoodsReceipt);
goodsReceiptRoute.delete("/:id", deleteGoodsReceipt);
