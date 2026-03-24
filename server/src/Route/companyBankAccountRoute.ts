import express from "express";
import { getCompanyBankAccounts, createCompanyBankAccount, updateCompanyBankAccount, deleteCompanyBankAccount, bulkDeleteCompanyBankAccounts } from "../Controller/companyBankAccountController.js";

export const companyBankAccountRoute = express.Router();

companyBankAccountRoute.get("/", getCompanyBankAccounts);
companyBankAccountRoute.post("/", createCompanyBankAccount);
companyBankAccountRoute.put("/:id", updateCompanyBankAccount);
companyBankAccountRoute.delete("/:id", deleteCompanyBankAccount);
companyBankAccountRoute.post("/bulk-delete", bulkDeleteCompanyBankAccounts);
