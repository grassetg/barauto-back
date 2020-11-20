const mysql = require('mysql2/promise');
const {Sequelize} = require('sequelize');
const logger  = require("../logs");

let db = {}
module.exports = db;

let databaseConfig = require('./config/dbConfig')

initialize()

async function initialize() {
    try {
        // Connect to db.
        const sequelize = new Sequelize('mysql://b430d44502abe2:fae5056d@eu-cdbr-west-03.cleardb.net/heroku_981aafe7f3ef5f6');

        // Init models and add them to the exported db object.
        db.Account = require('./models/account')(sequelize);
        db.Drink = require('./models/drink')(sequelize);
        db.Cocktail = require('./models/cocktail')(sequelize);
        db.CocktailHasDrink = require('./models/cocktailHasDrink')(sequelize);
        db.Order = require('./models/order')(sequelize);
        db.Bar = require('./models/bar')(sequelize);
        db.Address = require('./models/address')(sequelize);

        // Define associations.
        db.Cocktail.belongsToMany(db.Drink, {through: 'CocktailHasDrink'});
        db.Drink.belongsToMany(db.Cocktail, {through: 'CocktailHasDrink'});
        db.Bar.hasOne(db.Address);
        db.Address.belongsTo(db.Bar);
        db.Bar.hasMany(db.Cocktail, {as: "Cocktails"})
        db.Cocktail.belongsTo(db.Bar, {
            foreignKey: "BarId",
            as: "bar",
        });

        // Sync all models with database.
        await sequelize.sync({alter: true})

        await setUpTestData();

        logger.info("Finished initialization.")

    } catch (e) {

        logger.error("Error starting sequelize : " + e);
        return 1;
    }
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

    if (nbAddresses === 0) {
        await setUpAddresses();
    }

    if (nbBars === 0) {
        await setUpBars();
    }

    if (nbCocktails === 0) {
        await setUpCocktails();
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

    await db.Drink.create({name: 'Vodka', alcoholDegree: 37.5, volume: 20.0});
    await db.Drink.create({name: 'Gin', alcoholDegree: 43.1, volume: 10.0});
    await db.Drink.create({name: 'Sirop', alcoholDegree: 0, volume: 15.0});
    await db.Drink.create({name: 'Eau', alcoholDegree: 0, volume: 45.0});
    await db.Drink.create({name: 'Rhum', alcoholDegree: 37.5, volume: 30.0});
}

async function setUpCocktails() {
    let bars = await db.Bar.findAll()
    let bar = bars[0]
    let cocktail = db.Cocktail.build({
        name: "Menthe à l'eau",
        volume: 0.1, // Litres
        price: 3.00,
        BarId: bar.id
    });
    await cocktail.save()

    let eauId = (await db.Drink.findOne({where: {name: 'Eau'}})).id
    let siropId = (await db.Drink.findOne({where: {name: 'Sirop'}})).id

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
    let bar = db.Bar.create({
        name: "L'étalon noir"
    });

    await db.Address.create({
        country: "France",
        city: "Kremlin-Bicêtre",
        street: "15 avenue Fontainebleau",
        postalCode: 75002,
        BarId: bar.id
    })

    let bar2 = await db.Bar.create({
        name: "The Lions",
        desc: "Le joyeux luron est l'endroit idéal pour boire un coup et se détendre !",
        url: "http://www.lesbarres.com/media/image/slideshow/7c6dae72ef8fc4eb5dffbf7595b45c12822a1264.JPG"
    })

    await db.Address.create({
        country: "France",
        city: "Paris",
        street: "120 rue Montmartre",
        postalCode: 94270,
        BarId: bar2.id
    })
}