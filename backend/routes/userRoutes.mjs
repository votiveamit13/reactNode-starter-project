// routes/userRoutes.mjs
import express from "express";
import { createUser } from "../controllers/userController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/", protect, createUser);

export default router;