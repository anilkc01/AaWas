import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    status: {
      type: DataTypes.ENUM("active", "suspended"),
      allowNull: false,
      defaultValue: "active",
    },
    rating: {
      type: DataTypes.FLOAT, // Allows for values like 4.5
      allowNull: true,       // Shows as null if no ratings exist
      validate: {
        min: 1,
        max: 5
      }
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

export default User;