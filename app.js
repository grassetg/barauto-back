const express = require("express");
const app = express();
const indexRouter = require('./routes/router');

app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// Create a redirection.
app.use('/', indexRouter)


module.exports = app;