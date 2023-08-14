const db = require("../db/connection");
const format = require("pg-format");

function selectTopics() {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
}

module.exports = { selectTopics };
