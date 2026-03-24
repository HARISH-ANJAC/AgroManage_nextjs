import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct, bulkDeleteProducts } from "../Controller/productController.js";

const productRoute = express.Router();

productRoute.get("/", getProducts);
productRoute.post("/", createProduct);
productRoute.post("/bulk-delete", bulkDeleteProducts);
productRoute.put("/:id", updateProduct);
productRoute.delete("/:id", deleteProduct);

export default productRoute;
