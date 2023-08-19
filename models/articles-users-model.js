const db = require("../db/connection");
const format = require("pg-format");
const { selectUser } = require("./users-model");

function checkNoUserArticleVotes(username, article_id) {
  return selectUser(username)
    .then((user) => {
      return db.query(
        "SELECT * FROM users_articles_votes WHERE username = $1 AND article_id = $2",
        [username, article_id]
      );
    })
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.resolve();
      }
      return Promise.reject({
        status: 403,
        msg: "You have already voted for this article",
      });
    });
}

function insertUserArticleVotes(username, article_id) {
  const queryString =
    "INSERT INTO users_articles_votes (username, article_id) VALUES %L;";
  const query = format(queryString, [[username, article_id]]);
  return db.query(query);
}

module.exports = { checkNoUserArticleVotes, insertUserArticleVotes };
