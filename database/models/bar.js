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
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: true
        },
        img: {
            type: DataTypes.STRING,
            isUrl: true,
            allowNull: true,
            defaultValue: null
        }
    };

    const options = {
        sequelize, modelName: 'bar'
    };

    return sequelize.define('Bar', attributes, options);
}