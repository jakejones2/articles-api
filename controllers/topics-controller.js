const { selectTopics } = require("../models/topics-model");

function getTopics(req, res, next) {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

module.exports = { getTopics };
