const { insertComments } = require("../models/comments-model");

function createComments(req, res, next) {
  res.status(201).send();
}

module.exports = { createComments };
