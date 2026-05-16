
// middleware/authMiddleware.mjs

import jwt from "jsonwebtoken";
import pool from "../config/dbDirect.mjs";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    // 🔥 remove "Bearer "
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // ✅ First verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );

    // ✅ Then fetch complete user data from database including employee_id
    const [users] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role_id, u.employee_id, 
              e.id as emp_id, e.first_name, e.last_name
       FROM users u 
       LEFT JOIN employees e ON u.employee_id = e.id 
       WHERE u.id = ?`,
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ msg: "User not found" });
    }

    // ✅ Attach complete user data to req.user
    req.user = {
      id: users[0].id,
      name: users[0].name,
      email: users[0].email,
      role_id: users[0].role_id,
      employee_id: users[0].employee_id,  // Important for bids filtering
      employee_name: users[0].first_name ? `${users[0].first_name} ${users[0].last_name}` : null
    };

    console.log("Authenticated user:", { 
      id: req.user.id, 
      role_id: req.user.role_id, 
      employee_id: req.user.employee_id 
    });

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};
// middleware/authMiddleware.mjs

// import jwt from "jsonwebtoken";

// export const protect = (req, res, next) => {
//   try {
//     let token = req.headers.authorization;

//     if (!token) {
//       return res.status(401).json({ msg: "No token" });
//     }

//     // 🔥 remove "Bearer "
//     if (token.startsWith("Bearer ")) {
//       token = token.split(" ")[1];
//     }

//     const decoded = jwt.verify(
//   token,
//   process.env.JWT_SECRET || "secret"
// );

//     req.user = decoded;

//     next();
//   } catch (err) {
//     console.log("JWT ERROR:", err.message);
//     return res.status(401).json({ msg: "Invalid token" });
//   }
// };