import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";

const Kyc = sequelize.define("Kyc", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idType: {
    type: DataTypes.ENUM("citizenship", "passport", "license"),
    allowNull: false,
  },
  documentImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,  // Set to true if optional
  },
  status: {
    type: DataTypes.ENUM("pending", "verified", "rejected"),
    defaultValue: "pending",
  },
});

User.hasOne(Kyc, { foreignKey: "userId", onDelete: "CASCADE" });
Kyc.belongsTo(User, { foreignKey: "userId" });

export default Kyc;