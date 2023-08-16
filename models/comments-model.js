const db = require("../db/connection");
const format = require("pg-format");

function selectComments(article_id, { limit = 10, p = 1 }) {
  return db
    .query(
      `SELECT 
        *, 
        CAST(COUNT(*) OVER() AS  INT) AS total_count 
      FROM comments 
      WHERE article_id = $1
      ORDER BY comment_id ASC 
      LIMIT $2 
      OFFSET $3`,
      [article_id, limit, (p - 1) * limit]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "No comments found" });
      } else {
        const totalCount = rows[0].total_count;
        const comments = rows.map((row) => {
          delete row.total_count;
          return row;
        });
        return { comments, totalCount };
      }
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

function removeComment(comment_id) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      } else {
        return Promise.resolve();
      }
    });
}

function updateComment(increase, comment_id) {
  if (typeof increase !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
      [increase, comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows[0];
    });
}
module.exports = {
  selectComments,
  insertComment,
  removeComment,
  updateComment,
};
