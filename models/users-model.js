const db = require("../db/connection");
const format = require("pg-format");
const bcrypt = require("bcrypt");

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
      } else return rows[0];
    });
}

function selectUserAuth(username) {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "User not found" });
      } else return rows[0];
    });
}

// sort out promises here...
function insertUser({ username, name, avatar_url, password }) {
  return bcrypt.hash(password, 10).then((hash) => {
    const data = [username, name, hash];
    let queryString = `INSERT INTO users (username, name, password_hash`;
    if (avatar_url) {
      data.push(avatar_url);
      queryString += `, avatar_url`;
    }
    queryString += `) VALUES %L RETURNING username, name, avatar_url;`;
    const query = format(queryString, [data]);
    return db.query(query).then(({ rows }) => {
      return rows[0];
    });
  });
}

function removeUser(username) {
  return db.query("DELETE FROM users WHERE username = $1;", [username]);
}

function updateUserRefreshToken(token, username) {
  return db
    .query(
      "UPDATE users SET refresh_token = $1 WHERE username = $2 RETURNING *;",
      [token, username]
    )
    .then(({ rows }) => {
      return rows[0].refresh_token;
    });
}

function selectUserByRefreshToken(token) {
  if (!token) {
    return Promise.reject();
  } else {
    return db
      .query(`SELECT username FROM users WHERE refresh_token = $1`, [token])
      .then(({ rows }) => {
        return rows[0];
      });
  }
}

function deleteUserRefreshToken(user) {
  return db.query(`UPDATE users SET refresh_token = '' WHERE username = $1`, [
    user,
  ]);
}

module.exports = {
  selectUsernames,
  selectUsers,
  selectUser,
  insertUser,
  removeUser,
  selectUserAuth,
  updateUserRefreshToken,
  selectUserByRefreshToken,
  deleteUserRefreshToken,
};
