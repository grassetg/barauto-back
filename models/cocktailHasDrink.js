const {DataTypes} = require('sequelize')

module.exports = model;

function model(sequelize) {

    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    };

    const options = {
        sequelize, modelName: 'cocktailHasDrink'
    };

    return sequelize.define('CocktailHasDrink', attributes, options);
}