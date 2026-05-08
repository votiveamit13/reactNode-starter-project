const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.mjs");

const Staff = sequelize.define("staff", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
});

module.exports = Staff;