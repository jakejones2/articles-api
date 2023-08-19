const endpoints = require("../../endpoints.js");

function getApi(_, res) {
  res.status(200).send(endpoints);
}

module.exports = { getApi };
