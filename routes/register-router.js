const registerRouter = require("express").Router();
const { postUser } = require("../controllers/register-controller");

registerRouter.post("/", postUser);

module.exports = registerRouter;
