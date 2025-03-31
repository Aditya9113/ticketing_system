const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM("student", "TA", "admin"),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // // asu_id: {
  // //   type: DataTypes.STRING(10),
  // //   allowNull: false,
  // //   unique: true,
  // //   validate:{
  // //     len: [10,10],
  // //     isNumeric: true,
  // //   },
  // },
},{
  tableName: 'users', // Ensure the table name is lowercase
  timestamps: false,
});

module.exports = User;