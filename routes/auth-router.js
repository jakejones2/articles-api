const authRouter = require("express").Router();
const { authUser } = require("../controllers/auth-controller");

authRouter.post("/", authUser);

module.exports = authRouter;
