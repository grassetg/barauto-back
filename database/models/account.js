const {DataTypes} = require('sequelize')

module.exports = model;

function model(sequelize) {
    const attributes = {
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    };

    const options = {
        sequelize, modelName: 'account'
    };

    return sequelize.define('Account', attributes, options);
}