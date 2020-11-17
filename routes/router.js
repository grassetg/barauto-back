const express = require('express');
const router = express.Router();
const barController = require('../controllers/barController')
const cocktailController = require("../controllers/cocktailController")
const db = require("../database/db");

router.get("/bar", barController.getAll)


router.get('/bar/:id', barController.getOne)


router.post('/bar', barController.createOne)


router.get("/cocktail", cocktailController.getAll)


router.get("/cocktail/:id", cocktailController.getOne)


router.post('/cocktail', cocktailController.createOne)


router.put('/cocktail/:id', cocktailController.update)


module.exports = router