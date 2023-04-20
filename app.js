const express = require("express")
const itemsRoutes = require("./routes/items")
const ExpressError = require("./expressError")

const app = express();

app.use(express.json());
app.use("/items", itemsRoutes);

//invalid route
app.use(function(req, res, next){
    const err =  new ExpressError("Not found", 404);
    return next(err);
});

//error handler
app.use(function(err, req, res, next){
    res.status(err.status || 500);

    return res.json({
        error: err.message
    });
});

module.exports = app;
