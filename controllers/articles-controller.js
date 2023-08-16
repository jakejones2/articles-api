const {
  selectArticleById,
  updateArticleById,
  insertArticle,
  selectArticleAndCommentCountById,
  selectArticles,
} = require("../models/articles-model");

const {
  validateArticleQueries,
  validatePostArticle,
  validatePaginationQueries,
} = require("../models/validators/article-validators");

const { selectTopic } = require("../models/topics-model");

const { selectUser } = require("../models/users-model");

function getArticleById(req, res, next) {
  selectArticleById(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  const promises = [];
  promises.push(validateArticleQueries(req.query));
  promises.push(validatePaginationQueries(req.query));
  const topic = req.query.topic;
  if (topic) promises.push(selectTopic(topic));
  return Promise.all(promises)
    .then(() => {
      return selectArticles(req.query);
    })
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(next);
}

function patchArticleById(req, res, next) {
  updateArticleById(req.params.article_id, req.body.inc_votes)
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
    .then(() => {
      return insertArticle(req.body);
    })
    .then((article_id) => {
      return selectArticleAndCommentCountById(article_id);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
}

module.exports = {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticles,
};
