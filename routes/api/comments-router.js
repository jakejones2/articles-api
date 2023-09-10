const commentsRouter = require("express").Router();
const {
  deleteComment,
  patchComment,
  getComment,
} = require("../../controllers/api/comments-controller");
const { verifyJWT } = require("../../middleware/verifyJWT");

commentsRouter
  .route("/:comment_id")
  .get(getComment)
  .patch(verifyJWT, patchComment)
  .delete(verifyJWT, deleteComment);

module.exports = commentsRouter;
