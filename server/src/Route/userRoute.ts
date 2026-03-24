import express from "express";
import { getUsers, createUser, updateUser, deleteUser, bulkDeleteUsers } from "../Controller/userController.js";

export const userRoute = express.Router();

userRoute.get("/", getUsers);
userRoute.post("/", createUser);
userRoute.put("/:id", updateUser);
userRoute.delete("/:id", deleteUser);
userRoute.post("/bulk-delete", bulkDeleteUsers);
