const { commentData } = require("../../db/data/test-data");
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
  validateCommentQueries,
} = require("../../models/validators/comment-validators");

function getComments(req, res, next) {
  let commentData;
  let limit = req.query.limit;
  let page = req.query.p;
  let order = req.query.order;
  validatePaginationQueries(req.query)
    .then(() => {
      return validateCommentQueries(req.query);
    })
    .then(() => {
      if (req.query.sort_by === "votes") {
        // get all the comments
        req.query.limit = 10000;
        req.query.p = 1;
      }
      return selectComments(req.params.article_id, req.query);
    })
    .then((data) => {
      commentData = data;
      return selectCommentVotes();
    })
    .then(({ rows }) => {
      updateCommentsWithVoteData(commentData, rows);
      if (req.query.sort_by === "votes") {
        manuallySort(commentData, "votes", order);
        manuallyPaginate(commentData, limit, page);
      }
      res.status(200).send(commentData);
    })
    .catch(next);
}

function getCommentsByAuthor(req, res, next) {
  let commentData;
  let limit = req.query.limit;
  let page = req.query.p;
  let order = req.query.order;
  validatePaginationQueries(req.query)
    .then(() => {
      return validateCommentQueries(req.query);
    })
    .then(() => {
      if (req.query.sort_by === "votes") {
        // get all the comments
        req.query.limit = 10000;
        req.query.p = 1;
      }
      return selectCommentsByAuthor(req.params.username, req.query);
    })
    .then((data) => {
      commentData = data;
      return selectCommentVotes();
    })
    .then(({ rows }) => {
      updateCommentsWithVoteData(commentData, rows);
      if (req.query.sort_by === "votes") {
        manuallySort(commentData, "votes", order);
        manuallyPaginate(commentData, limit, page);
      }
      res.status(200).send(commentData);
    })
    .catch(next);
}

function getComment(req, res, next) {
  selectComment(req.params.comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
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

function manuallyPaginate(commentData, limit = 10, page = 1) {
  commentData.comments = commentData.comments.slice(
    (page - 1) * limit,
    page * limit
  );
}

function manuallySort({ comments }, field, order = "desc") {
  comments.sort((a, b) => {
    return order.toLowerCase() === "desc"
      ? b[field] - a[field]
      : a[field] - b[field];
  });
}

function updateCommentsWithVoteData({ comments }, voteData) {
  for (const comment of comments) {
    const matchingVoteRow = voteData.find(
      (row) => row.comment_id === comment.comment_id
    );
    comment.votes = +matchingVoteRow?.votes || 0;
  }
}

module.exports = {
  getComments,
  postComment,
  deleteComment,
  patchComment,
  getCommentsByAuthor,
  getComment,
};

// then redo tests
// then do all the above for articles...
