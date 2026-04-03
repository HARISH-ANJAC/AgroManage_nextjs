import express from "express";
import { getDashboardStats, getPurchaseDashboardStats, getSalesDashboardStats } from "../Controller/dashboardController.js";

export const dashboardRoute = express.Router();

dashboardRoute.get("/", getDashboardStats);
dashboardRoute.get("/purchase", getPurchaseDashboardStats);
dashboardRoute.get("/sales", getSalesDashboardStats);
