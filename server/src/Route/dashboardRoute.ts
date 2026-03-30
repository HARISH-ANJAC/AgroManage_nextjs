import express from "express";
import { getDashboardStats } from "../Controller/dashboardController.js";

export const dashboardRoute = express.Router();

dashboardRoute.get("/", getDashboardStats);
