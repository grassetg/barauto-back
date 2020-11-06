const express = require('express');
const router = express.Router();
const barController = require('../controllers/barController')

router.get("/bars", barController.getAll)


router.get('/bar/:id', barController.getOne)


router.post('/bar', barController.createOne)

module.exports = router