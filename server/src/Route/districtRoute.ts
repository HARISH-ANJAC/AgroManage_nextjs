import express from "express";
import { getDistricts, createDistrict, updateDistrict, deleteDistrict, bulkDeleteDistricts } from "../Controller/districtController.js";

export const districtRoute = express.Router();

districtRoute.get("/", getDistricts);
districtRoute.post("/", createDistrict);
districtRoute.put("/:id", updateDistrict);
districtRoute.delete("/:id", deleteDistrict);
districtRoute.post("/bulk-delete", bulkDeleteDistricts);
