import sequelize from "../config/db.mjs";
import { QueryTypes } from "sequelize";


// GET CATEGORY
export const getCategories = async (req, res) => {
  try {

    const categories = await sequelize.query(
      "SELECT * FROM categories ORDER BY id DESC",
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(categories);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }
};


// ADD CATEGORY
export const addCategory = async (req, res) => {

  try {

    const { name, status } = req.body;

    if (!name) {

      return res.status(400).json({
        msg: "Category name required",
      });

    }

    await sequelize.query(
      "INSERT INTO categories (name, status) VALUES (?, ?)",
      {
        replacements: [name, status || "active"],
      }
    );

    res.json({
      msg: "Category added successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};


// UPDATE CATEGORY
export const updateCategory = async (req, res) => {

  try {

    const { id } = req.params;

    const { name, status } = req.body;

    await sequelize.query(
      "UPDATE categories SET name=?, status=? WHERE id=?",
      {
        replacements: [name, status, id],
      }
    );

    res.json({
      msg: "Category updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};


// DELETE CATEGORY
export const deleteCategory = async (req, res) => {

  try {

    const { id } = req.params;

    await sequelize.query(
      "DELETE FROM categories WHERE id=?",
      {
        replacements: [id],
      }
    );

    res.json({
      msg: "Category deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};