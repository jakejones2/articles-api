const {
  selectUserByRefreshToken,
  deleteUserRefreshToken,
} = require("../models/users-model");

function logoutController(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.sendStatus(204);
  else {
    const refreshToken = cookies.jwt;
    selectUserByRefreshToken(refreshToken)
      .then((user) => {
        return deleteUserRefreshToken(user);
      })
      .then(() => {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: false, // true in production
        });
        res.sendStatus(204);
      })
      .catch(() => {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: false, // true in production
        });
        res.sendStatus(204);
      });
  }
}

module.exports = { logoutController };
