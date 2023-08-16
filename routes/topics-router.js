const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics-controller");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
