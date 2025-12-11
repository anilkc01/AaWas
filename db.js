import {Sequelize} from "sequelize";

export const sequelize = new Sequelize("postgres","postgres","postgres",{
    host: "localhost",
    dialect: "postgres",
});

export const connection = () => {
    try {
        sequelize.sync(true);
        console.log ("Database Connected Sucessfully");}
    catch(e){
        console.log(e);

    }
};
