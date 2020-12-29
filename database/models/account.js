const {DataTypes} = require('sequelize')

module.exports = model;

function model(sequelize) {
    const attributes = {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAcccountType(type) {
                    if (type !== "Client" && type !== "Barman") {
                        throw new Error('An account type must be either "Client" or "Barman".');
                    }
                }
            }
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
        sequelize, modelName: 'account',
        paranoid: true
    };

    return sequelize.define('Account', attributes, options);
}