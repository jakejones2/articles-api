const jwt = require("jsonwebtoken");

const { selectUserByRefreshToken } = require("../models/users-model");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

function refreshController(req, res) {
  if (!req.cookies?.jwt) {
    return res.status(401).send({ msg: "Refresh token not found" });
  }
  const refreshToken = req.cookies.jwt;
  return selectUserByRefreshToken(refreshToken)
    .then((user) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || user.username !== decoded.username) {
            return res.status(403).send({
              msg: "Invalid refresh token. Request a new one at /auth.",
            });
          }
          const accessToken = jwt.sign(
            { username: decoded.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "300s" }
          );
          res.status(200).send({ accessToken });
        }
      );
    })
    .catch(() => {
      return res
        .status(403)
        .send({ msg: "Invalid refresh token. Request a new one at /auth." });
    });
}

module.exports = { refreshController };
