const authRouter = require("express").Router();
const { authUser } = require("../controllers/auth-controller");
const { verifyJWT } = require("../middleware/verifyJWT");

authRouter.post("/", authUser);
authRouter.get("/account", verifyJWT, (req, res, next) => {
  res.status(200).send({ "logged-in": true });
});

module.exports = authRouter;
