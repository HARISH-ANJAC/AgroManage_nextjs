import express from "express";
import { getAccountHeads, createAccountHead, updateAccountHead, deleteAccountHead, bulkDeleteAccountHeads } from "../Controller/accountHeadController.js";

export const accountHeadRoute = express.Router();

accountHeadRoute.get("/", getAccountHeads);
accountHeadRoute.post("/", createAccountHead);
accountHeadRoute.put("/:id", updateAccountHead);
accountHeadRoute.delete("/:id", deleteAccountHead);
accountHeadRoute.post("/bulk-delete", bulkDeleteAccountHeads);
