const bcrypt = require("bcrypt");
const { selectUserAuth } = require("../models/users-model");

function authUser(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({ msg: "Username and password required" });
  } else {
    selectUserAuth(username)
      .then((user) => {
        return bcrypt.compare(password, user.password_hash);
      })
      .then((match) => {
        if (match) {
          // create JWTs token - normal and refresh.
          res.status(200).send({ msg: `${username} is logged in!` });
        } else return Promise.reject();
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(401);
      });
  }
}

module.exports = { authUser };
