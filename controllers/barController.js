const db = require('../database/db')
const logger = require('../logs')

let controller = {}
module.exports = controller

controller.getAll = async function (req, res) {
    const bars = await db.Bar.findAll()
    res.json(bars)
}

controller.getOne = async function (req, res) {
    const bar = await db.Bar.findOne({id: req.params.id})
    res.json(bar)
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

async function checkIfBarExist(bar, address) {

    let barsCandidates = await db.Bar.findAll({where: {name: bar.name}, include: "Address"})
    return barsCandidates.find((bar) =>
        bar.Address.country === address.country && bar.Address.city === address.city &&
        bar.Address.street === address.street && bar.Address.addressName === address.address_name &&
        bar.Address.postalCode === address.postal_code
    ) != null
}