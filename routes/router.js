const express = require('express');
const router = express.Router();
const barController = require('../controllers/barController')
const cocktailController = require("../controllers/cocktailController")
const drinkController = require('../controllers/drinkController')
const db = require("../database/db");

router.get("/bar", barController.getAll)


router.get('/bar/:id', barController.getOne)


router.post('/bar', barController.createOne)


router.get("/cocktail", cocktailController.getAll)


router.get("/cocktail/:id", cocktailController.getOne)


router.post('/cocktail', cocktailController.createOne)


router.put('/cocktail/:id', cocktailController.update)


router.get('/drink', drinkController.getAll)


router.get('/drink/:id', drinkController.getOne)


router.post('/drink', drinkController.createOne)


router.put('/drink/:id', drinkController.update)


module.exports = router