const {
  selectUsers,
  selectUser,
  insertUser,
  removeUser,
} = require("../../models/users-model");

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
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({ msg: "Username and password required" });
  }
  selectUser(username)
    .then(() => {
      res.status(409).send({ msg: "Username already exists" });
    })
    .catch(() => {
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
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { getUsers, getUser, postUser, deleteUser };
