const {
  selectComments,
  insertComment,
  removeComment,
  updateComment,
  selectComment,
} = require("../../models/comments-model");
const {
  checkNoUserCommentVotes,
  insertUserCommentVotes,
} = require("../../models/comments-users-model");

const { selectUser } = require("../../models/users-model");

const {
  validatePaginationQueries,
} = require("../../models/validators/article-validators");
const {
  validatePostComment,
  validatePatchComment,
} = require("../../models/validators/comment-validators");

function getComments(req, res, next) {
  validatePaginationQueries(req.query)
    .then(() => {
      return selectComments(req.params.article_id, req.query);
    })
    .then((response) => {
      return res.status(200).send(response);
    })
    .catch(next);
}

function postComment(req, res, next) {
  validatePostComment(req.body)
    .then(() => {
      return selectUser(req.body.username);
    })
    .then(() => {
      if (req.body.username !== req.user) {
        return Promise.reject({
          status: 403,
          msg: "Authenticated user does not match comment author",
        });
      }
      return insertComment(req.params.article_id, req.body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  selectComment(req.params.comment_id)
    .then((comment) => {
      if (comment.author !== req.user) {
        return Promise.reject({
          status: 403,
          msg: "Authenticated user does not match comment author",
        });
      }
      return removeComment(req.params.comment_id);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
}

function patchComment(req, res, next) {
  validatePatchComment(req.body.inc_votes)
    .then(() => {
      return checkNoUserCommentVotes(req.user, req.params.comment_id);
    })
    .then(() => {
      return insertUserCommentVotes(req.user, req.params.comment_id);
    })
    .then(() => {
      return updateComment(req.body.inc_votes, req.params.comment_id);
    })
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
}

module.exports = {
  getComments,
  postComment,
  deleteComment,
  patchComment,
  updateComment,
};
