const { Sequelize } = require('sequelize')
require('dotenv').config();
const sequelize = new Sequelize(
    process.env.DB_DATABASE_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD
    , {
    host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging:false,
        query:{
        'raw':true
        },
        timezone:'+07:00'
});
///123
let connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('ket noi thanh cong')
    } catch (error) {
        console.error('ket noi that bai den database:', error)
    }
}
module.exports = connectDB;