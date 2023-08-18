const usersRouter = require("express").Router();
const {
  getUsers,
  getUser,
  postUser,
  deleteUser,
} = require("../../controllers/api/user-controller");
const { authenticateUsernameParameter } = require("../../middleware/verifyJWT");
const { checkUser } = require("../../middleware/check-user");
usersRouter.route("/").get(getUsers).post(postUser);

usersRouter
  .route("/:username")
  .get(getUser)
  .delete(checkUser, authenticateUsernameParameter, deleteUser);

module.exports = usersRouter;
