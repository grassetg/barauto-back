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

controller.getAllByBar = async function (req, res) {
    const cocktails = await db.Cocktail.findAll({where: {BarId: req.params.barId}, include: "Drinks"})
    res.json(cocktails)
}

controller.update = async function (req, res) {

    try {

        await db.Cocktail.update(req.body, {where: {id: req.params.id}})
        res.status(200).send()
    } catch (e) {

        logger.error("Error trying to update cocktail via PUT : " + e)
        res.status(500).send()
    }
}

controller.createOne = async function (req, res) {

    let created = await createCocktailWithDrinks(req.body, req.params.barId)

    if (created === null) {
        res.status(500).send("Something happened.")
    } else if (created) {
        res.status(200).send("OK")
    } else {
        res.status(403).send("Cocktail already exists.")
    }
}

controller.delete = async function (req, res) {
    try {
        let cocktail = await db.Cocktail.findOne({where: {id: req.params.id}})
        if (cocktail !== undefined) {
            await cocktail.destroy()
        } else {
            logger.debug("Can't delete cocktail with id : " + req.params.id + " : it does not exist.")
            res.status(404).send("Can't delete cocktail with id : " + req.params.id + " : it does not exist.")
        }

        res.send("Successfully deleted cocktail.")
    } catch (e) {

        logger.error("Could not delete cocktail with id : " + req.params.id + " : " + e)
        res.status(500).send("could not delete cocktail with id" + req.params.id + "due to internal error.")
    }
}

async function createCocktailWithDrinks(cocktailJson, barId = null) {
    try {

        let cocktailInDb = await db.Cocktail.findOne({
            where: {
                name: cocktailJson.name,
                volume: cocktailJson.volume,
                price: cocktailJson.price,
                BarId: barId
            }, include: "Drinks"
        })
        logger.debug("Cocktail exist ? " + cocktailInDb)

        if (cocktailInDb) {

            logger.debug("Cancelled cocktail creation : cocktail already exists.")
            return false
        }

        let drinksJson = cocktailJson.Drinks
        let drinks = []
        let cocktail = db.Cocktail.build({
            name: cocktailJson.name,
            volume: cocktailJson.volume,
            price: cocktailJson.price,
            BarId: barId
        })

        for (let i = 0; i < drinksJson.length; i++) {
            let drink = db.Drink.build({
                name: drinksJson[i].name,
                alcoholDegree: drinksJson[i].alcoholDegree,
                volume: drinksJson[i].volume
            })
            drinks.push(drink)
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
        return true
    } catch (e) {

        logger.error("Error trying to save new cocktail via POST : " + e)
        return null
    }
}