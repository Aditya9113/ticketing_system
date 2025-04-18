const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Ticket = sequelize.define(
  "Ticket",
  {
    ticket_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    issue_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sponsor_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    section: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    issue_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("new", "ongoing", "resolved"),
      defaultValue: "new",
    },
    escalated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // asu_id: {
    //   type: DataTypes.STRING(10),
    //   allowNull: false,
    //   validate:{
    //     len:[10,10],
    //     isNumeric: true,
    //   },
    // },
  },
  {
    tableName: "tickets", // Ensure the table name is lowercase
    timestamps: false,
  }
);

module.exports = Ticket;
