import express from "express";

import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/userManagementController.mjs";

const router = express.Router();

router.get("/", getUsers);

router.post("/add", addUser);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

export default router;