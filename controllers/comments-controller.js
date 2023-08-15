const {
  selectComments,
  insertComment,
  removeComment,
} = require("../models/comments-model");
const { selectUsernames } = require("../models/users-model");

function getComments(req, res, next) {
  selectComments(req.params.article_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch(next);
}

function createComment(req, res, next) {
  selectUsernames()
    .then((rows) => {
      return rows.map((row) => row.username);
    })
    .then((usersList) => {
      insertComment(req.params.article_id, req.body, usersList)
        .then((comment) => {
          res.status(201).send({ comment });
        })
        .catch(next);
    });
}

function deleteComment(req, res, next) {
  removeComment(req.params.comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
}

module.exports = { getComments, createComment, deleteComment };
