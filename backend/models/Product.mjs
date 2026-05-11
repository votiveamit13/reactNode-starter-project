import sequelize from "../config/db.mjs";
import { DataTypes } from "sequelize";
import Inventory from "./Inventory.mjs";

const Product = sequelize.define(
  "products",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    brand_id: {
      type: DataTypes.INTEGER,
    },

    category_id: {
      type: DataTypes.INTEGER,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    timestamps: false,
  }
);


// RELATIONS

Product.hasMany(Inventory, {
  foreignKey: "product_id",
});

Inventory.belongsTo(Product, {
  foreignKey: "product_id",
});


export default Product;