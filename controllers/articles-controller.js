const {
  selectArticleById,
  selectArticles,
  updateArticleById,
} = require("../models/articles-model");

const { selectTopics } = require("../models/topics-model");

function getArticleById(req, res, next) {
  selectArticleById(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  selectTopics()
    .then((topics) => {
      return Promise.resolve(
        topics.map((topic) => {
          return topic.slug;
        })
      );
    })
    .then((topicList) => {
      const topic = req.query.topic;
      const sort_by = req.query.sort_by ? req.query.sort_by : "created_at";
      const order = req.query.order ? req.query.order.toUpperCase() : "DESC";
      const validSortBy = [
        "article_id",
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "votes",
        "comment_count",
        "article_img_url",
      ];
      if (
        (!topicList.includes(topic) && topic) ||
        !validSortBy.includes(sort_by) ||
        !["ASC", "DESC"].includes(order)
      ) {
        return Promise.reject({ status: 404, msg: "Query not available" });
      } else {
        return selectArticles(topic, sort_by, order);
      }
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function patchArticleById(req, res, next) {
  updateArticleById(req.params.article_id, req.body.inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

module.exports = { getArticles, getArticleById, patchArticleById };
