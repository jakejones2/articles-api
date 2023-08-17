const { selectUserByRefreshToken } = require("../models/users-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function handleRefreshToken(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.sendStatus(401);
  else {
    const refreshToken = cookies.jwt;
    return selectUserByRefreshToken(refreshToken)
      .then((user) => {
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
            if (err || user.username !== decoded.username) {
              return res.sendStatus(403);
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
        res.sendStatus(403);
      });
  }
}

module.exports = { handleRefreshToken };
