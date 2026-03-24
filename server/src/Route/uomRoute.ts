import express from "express";
import { getUoms, createUom, updateUom, deleteUom, bulkDeleteUoms } from "../Controller/uomController.js";

const uomRoute = express.Router();

uomRoute.get("/", getUoms);
uomRoute.post("/", createUom);
uomRoute.post("/bulk-delete", bulkDeleteUoms);
uomRoute.put("/:id", updateUom);
uomRoute.delete("/:id", deleteUom);

export default uomRoute;
