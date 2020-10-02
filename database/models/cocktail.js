const {DataTypes} = require('sequelize')

module.exports = model;

function model(sequelize) {

    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }, volume: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isPositive(value) {
                    if (value < 0) {
                        throw new Error('A cocktail price must be positive.')
                    }
                }
            }
        }
    };

    const options = {
        sequelize, modelName: 'cocktail'
    };

    return sequelize.define('Cocktail', attributes, options);
}