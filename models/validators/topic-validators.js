function validateTopic(body) {
  if (typeof body.description !== "string" || typeof body.slug !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else return Promise.resolve();
}

module.exports = { validateTopic };
