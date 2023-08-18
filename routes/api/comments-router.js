const commentsRouter = require("express").Router();
const {
  deleteComment,
  patchComment,
} = require("../../controllers/api/comments-controller");
const { verifyJWT } = require("../../middleware/verifyJWT");

commentsRouter
  .route("/:comment_id")
  .delete(verifyJWT, deleteComment)
  .patch(patchComment);

module.exports = commentsRouter;
