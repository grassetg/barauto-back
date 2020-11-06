const express = require("express");
const app = express();
const indexRouter = require('./routes/router');

app.use(express.json())

// Create a redirection.
app.use('/', indexRouter)


module.exports = app;