import express from "express";

import upload from "../middleware/uploadEventImage.mjs";

import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.mjs";

const router = express.Router();

router.get("/", getEvents);

router.post(
  "/add",
  upload.single("image"),
  addEvent
);

router.put(
  "/update/:id",
  upload.single("image"),
  updateEvent
);

router.delete(
  "/delete/:id",
  deleteEvent
);

export default router;