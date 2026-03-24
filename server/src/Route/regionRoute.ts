import express from "express";
import { getRegions, createRegion, updateRegion, deleteRegion, bulkDeleteRegions } from "../Controller/regionController.js";

export const regionRoute = express.Router();

regionRoute.get("/", getRegions);
regionRoute.post("/", createRegion);
regionRoute.put("/:id", updateRegion);
regionRoute.delete("/:id", deleteRegion);
regionRoute.post("/bulk-delete", bulkDeleteRegions);
