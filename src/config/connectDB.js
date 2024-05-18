const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('develepment', 'root', null, {
    host: 'localhost',
    dialect: 'mysql'
});

let connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('ket noi oke thanh cong')
    } catch (error) {
        console.log('ket noi that bai roi nhu cc')
    }
}

module.exports = connectDB;