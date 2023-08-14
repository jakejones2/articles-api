const db = require("../db/connection");
const format = require("pg-format");

function selectArticles() {
  return db.query("SELECT * FROM articles").then(({ rows }) => {
    return rows;
  });
}

module.exports = { selectArticles };
