import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("postgres", "postgres", "1234", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

export const connection = () => {
  try {
    sequelize.sync({ alter: true });
    console.log("Database Connected Sucessfully");
  } catch (e) {
    console.log(e);
  }
};
