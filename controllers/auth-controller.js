const bcrypt = require("bcrypt");
const { selectUserAuth, addRefreshToken } = require("../models/users-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authUser(req, res, next) {
  let accessToken;
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
          accessToken = jwt.sign(
            { username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "300s" }
          );
          const refreshToken = jwt.sign(
            { username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
          );
          return addRefreshToken(refreshToken, username);
        } else return Promise.reject();
      })
      .then((refreshToken) => {
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).send({ accessToken });
      })
      .catch(() => {
        res.sendStatus(401);
      });
  }
}

module.exports = { authUser };
