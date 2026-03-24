import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory, bulkDeleteCategories } from "../Controller/categoryController.js";

const categoryRoute = express.Router();

categoryRoute.get("/", getCategories);
categoryRoute.post("/", createCategory);
categoryRoute.post("/bulk-delete", bulkDeleteCategories);
categoryRoute.put("/:id", updateCategory);
categoryRoute.delete("/:id", deleteCategory);

export default categoryRoute;
