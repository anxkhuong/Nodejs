const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
    process.env.DB_DATABASE_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD, {
    host: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
});

let connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('ket noi oke thanh cong')
    } catch (error) {
        console.log('ket noi that bai roi nhu cc',error.stack)
    }
}

module.exports = connectDB;