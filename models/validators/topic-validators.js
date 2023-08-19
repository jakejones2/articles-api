function validateTopic(body) {
  if (typeof body.description !== "string" || typeof body.slug !== "string") {
    return Promise.reject({
      status: 400,
      msg: 'Request body must be valid JSON and must include keys of "description" and "slug" of type string.',
    });
  } else return Promise.resolve();
}

module.exports = { validateTopic };
