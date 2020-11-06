const mysql = require('mysql2/promise');
const {Sequelize} = require('sequelize');

let db = {}
module.exports = db;

let databaseConfig = require('./config/dbConfig')

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

    await setUpTestData();
}

async function setUpTestData() {

    let nbAccounts = await db.Account.findAll();
    nbAccounts = nbAccounts.length;
    let nbDrinks = await db.Drink.findAll();
    nbDrinks = nbDrinks.length;
    let nbCocktails = await db.Cocktail.findAll();
    nbCocktails = nbCocktails.length;
    let nbAddresses = await db.Address.findAll();
    nbAddresses = nbAddresses.length;

    let allBars = await db.Bar.findAll()
    let nbBars = allBars.length

    if (nbAccounts === 0) {
        await setUpAccounts();
    }

    if (nbDrinks === 0) {
        await setUpDrinks();
    }

    if (nbCocktails === 0) {
        await setUpCocktails();
    }

    if (nbAddresses === 0) {
        await setUpAddresses();
    }

    if (nbBars === 0) {
        await setUpBars();
    }
}

async function setUpAccounts() {

    await db.Account.create({firstName: 'Matthieu', lastName: 'Aubry', type: 'Barman', birthdate: new Date()});
    await db.Account.create({firstName: 'Cédric', lastName: 'Baudoin', type: 'Barman', birthdate: new Date()});
    await db.Account.create({firstName: 'Guillaume', lastName: 'Grasset', type: 'Barman', birthdate: new Date()});
    await db.Account.create({firstName: 'Edouard', lastName: 'Mahe', type: 'Barman', birthdate: new Date()});
    await db.Account.create({firstName: 'Sara', lastName: 'Mellouk', type: 'Barman', birthdate: new Date()});
    await db.Account.create({firstName: 'Johnny', lastName: 'Cash', type: 'Client', birthdate: new Date()});
    await db.Account.create({firstName: 'John', lastName: 'Snow', type: 'Client', birthdate: new Date()});
    await db.Account.create({firstName: 'Yan', lastName: 'Solo', type: 'Client', birthdate: new Date()});
    await db.Account.create({firstName: 'Chew', lastName: 'Baka', type: 'Client', birthdate: new Date()});
    await db.Account.create({firstName: 'Harry', lastName: 'Podfleur', type: 'Client', birthdate: new Date()});
    await db.Account.create({firstName: 'Jay', lastName: 'Pludidee', type: 'Client', birthdate: new Date()});
}

async function setUpDrinks() {

    await db.Drink.create({name: 'Vodka', alcoholDegree: 37.5});
    await db.Drink.create({name: 'Gin', alcoholDegree: 43.1});
    await db.Drink.create({name: 'Sirop', alcoholDegree: 0});
    await db.Drink.create({name: 'Eau', alcoholDegree: 0});
    await db.Drink.create({name: 'Rhum', alcoholDegree: 37.5});
}

async function setUpCocktails() {
    let cocktail = db.Cocktail.build({
        name: "Menthe à l'eau",
        volume: 0.1, // Litres
        price: 3.00
    });
    await cocktail.save()

    let eauId = (await db.Drink.findOne({where: {name : 'Eau'}})).id
    let siropId = (await db.Drink.findOne({where: {name : 'Sirop'}})).id

    await db.CocktailHasDrink.create({CocktailId: cocktail.id, DrinkId: eauId})
    await db.CocktailHasDrink.create({CocktailId: cocktail.id, DrinkId: siropId})
}

async function setUpAddresses() {
    await db.Address.create({
        country: "France",
        city: "Kremlin-Bicêtre",
        street: "14-16 Rue Voltaire",
        addressName: "Epita Kremlin Bicêtre",
        postalCode: 94270
    });
}

async function setUpBars() {
    let bar = db.Bar.build({
        name: "L'étalon noir"
    });
    await bar.save()

    await db.Address.create({
        country: "France",
        city: "Kremlin-Bicêtre",
        street: "15 avenue Fontainebleau",
        addressName: "L'étalon noir",
        postalCode: 94270,
        barId: bar.id
    })
}