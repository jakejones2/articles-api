const isUrlHttp = require("is-url-http");

function validatePostUser({ username, password, name, avatar_url }) {
  if (!username || !password || !name) {
    return Promise.reject({
      status: 400,
      msg: "Body missing username, password or name",
    });
  }
  if (!isUrlHttp(avatar_url) && avatar_url) {
    return Promise.reject({ status: 400, msg: "Invalid image url" });
  }
  return Promise.resolve(username);
}

module.exports = { validatePostUser };
