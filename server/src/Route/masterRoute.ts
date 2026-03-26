import express from "express";
import * as masterController from "../Controller/masterController.js";

const masterRoute = express.Router();

// Domain-based master routes
masterRoute.get("/:domain", masterController.getAll);
masterRoute.post("/:domain", masterController.createOne);
masterRoute.put("/:domain/:id", masterController.updateOne);
masterRoute.delete("/:domain/:id", masterController.deleteOne);
masterRoute.post("/:domain/bulk-delete", masterController.bulkDelete);

export { masterRoute };
