const endpoints = require("../endpoints.js");

function getApi(req, res, next) {
  res.status(200).send(endpoints);
}

module.exports = { getApi };
