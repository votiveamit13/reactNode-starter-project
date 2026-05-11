import Inventory from "../models/Inventory.mjs";
import Product from "../models/Product.mjs";


// GET ALL
export const getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.findAll({
      include: [
        {
          model: Product,
          attributes: ["id", "name"],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.json(inventories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ADD
export const addInventory = async (req, res) => {
  try {
    const {
      product_id,
      quantity,
      purchase_price,
      selling_price,
      stock_status,
    } = req.body;

    const inventory = await Inventory.create({
      product_id,
      quantity,
      purchase_price,
      selling_price,
      stock_status,
    });

    res.status(201).json({
      message: "Inventory added successfully",
      inventory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE
export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      product_id,
      quantity,
      purchase_price,
      selling_price,
      stock_status,
    } = req.body;

    await Inventory.update(
      {
        product_id,
        quantity,
        purchase_price,
        selling_price,
        stock_status,
      },
      {
        where: { id },
      }
    );

    res.json({
      message: "Inventory updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE
export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    await Inventory.destroy({
      where: { id },
    });

    res.json({
      message: "Inventory deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};