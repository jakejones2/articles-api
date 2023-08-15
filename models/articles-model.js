const db = require("../db/connection");
const format = require("pg-format");

function selectArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
}

function validateArticleQueries(topicList, topic, sort_by, order) {
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
  if (!topicList.includes(topic) && topic) {
    return Promise.reject({ status: 404, msg: "Topic not available" });
  } else if (
    !validSortBy.includes(sort_by) ||
    !["ASC", "DESC"].includes(order)
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return selectArticles(topic, sort_by, order);
  }
}

function selectArticles(topic, sort_by, order) {
  let queryString = `
    SELECT       
      articles.author, 
      articles.title, 
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles 
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id`;
  if (topic) {
    queryString += ` WHERE articles.topic = '${topic}'`;
  }
  queryString += ` GROUP BY articles.article_id`;
  queryString += ` ORDER BY ${sort_by}`;
  queryString += ` ${order.toUpperCase()};`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
}

function updateArticleById(article_id, increase) {
  if (typeof increase !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid PATCH body" });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [increase, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
}

module.exports = {
  selectArticleById,
  updateArticleById,
  selectArticles,
  validateArticleQueries,
};
