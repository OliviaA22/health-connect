const express = require("express");
const dashboardRouter = express.Router();
const dashboardController = require("../controllers/dashboardController");




dashboardRouter.get('/', dashboardController.search);


module.exports = dashboardRouter;