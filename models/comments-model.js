const db = require("../db/connection");
const format = require("pg-format");

function selectComments(article_id) {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { selectComments };
