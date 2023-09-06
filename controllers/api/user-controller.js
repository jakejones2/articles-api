const { validatePostUser } = require("../../models/validators/user-validators");
const {
  selectUsers,
  selectUser,
  insertUser,
  removeUser,
} = require("../../models/users-model");
const {
  selectCommentVotesByUser,
} = require("../../models/comments-users-model");
const {
  selectArticleVotesByUser,
} = require("../../models/articles-users-model");

function getUsers(_, res, next) {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
}

function getUser(req, res, next) {
  selectUser(req.params.username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

function postUser(req, res, next) {
  validatePostUser(req.body)
    .then(() => {
      return selectUser(req.body.username);
    })
    .then(() => {
      res.status(409).send({ msg: "Username already exists" });
    })
    .catch((err) => {
      if (err.status !== 404) return next(err);
      insertUser(req.body).then((user) => {
        res.status(201).send({ user });
      });
    });
}

function deleteUser(req, res, next) {
  removeUser(req.params.username)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
}

function getUserCommentVotes(req, res, next) {
  selectCommentVotesByUser(req.params.username)
    .then((commentVotes) => {
      res.status(200).send({ commentVotes });
    })
    .catch(next);
}

function getUserArticleVotes(req, res, next) {
  selectArticleVotesByUser(req.params.username)
    .then((articleVotes) => {
      res.status(200).send({ articleVotes });
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUser,
  postUser,
  deleteUser,
  getUserCommentVotes,
  getUserArticleVotes,
};
