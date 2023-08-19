const {
  selectArticleById,
  updateArticleById,
  insertArticle,
  selectArticleAndCommentCountById,
  selectArticles,
  removeArticle,
} = require("../../models/articles-model");

const {
  validateArticleQueries,
  validatePostArticle,
  validatePaginationQueries,
  validatePatchArticle,
} = require("../../models/validators/article-validators");

const { selectTopic } = require("../../models/topics-model");
const { selectUser } = require("../../models/users-model");

function getArticleById(req, res, next) {
  selectArticleById(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  const promises = [
    validateArticleQueries(req.query),
    validatePaginationQueries(req.query),
  ];
  const { topic, author } = req.query;
  if (topic) promises.push(selectTopic(topic));
  if (author) promises.push(selectUser(author));
  Promise.all(promises)
    .then(() => {
      return selectArticles(req.query);
    })
    .then((articleData) => {
      res.status(200).send(articleData);
    })
    .catch(next);
}

function patchArticleById(req, res, next) {
  validatePatchArticle(req.body.inc_votes)
    .then(() => {
      return updateArticleById(req.params.article_id, req.body.inc_votes);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function postArticles(req, res, next) {
  validatePostArticle(req.body)
    .then(() => {
      return selectTopic(req.body.topic);
    })
    .then(() => {
      return selectUser(req.body.author);
    })
    .then((user) => {
      if (user.username !== req.user) {
        return Promise.reject({
          status: 403,
          msg: "Authenticated user does not match article author",
        });
      } else return insertArticle(req.body);
    })
    .then((article) => {
      return selectArticleAndCommentCountById(article.article_id);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
}

function deleteArticleById(req, res, next) {
  selectArticleById(req.params.article_id)
    .then((article) => {
      if (article.author !== req.user) {
        return Promise.reject({
          status: 403,
          msg: "Authenticated user does not match article author",
        });
      } else return Promise.resolve();
    })
    .then(() => {
      return removeArticle(req.params.article_id);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
}

module.exports = {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticles,
  deleteArticleById,
};
