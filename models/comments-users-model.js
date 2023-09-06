const db = require("../db/connection");
const format = require("pg-format");
const { selectUser } = require("./users-model");

function deleteCurrentUserCommentVote(username, comment_id) {
  return selectUser(username).then(() => {
    return db.query(
      "DELETE FROM users_comments_votes WHERE username = $1 AND comment_id = $2",
      [username, comment_id]
    );
  });
}

function insertUserCommentVotes(username, comment_id, votes) {
  const queryString =
    "INSERT INTO users_comments_votes (username, comment_id, votes) VALUES %L;";
  const query = format(queryString, [[username, comment_id, votes]]);
  return db.query(query);
}

function selectVotesByComment(comment_id) {
  return db.query(
    "SELECT SUM(votes) AS votes FROM users_comments_votes WHERE comment_id = $1",
    [comment_id]
  );
}

function selectCommentVotes() {
  return db.query(
    "SELECT comment_id, SUM(votes) AS VOTES FROM users_comments_votes GROUP BY comment_id;"
  );
}

function selectCommentVotesByUser(username) {
  return db
    .query("SELECT * FROM users_comments_votes WHERE username = $1", [username])
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = {
  deleteCurrentUserCommentVote,
  insertUserCommentVotes,
  selectCommentVotes,
  selectVotesByComment,
  selectCommentVotesByUser,
};
