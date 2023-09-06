const usersRouter = require("express").Router();
const {
  getUsers,
  getUser,
  postUser,
  deleteUser,
} = require("../../controllers/api/user-controller");
const { authenticateUsernameParameter } = require("../../middleware/verifyJWT");
const { checkUser } = require("../../middleware/check-user");
const {
  getCommentsByAuthor,
} = require("../../controllers/api/comments-controller");

usersRouter.route("/").get(getUsers).post(postUser);
usersRouter
  .route("/:username")
  .get(getUser)
  .delete(checkUser, authenticateUsernameParameter, deleteUser);
usersRouter.route("/:username/comments").get(checkUser, getCommentsByAuthor);

module.exports = usersRouter;
