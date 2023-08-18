const { selectUser } = require("../models/users-model");

function checkUser(req, res, next) {
  selectUser(req.params.username)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(404).send({ msg: "User not found" });
    });
}

module.exports = { checkUser };
