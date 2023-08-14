const { selectArticleById } = require("../models/articles-model");

function getArticleById(req, res, next) {
  selectArticleById(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById };
