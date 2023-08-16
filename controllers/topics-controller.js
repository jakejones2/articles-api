const { selectTopics, insertTopic } = require("../models/topics-model");
const { validateTopic } = require("../models/validators/topic-validators");

function getTopics(_, res, next) {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function postTopic(req, res, next) {
  validateTopic(req.body)
    .then(() => {
      return insertTopic(req.body);
    })
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
}

module.exports = { getTopics, postTopic };
