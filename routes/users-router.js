const usersRouter = require("express").Router();
const {
  getUsers,
  getUser,
  postUser,
} = require("../controllers/user-controller");

usersRouter.get("/", getUsers);
usersRouter.post("/", postUser);

usersRouter.route("/:username").get(getUser);

module.exports = usersRouter;
