const db = require("../db/connection");
const format = require("pg-format");

function selectArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article cannot be found" });
      }
      return rows[0];
    });
}

function selectArticles() {
  return db.query("SELECT * FROM articles").then(({ rows }) => {
    return rows;
  });
}

module.exports = { selectArticleById, selectArticles };
