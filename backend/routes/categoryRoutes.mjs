import express from "express";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.mjs";

const router = express.Router();

router.get("/", getCategories);

router.post("/add", addCategory);

router.put("/update/:id", updateCategory);

router.delete("/delete/:id", deleteCategory);

export default router;