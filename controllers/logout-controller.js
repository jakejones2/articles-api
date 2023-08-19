const {
  selectUserByRefreshToken,
  updateUserRefreshToken,
} = require("../models/users-model");

function logoutController(req, res) {
  if (!req.cookies?.jwt) return res.sendStatus(204);
  const refreshToken = req.cookies.jwt;
  selectUserByRefreshToken(refreshToken)
    .then((user) => {
      return updateUserRefreshToken("NULL", user.username);
    })
    .then(() => {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: false, // true in production, false in dev
      });
      res.sendStatus(204);
    })
    .catch(() => {
      /* if refresh token cannot be found in db, 
      or cookie cannot be found, user not logged in */
      res.sendStatus(204);
    });
}

module.exports = { logoutController };
