const {
  selectUserByRefreshToken,
  deleteUserRefreshToken,
} = require("../models/users-model");

function logoutController(req, res, next) {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.sendStatus(204);
  else {
    const refreshToken = cookies.jwt;
    return selectUserByRefreshToken(refreshToken)
      .then((user) => {
        return deleteUserRefreshToken(user);
      })
      .then(() => {
        res.clearCookie("jwt", {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: "None",
          secure: true,
        });
        res.sendStatus(204);
      })
      .catch(() => {
        res.clearCookie("jwt", {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          // maxAge redundant?
          sameSite: "None",
          secure: true,
        });
        res.sendStatus(204);
      });
  }
}

module.exports = { logoutController };
