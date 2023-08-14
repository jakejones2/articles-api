const { selectArticleById } = require("../models/articles-model");

function getArticleById(req, res, next) {
  res.status(200).send();
}

module.exports = { getArticleById };
