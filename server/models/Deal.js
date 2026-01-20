import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";
import Property from "./property.js";

const Deal = sequelize.define("Deal", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Property,
      key: 'id'
    }
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  finalPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  dealType: {
    type: DataTypes.ENUM("sale", "rent"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("completed", "cancelled"),
    defaultValue: "completed",
  }
}, {
  timestamps: true,
  tableName: 'deals'
});

// Associations
Property.hasOne(Deal, { foreignKey: "propertyId" });
Deal.belongsTo(Property, { foreignKey: "propertyId" });

User.hasMany(Deal, { foreignKey: "buyerId", as: "purchases" });
Deal.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });

User.hasMany(Deal, { foreignKey: "sellerId", as: "sales" });
Deal.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

export default Deal;