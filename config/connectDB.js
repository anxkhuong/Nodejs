const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('develepment', 'root', null, {
    host: 'localhost',
    dialect: 'mysql'
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