const { selectArticles } = require("../models/articles-model");

function getArticles(req, res, next) {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticles };
