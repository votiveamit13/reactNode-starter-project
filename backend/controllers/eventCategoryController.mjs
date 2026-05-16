import sequelize from "../config/db.mjs";
import { QueryTypes } from "sequelize";


// GET CATEGORIES
export const getEventCategories = async (req, res) => {

  try {

    const categories = await sequelize.query(
      `SELECT *
       FROM event_categories
       ORDER BY id DESC`,
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
export const addEventCategory = async (req, res) => {

  try {

    const {
      name,
      status,
    } = req.body;

    await sequelize.query(
      `INSERT INTO event_categories
      (
        name,
        status
      )
      VALUES (?, ?)`,
      {
        replacements: [
          name,
          status,
        ],
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
export const updateEventCategory = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      name,
      status,
    } = req.body;

    await sequelize.query(
      `UPDATE event_categories
       SET
         name=?,
         status=?
       WHERE id=?`,
      {
        replacements: [
          name,
          status,
          id,
        ],
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
export const deleteEventCategory = async (req, res) => {

  try {

    const { id } = req.params;

    await sequelize.query(
      `DELETE FROM event_categories
       WHERE id=?`,
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