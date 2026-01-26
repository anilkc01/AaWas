import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";

const UserReport = sequelize.define("UserReport", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  reporterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "The user who is filing the report"
  },
  reportedUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "The user being reported"
  },
  reason: {
    type: DataTypes.ENUM(
      "scam",
      "harassment",
      "fake_profile",
      "inappropriate_behavior",
      "suspicious_activity",
      "other"
    ),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "resolved"),
    defaultValue: "pending",
  },
}, {
  tableName: "user_reports",
  timestamps: true
});

// Associations
User.hasMany(UserReport, { foreignKey: "reportedUserId", as: "reportsReceived" });
User.hasMany(UserReport, { foreignKey: "reporterId", as: "reportsFiled" });
UserReport.belongsTo(User, { foreignKey: "reportedUserId", as: "reportedUser" });
UserReport.belongsTo(User, { foreignKey: "reporterId", as: "reporter" });

export default UserReport;