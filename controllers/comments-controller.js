const { selectComments } = require("../models/comments-model");

function getComments(req, res, next) {
  selectComments(req.params.article_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getComments };
