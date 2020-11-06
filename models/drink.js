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
                isPositive(value) {
                    if (value < 0) {
                        throw new Error('A drink price must be positive.')
                    }
                }
            }
        }
    };

    const options = {
        sequelize, modelName: 'drink'
    };

    return sequelize.define('Drink', attributes, options);
}