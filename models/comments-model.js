const db = require("../db/connection");
const format = require("pg-format");
const {
  createRef,
  formatComments,
  convertTimestampToDate,
} = require("../db/seeds/utils");

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
  const commentList = [[body.body, body.username, article_id, 0, new Date()]];
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
}

module.exports = { selectComments, insertComment };
