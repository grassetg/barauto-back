const db = require('../database/db')
const logger = require('../logs')

let controller = {}
module.exports = controller

controller.getAll = async function (req, res) {
    const drinks = await db.Drink.findAll()
    res.json(drinks)
}

controller.getOne = async function (req, res) {
    const drink = await db.Drink.findOne({where: {id: req.params.id}})
    res.json(drink)
}

controller.update = async function(req, res) {

    try {

        await db.Drink.update(req.body, {where: {id: req.params.id}})
        res.status(200).send()
    } catch (e) {

        logger.error("Error trying to update drink via PUT : " + e)
        res.status(500).send()
    }
}

controller.createOne = async function (req, res) {
    try {

        let result = await db.Drink.findOrCreate({where : req.body})
        if (result[1]) {

            logger.info("Successfully created a new drink via POST.")
            res.status(200).send("OK")
        } else {

            logger.info("Drink already exists.")
            res.status(403).send("Drink already exists.")
        }

    } catch (e) {

        logger.error("Error trying to save new drink via POST : " + e)
        res.status(500).send()
    }
}