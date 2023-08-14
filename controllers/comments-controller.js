const { selectComments, insertComments } = require("../models/comments-model");

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
  res.status(201).send();
}

module.exports = { getComments, createComments };
