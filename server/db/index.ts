import {Sequelize} from "sequelize"

export const sequelize = new Sequelize({
    dialect: "postgres",
    username: "yhiafpefglehio",
    password: "f0db32ac2e48964dd31d3879e142bab8741ab317bca5b0e566c5d763adbdc2c3",
    database: "denc56ph7e416t",
    port: 5432,
    host: "ec2-3-222-204-187.compute-1.amazonaws.com",
    ssl: true,
    // esto es necesario para que corra correctamente
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });