import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("aawas", "postgres", "hello", {
  host: "localhost",
  port: 5433,
  dialect: "postgres",
});

export const connection = () => {
  try {
    sequelize.sync();
    console.log("Database Connected Sucessfully");
  } catch (e) {
    console.log(e);
  }
};
