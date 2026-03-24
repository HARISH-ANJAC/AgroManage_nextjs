import express from "express";
import { getCountries, createCountry, updateCountry, deleteCountry, bulkDeleteCountries } from "../Controller/countryController.js";
const router = express.Router();
router.get("/", getCountries);
router.post("/", createCountry);
router.post("/bulk-delete", bulkDeleteCountries);
router.put("/:id", updateCountry);
router.delete("/:id", deleteCountry);
export default router;
