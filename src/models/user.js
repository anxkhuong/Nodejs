'use strict';
const {
    Model,
    UUID,
    DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Allcode,{foreignKey:'positionId', targetKey:'keyMap',as:'positionData'})
            User.belongsTo(models.Allcode,{foreignKey:'gender', targetKey:'keyMap',as:'genderData'})
            User.hasOne(models.Markdown, { foreignKey: 'doctorId' });

        }
    }
    User.init({

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Đánh dấu cột 'id' là primaryKey
            autoIncrement: true
        },
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        address: DataTypes.STRING,
        gender: DataTypes.STRING,
        roleId: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        image: DataTypes.STRING,
        positionId: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};