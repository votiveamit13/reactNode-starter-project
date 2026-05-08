// controllers/authController.mjs

import { User } from "../models/index.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("1. Login attempt for:", email);

    const user = await User.findOne({
      where: { email },
    });

    console.log("2. User found:", user ? user.id : "No user");

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    // Check account status
    if (!user.is_active) {
      return res.status(403).json({
        msg: "Your account has been deactivated. Contact admin.",
      });
    }

    // Check password exists
    if (!user.password) {
      return res.status(400).json({
        msg: "Please set your password using email link",
      });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        msg: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "10h",
      }
    );

    // Safe response user object
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    console.log("3. Login successful:", safeUser);

    res.json({
      token,
      user: safeUser,
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);

    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};