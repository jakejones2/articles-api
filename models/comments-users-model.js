const db = require("../db/connection");
const format = require("pg-format");
const { selectUser } = require("./users-model");

function checkNoUserCommentVotes(username, comment_id) {
  return selectUser(username)
    .then(() => {
      return db.query(
        "SELECT * FROM users_comments_votes WHERE username = $1 AND comment_id = $2",
        [username, comment_id]
      );
    })
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.resolve();
      }
      return Promise.reject({
        status: 403,
        msg: "You have already voted for this comment",
      });
    });
}

function insertUserCommentVotes(username, comment_id) {
  const queryString =
    "INSERT INTO users_comments_votes (username, comment_id) VALUES %L;";
  const query = format(queryString, [[username, comment_id]]);
  return db.query(query);
}

module.exports = { checkNoUserCommentVotes, insertUserCommentVotes };
