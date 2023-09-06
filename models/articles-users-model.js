const db = require("../db/connection");
const format = require("pg-format");
const { selectUser } = require("./users-model");

function deleteCurrentUserArticleVote(username, article_id) {
  return selectUser(username).then(() => {
    return db.query(
      "DELETE FROM users_articles_votes WHERE username = $1 AND article_id = $2",
      [username, article_id]
    );
  });
}

function insertUserArticleVote(username, article_id, votes) {
  const queryString =
    "INSERT INTO users_articles_votes (username, article_id, votes) VALUES %L;";
  const query = format(queryString, [[username, article_id, votes]]);
  return db.query(query);
}

function selectVotesByArticle(article_id) {
  return db.query(
    "SELECT SUM(votes) AS votes FROM users_articles_votes WHERE article_id = $1",
    [article_id]
  );
}

function selectArticleVotes() {
  return db.query(
    "SELECT article_id, SUM(votes) AS VOTES FROM users_articles_votes GROUP BY article_id;"
  );
}

function selectArticleVotesByUser(username) {
  return db
    .query("SELECT * FROM users_articles_votes WHERE username = $1", [username])
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = {
  deleteCurrentUserArticleVote,
  insertUserArticleVote,
  selectVotesByArticle,
  selectArticleVotes,
  selectArticleVotesByUser,
};
