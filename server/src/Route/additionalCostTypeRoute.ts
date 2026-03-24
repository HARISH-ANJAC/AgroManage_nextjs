import express from "express";
import { getAdditionalCostTypes, createAdditionalCostType, updateAdditionalCostType, deleteAdditionalCostType, bulkDeleteAdditionalCostTypes } from "../Controller/additionalCostTypeController.js";

export const additionalCostTypeRoute = express.Router();

additionalCostTypeRoute.get("/", getAdditionalCostTypes);
additionalCostTypeRoute.post("/", createAdditionalCostType);
additionalCostTypeRoute.put("/:id", updateAdditionalCostType);
additionalCostTypeRoute.delete("/:id", deleteAdditionalCostType);
additionalCostTypeRoute.post("/bulk-delete", bulkDeleteAdditionalCostTypes);
