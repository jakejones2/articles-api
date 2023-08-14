const { selectComments, insertComment } = require("../models/comments-model");

function getComments(req, res, next) {
  selectComments(req.params.article_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function createComments(req, res, next) {
  insertComment(req.params.article_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getComments, createComments };
