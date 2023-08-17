const authRouter = require("express").Router();
const { authUser } = require("../controllers/auth-controller");
const verifyJWT = require("../middleware/verifyJWT");

authRouter.post("/", authUser);
authRouter.get("/admin", verifyJWT, (req, res, next) => {
  res.status(200).send("on the admin page");
});

module.exports = authRouter;
