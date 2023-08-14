const db = require("../db/connection");
const format = require("pg-format");

function selectComments(article_id) {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article cannot be found" });
      }
      return rows;
    });
}

function insertComment(article_id, body) {
  return db
    .query("SELECT username FROM users")
    .then(({ rows }) => {
      const users = rows.map((row) => row.username);
      if (typeof body !== "object" || typeof body.body !== "string") {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      } else if (!users.includes(body.username)) {
        return Promise.reject({ status: 400, msg: "User not registered" });
      } else return Promise.resolve();
    })
    .then(() => {
      const commentList = [
        [body.body, body.username, article_id, 0, new Date()],
      ];
      const queryString = format(
        `
      INSERT INTO comments
        (body, author, article_id, votes, created_at)
      VALUES %L
      RETURNING *;
      `,
        commentList
      );
      return db.query(queryString).then(({ rows }) => {
        return rows[0];
      });
    });
}

module.exports = { selectComments, insertComment };
