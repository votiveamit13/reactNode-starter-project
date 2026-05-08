import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const Admin = sequelize.define("Admin", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  name: DataTypes.STRING
}, {
  tableName: "admins",
  timestamps: false
});

export default Admin;