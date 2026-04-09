import express from "express";
import { getSchedulerSettings, updateSchedulerSetting } from "../Controller/schedulerController.js";

export const schedulerRoute = express.Router();

schedulerRoute.get("/", getSchedulerSettings);
schedulerRoute.put("/:sno", updateSchedulerSetting);
