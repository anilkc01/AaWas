import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";

const Property = sequelize.define("Property", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  propertyType: {
    type: DataTypes.ENUM("house", "apartment", "room"),
    allowNull: false,
  },
  listedFor: {
    type: DataTypes.ENUM("sell", "rent"),
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  beds: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  living: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  kitchen: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dpImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  isBidding: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

User.hasMany(Property, { foreignKey: "userId", onDelete: "CASCADE" });
Property.belongsTo(User, { foreignKey: "userId" });

export default Property;