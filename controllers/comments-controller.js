const { selectComments, insertComment } = require("../models/comments-model");
const { selectUsernames } = require("../models/usernames-model");

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
  selectUsernames()
    .then((rows) => {
      return rows.map((row) => row.username);
    })
    .then((usersList) => {
      insertComment(req.params.article_id, req.body, usersList)
        .then((comment) => {
          res.status(201).send({ comment });
        })
        .catch((err) => {
          next(err);
        });
    });
}

module.exports = { getComments, createComments };
