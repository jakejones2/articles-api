const db = require("../db/connection");
const format = require("pg-format");

function selectComments(article_id, { limit = 10, p = 1 }) {
  return db
    .query(
      `
      SELECT 
        *, 
        CAST(COUNT(*) OVER() AS  INT) AS total_count 
      FROM comments 
      WHERE article_id = $1
      ORDER BY created_at DESC 
      LIMIT $2 
      OFFSET $3
      `,
      [article_id, limit, (p - 1) * limit]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "No comments found" });
      }
      const totalCount = rows[0].total_count;
      const comments = rows.map((row) => {
        delete row.total_count;
        return row;
      });
      return { comments, totalCount };
    });
}

function selectComment(comment_id) {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows[0];
    });
}

function insertComment(article_id, body) {
  const comments = [[body.body, body.username, article_id, new Date()]];
  const queryString = format(
    `
    INSERT INTO comments
      (body, author, article_id, created_at)
    VALUES %L
    RETURNING *;
    `,
    comments
  );
  return db.query(queryString).then(({ rows }) => {
    return rows[0];
  });
}

function removeComment(comment_id) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return Promise.resolve();
    });
}

function selectCommentsByAuthor(author) {
  return db
    .query(
      "SELECT * FROM comments WHERE author = $1 ORDER BY created_at DESC;",
      [author]
    )
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = {
  selectComments,
  selectComment,
  insertComment,
  removeComment,
  selectCommentsByAuthor,
};
