import sequelize from "../config/db.mjs";
import { DataTypes } from "sequelize";

const Brand = sequelize.define(
  "brands",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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

export default Brand;