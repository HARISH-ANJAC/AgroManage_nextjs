import express from "express";
import { 
    getExpenses, 
    getExpenseById, 
    createExpense, 
    updateExpense
} from "../Controller/expenseController.js";

export const expenseRoute = express.Router();

expenseRoute.get("/", getExpenses);
expenseRoute.get("/:id", getExpenseById);
expenseRoute.post("/", createExpense);
expenseRoute.put("/:id", updateExpense);
