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

        let drink = db.Drink.findOrCreate({where : req.body})

        logger.info("Successfully created a new drink via POST.")
        res.status(200).send("OK")
    } catch (e) {

        logger.error("Error trying to save new drink via POST : " + e)
        res.status(500).send()
    }
}

controller.delete = async function(req, res) {
    try {
        let drink = await db.Drink.findOne({where: {id: req.params.id}})
        if (drink !== undefined) {
            drink.destroy()
        } else {
            logger.debug("Can't delete drink with id : " + req.params.id + " : it does not exist.")
            res.status(404).send("Can't delete drink with id : " + req.params.id + " : it does not exist.")
        }

        res.send("Successfully deleted drink.")
    } catch (e) {

        logger.error("Could not delete drink with id : " + req.params.id + " : " + e)
        res.status(500).send("could not delete drink with id" + req.params.id + "due to internal error.")
    }
}