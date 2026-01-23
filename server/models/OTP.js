import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js"; // Import your User model

const OTP = sequelize.define(
  "OTP",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Matches the tableName in your User model
        key: "id",
      },
      onDelete: "CASCADE", // If user is deleted, delete their OTPs
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "otps",
    timestamps: true,
  }
);

// Setup Association
User.hasMany(OTP, { foreignKey: "userId" });
OTP.belongsTo(User, { foreignKey: "userId" });

export default OTP;