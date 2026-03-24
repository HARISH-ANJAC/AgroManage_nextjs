import express from "express";
import { getExpenses, createExpense, deleteExpense } from "../Controller/expenseController.js";

export const expenseRoute = express.Router();
expenseRoute.get("/", getExpenses);
expenseRoute.post("/", createExpense);
expenseRoute.delete("/:id", deleteExpense);
