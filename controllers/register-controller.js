const { selectUser, insertUser } = require("../models/users-model");

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

module.exports = { postUser };
