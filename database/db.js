const mysql = require('mysql2/promise');
const {Sequelize} = require('sequelize');

module.exports = db = {};

let databaseConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Gu1ll9ume',
    database: 'barauto'
}

initialize()

async function initialize() {
    // Create db if it doesn't already exist.
    const {host, port, user, password, database} = databaseConfig;
    const connection = await mysql.createConnection({host, port, user, password});
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // Connect to db.
    const sequelize = new Sequelize(database, user, password, {dialect: 'mysql'});

    // Init models and add them to the exported db object.
    db.Account = require('./models/account')(sequelize);
    db.Drink = require('./models/drink')(sequelize);
    db.Cocktail = require('./models/cocktail')(sequelize);
    db.CocktailHasDrink = require('./models/cocktailHasDrink')(sequelize);
    db.Order = require('./models/order')(sequelize);
    db.Bar = require('./models/bar')(sequelize);
    db.Address = require('./models/address')(sequelize);

    // Define associations.
    db.Cocktail.hasMany(db.Drink);
    db.Drink.belongsToMany(db.Cocktail, {through: 'CocktailHasDrink'});
    db.Bar.hasOne(db.Address);
    db.Address.belongsTo(db.Bar);

    // Sync all models with database.
    await sequelize.sync();

    setUpDummyData();
}

async function setUpDummyData() {

    const account0 = db.Account.build({firstName: 'Johnny', lastName: 'Cash', type: 'Client', birthdate: new Date()});
    await account0.save();
}