const commentsRouter = require("express").Router();
const { deleteComment } = require("../controllers/comments-controller");

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
