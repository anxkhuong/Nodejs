'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('bookings', {
            // statusId: DataTypes.STRING,
            // doctorId: DataTypes.INTEGER,
            // patientId: DataTypes.INTEGER,
            // date: DataTypes.DATE,
            // timeType: DataTypes.STRING,
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            statusId: {
                type: Sequelize.STRING
            },
            doctorId: {
                type: Sequelize.INTEGER
            },
            patientId: {
                type: Sequelize.INTEGER
            },
            date: {
                type: Sequelize.STRING
            },
            timeType: {
                type: Sequelize.STRING
            },
            token:{
                type:Sequelize.STRING
            },
            // fullName: {
            //     type: DataTypes.STRING,
            //     allowNull: false
            // },
            // phoneNumber: {
            //     type: DataTypes.STRING,
            //     allowNull: false
            // },
            // address: {
            //     type: DataTypes.STRING,
            //     allowNull: false
            // },
            // reason: {
            //     type: DataTypes.TEXT,
            //     allowNull: true
            // },
            // birthday: {
            //     type: DataTypes.STRING,
            //     allowNull: false
            // },
            // gender: {
            //     type: DataTypes.STRING,
            //     allowNull: false
            // }

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('bookings');
    }
};