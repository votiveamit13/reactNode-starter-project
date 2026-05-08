import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const Staff = sequelize.define("Staff", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING
}, {
  tableName: "staff",
  timestamps: false
});

export default Staff;