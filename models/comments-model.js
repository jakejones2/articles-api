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

function insertComment(article_id, body, users) {
  if (typeof body !== "object" || typeof body.body !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else if (!users.includes(body.username)) {
    return Promise.reject({ status: 404, msg: "User not found" });
  } else {
    const comments = [[body.body, body.username, article_id, 0, new Date()]];
    const queryString = format(
      `
    INSERT INTO comments
      (body, author, article_id, votes, created_at)
    VALUES %L
    RETURNING *;
    `,
      comments
    );
    return db.query(queryString).then(({ rows }) => {
      return rows[0];
    });
  }
}

module.exports = { selectComments, insertComment };
