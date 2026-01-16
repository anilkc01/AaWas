import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";
import Property from "./property.js";

const Favourite = sequelize.define(
  "Favourite",
  {
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
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "propertyId"],
      },
    ],
  }
);

// Associations
User.hasMany(Favourite, { foreignKey: "userId" });
Property.hasMany(Favourite, { foreignKey: "propertyId" });
Favourite.belongsTo(User, { foreignKey: "userId" });
Favourite.belongsTo(Property, { foreignKey: "propertyId" });

export default Favourite;
