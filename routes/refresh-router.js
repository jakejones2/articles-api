const refreshRouter = require("express").Router();
const { refreshController } = require("../controllers/refresh-controller");

refreshRouter.get("/", refreshController);

module.exports = refreshRouter;
