const refreshRouter = require("express").Router();
const {
  handleRefreshToken,
} = require("../controllers/refresh-token-controller");

refreshRouter.get("/", handleRefreshToken);

module.exports = refreshRouter;
