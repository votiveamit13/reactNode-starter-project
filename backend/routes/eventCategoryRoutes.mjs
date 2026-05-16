import express from "express";

import {
  getEventCategories,
  addEventCategory,
  updateEventCategory,
  deleteEventCategory,
} from "../controllers/eventCategoryController.mjs";

const router = express.Router();

router.get("/", getEventCategories);

router.post("/add", addEventCategory);

router.put("/update/:id", updateEventCategory);

router.delete("/delete/:id", deleteEventCategory);

export default router;