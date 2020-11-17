const {DataTypes} = require('sequelize')

module.exports = model;

function model(sequelize) {

    const attributes = {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alcoholDegree: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: {
                isPositive
            }
        },
        volume: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isPositive
            }
        }
    };

    const options = {
        sequelize, modelName: 'drink'
    };

    return sequelize.define('Drink', attributes, options);
}

function isPositive(value) {
    if (value < 0) {
        throw new Error('A drink price must be positive.')
    }
}