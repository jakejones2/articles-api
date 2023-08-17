const logoutRouter = require("express").Router();
const { logoutController } = require("../controllers/logout-controller");

logoutRouter.get("/", logoutController);

module.exports = logoutRouter;
