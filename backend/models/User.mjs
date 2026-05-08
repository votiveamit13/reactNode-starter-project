// models/User.mjs
import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const User = sequelize.define("User", {
  name: DataTypes.STRING,

  email: {
    type: DataTypes.STRING,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  reset_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  reset_token_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

}, {
  tableName: "users",
  timestamps: false,
});

export default User;