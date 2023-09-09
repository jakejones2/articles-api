function validatePostComment(body) {
  if (typeof body !== "object" || typeof body.body !== "string") {
    return Promise.reject({
      status: 400,
      msg: 'Request body must be valid json, and must include a key of "body" with a value of type string',
    });
  } else if (typeof body.username !== "string") {
    return Promise.reject({
      status: 400,
      msg: 'Request body must include a key of "username" of type string',
    });
  }
  return Promise.resolve();
}

function validatePatchComment(increase) {
  if (typeof increase !== "number") {
    return Promise.reject({
      status: 400,
      msg: 'Request body must be valid json and include a key of "inc_votes" of type number',
    });
  } else if (Math.abs(increase) > 5) {
    return Promise.reject({
      status: 400,
      msg: "You cannot increase or decrease a comment's votes by more than 5.",
    });
  }
  return Promise.resolve();
}

function validateCommentQueries({ sort_by = "created_at", order = "desc" }) {
  if (!["created_at", "votes"].includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: 'sort_by query only takes values of "votes" and "created_at"',
    });
  }
  if (!["ASC", "DESC"].includes(order.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid "order" query. Must be "asc" or "desc".',
    });
  }
  return Promise.resolve();
}

module.exports = {
  validatePostComment,
  validatePatchComment,
  validateCommentQueries,
};
