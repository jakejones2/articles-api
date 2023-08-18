const bcrypt = require("bcrypt");
const {
  selectUserAuth,
  updateUserRefreshToken,
} = require("../models/users-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({ msg: "Username and password required" });
  } else {
    selectUserAuth(username)
      .then((user) => {
        return bcrypt.compare(password, user.password_hash);
      })
      .then((match) => {
        if (!match) return Promise.reject();
        const refreshToken = jwt.sign(
          { username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        return updateUserRefreshToken(refreshToken, username);
      })
      .then((refreshToken) => {
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
          secure: false, // true in production
        });
        const accessToken = jwt.sign(
          { username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "300s" }
        );
        res.status(200).send({ accessToken });
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).send({ msg: err.msg });
        } else res.sendStatus(401);
      });
  }
}

module.exports = { authUser };
