import express from "express";
import { getLocations, createLocation, updateLocation, deleteLocation, bulkDeleteLocations } from "../Controller/locationController.js";
const router = express.Router();
router.get("/", getLocations);
router.post("/", createLocation);
router.post("/bulk-delete", bulkDeleteLocations);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);
export default router;
