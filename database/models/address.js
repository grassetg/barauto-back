const {DataTypes} = require('sequelize')

module.exports = model;

function model(sequelize) {

    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postalCode: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isPostalCode(postalCode) {
                    if (postalCode < 0 || postalCode >= 1000000000) {
                        throw new Error('This address postal code is incorrect.')
                    }
                }
            }
        }
    };

    const options = {
        sequelize, modelName: 'address'
    };

    return sequelize.define('Address', attributes, options);
}