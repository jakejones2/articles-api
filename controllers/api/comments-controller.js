const {
  selectComments,
  insertComment,
  removeComment,
  selectComment,
  selectCommentsByAuthor,
} = require("../../models/comments-model");
const {
  deleteCurrentUserCommentVote,
  insertUserCommentVotes,
  selectCommentVotes,
  selectVotesByComment,
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
  let commentData;
  validatePaginationQueries(req.query)
    .then(() => {
      return selectComments(req.params.article_id, req.query);
    })
    .then((comments) => {
      commentData = comments;
      return selectCommentVotes();
    })
    .then(({ rows }) => {
      for (const comment of commentData.comments) {
        const matchingVoteRow = rows.find(
          (row) => row.comment_id === comment.comment_id
        );
        comment.votes = +matchingVoteRow?.votes || 0;
      }
      if (req.query.sort_by === "votes") {
        commentData.comments.sort((a, b) => {
          return b.votes - a.votes;
        });
      }
      res.status(200).send(commentData);
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
  let comment;
  validatePatchComment(req.body.inc_votes)
    .then(() => {
      return deleteCurrentUserCommentVote(req.user, req.params.comment_id);
    })
    .then(() => {
      return insertUserCommentVotes(
        req.user,
        req.params.comment_id,
        req.body.inc_votes
      );
    })
    .then(() => {
      return selectComment(req.params.comment_id);
    })
    .then((commentData) => {
      comment = commentData;
      return selectVotesByComment(req.params.comment_id);
    })
    .then(({ rows }) => {
      comment.votes = +rows[0].votes;
      res.status(200).send({ comment });
    })
    .catch(next);
}

function getCommentsByAuthor(req, res, next) {
  let comments;
  selectCommentsByAuthor(req.params.username)
    .then((commentsData) => {
      comments = commentsData;
      return selectCommentVotes();
    })
    .then(({ rows }) => {
      for (const comment of comments) {
        const matchingVoteRow = rows.find(
          (row) => row.comment_id === comment.comment_id
        );
        comment.votes = +matchingVoteRow?.votes || 0;
      }
      res.status(200).send({ comments });
    })
    .catch(next);
}

module.exports = {
  getComments,
  postComment,
  deleteComment,
  patchComment,
  getCommentsByAuthor,
};
