const db = require("../db/connection");
const format = require("pg-format");

function selectComments(article_id) {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows;
    });
}

module.exports = { selectComments };
