const { selectUsers, selectUser } = require("../models/users-model");

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

module.exports = { getUsers, getUser };
