import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";
import Property from "./property.js";

const PropertyReport = sequelize.define("PropertyReport", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reason: {
    type: DataTypes.ENUM(
      "fake_listing",
      "scam",
      "wrong_price",
      "duplicate",
      "offensive_content",
      "other"
    ),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM("pending", "resolved"),
    defaultValue: "pending",
  },
});

// Associations
User.hasMany(PropertyReport, { foreignKey: "userId" });
Property.hasMany(PropertyReport, { foreignKey: "propertyId" });
PropertyReport.belongsTo(User, { foreignKey: "userId" });
PropertyReport.belongsTo(Property, { foreignKey: "propertyId" });

export default PropertyReport;
