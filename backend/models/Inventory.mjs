import sequelize from "../config/db.mjs";
import { DataTypes } from "sequelize";

const Inventory = sequelize.define(
  "inventories",
  {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    purchase_price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    selling_price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    stock_status: {
      type: DataTypes.ENUM("in_stock", "out_stock"),
      defaultValue: "in_stock",
    },
  },
  {
    timestamps: false,
  }
);

export default Inventory;