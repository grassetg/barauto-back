const db = require('../database/db')
const logger = require('../logs')

let controller = {}
module.exports = controller

controller.getAll = async function (req, res) {
    const cocktails = await db.Cocktail.findAll({include: "Drinks"})
    res.json(cocktails)
}

controller.getOne = async function (req, res) {
    const cocktail = await db.Cocktail.findOne({where: {id: req.params.id}, include: "Drinks"})
    res.json(cocktail)
}

controller.update = async function(req, res) {

    try {

        await db.Cocktail.update(req.body, {where: {id: req.params.id}})
        res.status(200).send()
    } catch (e) {

        logger.error("Error trying to update cocktail via PUT : " + e)
        res.status(500).send()
    }
}

// TODO fix : should not create drink or cocktail if they already exist.
controller.createOne = async function (req, res) {
    if (req.body.Drinks === undefined) {
        res.status(400).send("Cannot create a cocktail without Drinks.")
        return
    }

    try {
        let givenDrinks = req.body.drinks
        let drinks = []
        let cocktail = db.Cocktail.build({
            name: req.body.cocktail.name,
            volume: req.body.cocktail.volume,
            price: req.body.cocktail.price
        })

        for (let i = 0; i < givenDrinks.length; i++) {
            let drink = await db.Drink.findOrBuild({ where: {
                    name: givenDrinks[i].name,
                    alcoholDegree: givenDrinks[i].alcoholDegree,
                    volume: givenDrinks[i].volume
                }
            })
            drinks.push(drink[0])
        }

        if (await checkIfCocktailExist(cocktail, drinks)) {

            logger.debug("Cancelled cocktail creation : cocktail already exists.")
            res.status(403).send("Cocktail already exists.")
            return
        }

        await cocktail.save()

        for (let index = 0; index < drinks.length; index++) {
            await drinks[index].save()
            await db.CocktailHasDrink.create({
                CocktailId: cocktail.id,
                DrinkId: drinks[index].id
            })
        }

        logger.info("Successfully created a new cocktail via POST.")
        res.status(200).send("OK")
    } catch (e) {

        logger.error("Error trying to save new cocktail via POST : " + e)
        res.status(500).send()
    }
}

async function checkIfCocktailExist(cocktail, drinks) {

    let cocktailCandidates = await db.Cocktail.findAll({where: {name: cocktail.name}, include: "Drinks"})
    for (let i = 0; i < cocktailCandidates.length; i++) {
        if (drinks.length === cocktailCandidates[i].length) {
            let containAll = true;

            for (let j = 0; j < drinks.length; j++) {
                if (!cocktailCandidates[i].Drinks.find(drink =>
                    drink.name === drinks[j].name && drink.alcoholDegree === drinks[j].alcoholDegree
                )) {
                    containAll = false;
                    break;
                }
            }
            if (containAll) {
                return true;
            }
        }
    }

    return false;
}