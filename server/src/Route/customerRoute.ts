import express from "express";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, bulkDeleteCustomers } from "../Controller/customerController.js";

export const customerRoute = express.Router();

customerRoute.get("/", getCustomers);
customerRoute.post("/", createCustomer);
customerRoute.put("/:id", updateCustomer);
customerRoute.delete("/:id", deleteCustomer);
customerRoute.post("/bulk-delete", bulkDeleteCustomers);
