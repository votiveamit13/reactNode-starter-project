import sequelize from "../config/db.mjs";

import { QueryTypes } from "sequelize";

import bcrypt from "bcrypt";


// GET USERS
export const getUsers = async (req, res) => {

  try {

  const users = await sequelize.query(
    `SELECT
        id,
        name,
        email,
        phone,
        role_id,
        is_active,
        created_at
     FROM users
     WHERE role_id = 2
     ORDER BY id DESC`,
    {
      type: QueryTypes.SELECT,
    }
  );

    res.json(users);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};


// ADD USER
export const addUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role_id,
    } = req.body;

    // CHECK EMAIL
    const existingUser = await sequelize.query(
      `SELECT id FROM users WHERE email=?`,
      {
        replacements: [email],
        type: QueryTypes.SELECT,
      }
    );

    if (existingUser.length > 0) {

      return res.status(400).json({
        msg: "Email already exists",
      });

    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    await sequelize.query(
      `INSERT INTO users
      (
        name,
        email,
        password,
        role_id,
        is_active
      )
      VALUES (?, ?, ?, ?, ?)`,
      {
        replacements: [
          name,
          email,
          hashedPassword,
          role_id,
          1,
        ],
      }
    );

    res.json({
      msg: "User added successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};


// UPDATE USER
export const updateUser = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      name,
      email,
      role_id,
      is_active,
    } = req.body;

    await sequelize.query(
      `UPDATE users
      SET
        name=?,
        email=?,
        role_id=?,
        is_active=?
      WHERE id=?`,
      {
        replacements: [
          name,
          email,
          role_id,
          is_active,
          id,
        ],
      }
    );

    res.json({
      msg: "User updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};


// DELETE USER
export const deleteUser = async (req, res) => {

  try {

    const { id } = req.params;

    await sequelize.query(
      `DELETE FROM users WHERE id=?`,
      {
        replacements: [id],
      }
    );

    res.json({
      msg: "User deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};