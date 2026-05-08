// routes/authRoutes.mjs
import express from "express";
import { login} from "../controllers/authController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/login", login);
export default router;