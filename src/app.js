const express = require("express");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");
require("./config/database");

const app = express();

app.use(express.json());
app.use("/order", orderRoutes); // todas as rotas começam com /order

app.use(errorHandler); // sempre por último!

module.exports = app;
