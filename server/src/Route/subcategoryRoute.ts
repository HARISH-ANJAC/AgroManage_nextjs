import express from "express";
import { getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory, bulkDeleteSubCategories } from "../Controller/subcategoryController.js";

const subcategoryRoute = express.Router();

subcategoryRoute.get("/", getSubCategories);
subcategoryRoute.post("/", createSubCategory);
subcategoryRoute.post("/bulk-delete", bulkDeleteSubCategories);
subcategoryRoute.put("/:id", updateSubCategory);
subcategoryRoute.delete("/:id", deleteSubCategory);

export default subcategoryRoute;
