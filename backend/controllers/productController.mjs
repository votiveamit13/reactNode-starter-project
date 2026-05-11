import sequelize from "../config/db.mjs";
import { QueryTypes } from "sequelize";


// GET PRODUCTS
export const getProducts = async (req, res) => {

  try {

    const products = await sequelize.query(
      `SELECT
      p.*,
      c.name AS category_name,
      b.name AS brand_name
      FROM products p
      LEFT JOIN categories c
      ON p.category_id = c.id
      LEFT JOIN brands b
      ON p.brand_id = b.id
      ORDER BY p.id DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(products);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};


// ADD PRODUCT
export const addProduct = async (req, res) => {

  try {

    const {
      category_id,
      brand_id,
      name,
      price,
      qty,
      status,
    } = req.body;

    const image = req.file
      ? `/uploads/products/${req.file.filename}`
      : null;

    await sequelize.query(
      `INSERT INTO products
      (
        category_id,
        brand_id,
        name,
        price,
        qty,
        image,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          category_id,
          brand_id,
          name,
          price,
          qty,
          image,
          status,
        ],
      }
    );

    res.json({
      msg: "Product added successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};


// UPDATE PRODUCT
export const updateProduct = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      category_id,
      brand_id,
      name,
      price,
      qty,
      status,
    } = req.body;

    let imageQuery = "";

    let replacements = [
      category_id,
      brand_id,
      name,
      price,
      qty,
      status,
    ];

    if(req.file) {

      imageQuery = ", image=?";

      replacements.push(
        `/uploads/products/${req.file.filename}`
      );

    }

    replacements.push(id);

    await sequelize.query(
      `UPDATE products
      SET
        category_id=?,
        brand_id=?,
        name=?,
        price=?,
        qty=?,
        status=?
        ${imageQuery}
      WHERE id=?`,
      {
        replacements,
      }
    );

    res.json({
      msg: "Product updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};


// DELETE PRODUCT
export const deleteProduct = async (req, res) => {

  try {

    const { id } = req.params;

    await sequelize.query(
      "DELETE FROM products WHERE id=?",
      {
        replacements: [id],
      }
    );

    res.json({
      msg: "Product deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};