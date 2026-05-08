// routes/authRoutes.mjs
import express from "express";
import { getProfile, login, setPassword, getEmployeeByUserId } from "../controllers/authController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/login", login);
router.post("/set-password", setPassword);
router.get("/profile", protect, getProfile);
router.get("/employee/:user_id", getEmployeeByUserId);
router.get("/me", protect, getProfile);
export default router;