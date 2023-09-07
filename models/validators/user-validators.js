function validatePostUser({ username, password, name, avatar_url }) {
  if (!username || !password || !name) {
    return Promise.reject({
      status: 400,
      msg: "Body missing username, password or name",
    });
  }
  if (
    !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
      avatar_url
    ) &&
    avatar_url
  ) {
    return Promise.reject({ status: 400, msg: "Invalid image url" });
  }
  return Promise.resolve();
}

module.exports = { validatePostUser };
