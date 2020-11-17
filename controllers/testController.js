let controller = {}
module.exports = controller

controller.test = function (req, res) {
    res.json({"test": "OK"})
}