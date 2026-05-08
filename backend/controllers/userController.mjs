// controllers/userController.mjs
import { User, Role } from "../models/index.mjs";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  const { name, email, password, role_id } = req.body;
  const loggedUser = req.user;

  const role = await Role.findByPk(role_id);

  // 🔥 restriction
  if (loggedUser.role === "HR") {
    if (role.name === "Admin" || role.name === "Super Admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role_id,
    created_by: loggedUser.id,
  });

  res.json(user);
};