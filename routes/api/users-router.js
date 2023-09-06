const usersRouter = require("express").Router();
const {
  getUsers,
  getUser,
  postUser,
  deleteUser,
  getUserArticleVotes,
  getUserCommentVotes,
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
usersRouter
  .route("/:username/votes/comments")
  .get(checkUser, getUserCommentVotes);
usersRouter
  .route("/:username/votes/articles")
  .get(checkUser, getUserArticleVotes);

module.exports = usersRouter;
