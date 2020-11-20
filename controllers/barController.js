const db = require('../database/db')
const logger = require('../logs')

let controller = {}
module.exports = controller

controller.getAll = async function (req, res) {
    const bars = await db.Bar.findAll({include : ["Address", "Cocktails"]})
    res.json(bars)
}

controller.getOne = async function (req, res) {
    const bar = await db.Bar.findOne({id: req.params.id, include: ["Address", "Cocktails"]})
    res.json(bar)
}

controller.update = async function(req, res) {

    try {

        await db.Bar.update(req.body, {where: {id: req.params.id}})
        res.status(200).send()
    } catch (e) {

        logger.error("Error trying to update bar via PUT : " + e)
        res.status(500).send()
    }
}

controller.createOne = async function (req, res) {
    if (req.body.bar === undefined || req.body.bar_address === undefined) {
        res.status(400).send("Incomplete request, make sure both 'bar' and 'bar_address' fields exists.")
        return
    }

    try {

        let bar_address = req.body.bar_address
        let bar = db.Bar.build({
            name: req.body.bar.name
        })

        if (await checkIfBarExist(bar, bar_address)) {

            logger.debug("Cancelled bar creation : bar already exists.")
            res.status(403).send("Bar already exists.")
            return
        }

        await bar.save()

        db.Address.create({
            country: bar_address.country,
            city: bar_address.city,
            street: bar_address.street,
            addressName: bar_address.address_name,
            postalCode: bar_address.postal_code,
            BarId: bar.id
        })

        logger.info("Successfully created a new bar via POST.")
        res.status(200).send("OK")
    } catch (e) {

        logger.error("Error trying to save new bar via POST : " + e)
        res.status(500).send()
    }
}

controller.delete = async function(req, res) {
    try {
        let bar = await db.Bar.findOne({where: {id: req.params.id}})
        if (bar !== undefined) {
            bar.destroy()
        } else {
            logger.debug("Can't delete bar with id : " + req.params.id + " : it does not exist.")
            res.status(404).send("Can't delete bar with id : " + req.params.id + " : it does not exist.")
        }

        res.send("Successfully deleted bar.")
    } catch (e) {

        logger.error("Could not delete bar with id : " + req.params.id + " : " + e)
        res.status(500).send("could not delete bar with id" + req.params.id + "due to internal error.")
    }
}

async function checkIfBarExist(bar, address) {

    let barsCandidates = await db.Bar.findAll({where: {name: bar.name}, include: "Address"})
    return barsCandidates.find((bar) =>
        bar.Address.country === address.country && bar.Address.city === address.city &&
        bar.Address.street === address.street && bar.Address.addressName === address.address_name &&
        bar.Address.postalCode === address.postal_code
    ) != null
}