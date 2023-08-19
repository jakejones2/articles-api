const db = require("../db/connection");
const format = require("pg-format");

function selectTopics() {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
}

function selectTopic(topic) {
  return db
    .query("SELECT * FROM topics WHERE slug = $1", [topic])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Topic not found" });
      }
      return rows[0];
    });
}

function insertTopic(topic) {
  const queryString = format(
    "INSERT INTO topics (slug, description) VALUES %L RETURNING *",
    [[topic.slug, topic.description]]
  );
  return db.query(queryString).then(({ rows }) => {
    return rows[0];
  });
}

module.exports = { selectTopics, selectTopic, insertTopic };
