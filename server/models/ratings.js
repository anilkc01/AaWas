import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";

const Rating = sequelize.define("Rating", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "The person giving the rating (e.g., Owner)"
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "The person being rated (e.g., Seeker)"
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: "ratings",
  timestamps: true,
});

// Associations
User.hasMany(Rating, { foreignKey: "receiverId", as: "receivedRatings" });
Rating.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

User.hasMany(Rating, { foreignKey: "reviewerId", as: "givenRatings" });
Rating.belongsTo(User, { foreignKey: "reviewerId", as: "reviewer" });

export default Rating;