// models/Bid.js
import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";
import Property from "./property.js";

const Bid = sequelize.define("Bid", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bidAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "accepted", "rejected", "withdrawn"),
    defaultValue: "active",
  },
});

User.hasMany(Bid, { foreignKey: "userId", onDelete: "CASCADE" });
Bid.belongsTo(User, { foreignKey: "userId" });

Property.hasMany(Bid, { foreignKey: "propertyId", onDelete: "CASCADE" });
Bid.belongsTo(Property, { foreignKey: "propertyId" });

export default Bid;