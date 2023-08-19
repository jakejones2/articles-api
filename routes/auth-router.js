const authRouter = require("express").Router();
const { authUser } = require("../controllers/auth-controller");
const { verifyJWT } = require("../middleware/verifyJWT");

authRouter.post("/", authUser);

module.exports = authRouter;
