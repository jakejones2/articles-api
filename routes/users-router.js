const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/user-controller");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
