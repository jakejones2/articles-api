const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticles,
  deleteArticleById,
} = require("../controllers/articles-controller");
const {
  getComments,
  postComment,
} = require("../controllers/comments-controller");

articlesRouter.route("/").get(getArticles).post(postArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
