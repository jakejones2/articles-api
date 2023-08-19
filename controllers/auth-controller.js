const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  selectUserAuth,
  updateUserRefreshToken,
} = require("../models/users-model");

require("dotenv").config();

function authUser(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ msg: "Username and password required" });
  }
  selectUserAuth(username)
    .then((user) => {
      return bcrypt.compare(password, user.password_hash);
    })
    .then((match) => {
      if (!match) {
        return Promise.reject({ status: 401, msg: "Incorrect password" });
      }
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
        secure: false, // true in production, false in dev
      });
      const accessToken = jwt.sign(
        { username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "300s" }
      );
      res.status(200).send({ accessToken });
    })
    .catch(next);
}

module.exports = { authUser };
