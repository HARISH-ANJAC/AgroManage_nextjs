import express from "express";
import { getUserStoreMappings, createUserStoreMapping, updateUserStoreMapping, deleteUserStoreMapping, bulkDeleteUserStoreMappings } from "../Controller/userStoreMappingController.js";

export const userStoreMappingRoute = express.Router();

userStoreMappingRoute.get("/", getUserStoreMappings);
userStoreMappingRoute.post("/", createUserStoreMapping);
userStoreMappingRoute.put("/:id", updateUserStoreMapping);
userStoreMappingRoute.delete("/:id", deleteUserStoreMapping);
userStoreMappingRoute.post("/bulk-delete", bulkDeleteUserStoreMappings);
