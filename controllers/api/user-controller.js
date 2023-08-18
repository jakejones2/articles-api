const {
  selectUsers,
  selectUser,
  insertUser,
  removeUser,
} = require("../../models/users-model");
const { validatePostUser } = require("../../models/validators/user-validators");

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
    .then((username) => {
      return selectUser(username);
    })
    .then(() => {
      res.status(409).send({ msg: "Username already exists" });
    })
    .catch(({ status, msg }) => {
      if (status === 404) {
        insertUser(req.body).then((user) => {
          res.status(201).send({ user });
        });
      } else {
        res.status(status).send({ msg });
      }
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

// const { username, password } = req.body;
// if (!username || !password) {
//   return res.status(400).send({ msg: "Username and password required" });
// }
