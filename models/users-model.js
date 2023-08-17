const db = require("../db/connection");
const format = require("pg-format");

function selectUsernames() {
  return db.query("SELECT username FROM users").then(({ rows }) => {
    return rows;
  });
}

function selectUsers() {
  return db
    .query("SELECT username, name, avatar_url FROM users")
    .then(({ rows }) => {
      return rows;
    });
}

function selectUser(username) {
  return db
    .query("SELECT username, name, avatar_url FROM users WHERE username = $1", [
      username,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return rows[0];
    });
}

module.exports = { selectUsernames, selectUsers, selectUser };
