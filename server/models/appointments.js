// models/Appointment.js
import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";
import Property from "./property.js";

const Appointment = sequelize.define("Appointment", {
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
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
    defaultValue: "pending",
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

User.hasMany(Appointment, { foreignKey: "userId", onDelete: "CASCADE" });
Appointment.belongsTo(User, { foreignKey: "userId" });

Property.hasMany(Appointment, { foreignKey: "propertyId", onDelete: "CASCADE" });
Appointment.belongsTo(Property, { foreignKey: "propertyId" });

export default Appointment;