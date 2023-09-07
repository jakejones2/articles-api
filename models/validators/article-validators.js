function validatePatchArticle(increase) {
  if (typeof increase !== "number") {
    return Promise.reject({
      status: 400,
      msg: 'Request body must be valid JSON and must include a key of "inc_votes" with value of type number',
    });
  } else if (Math.abs(increase) > 5) {
    return Promise.reject({
      status: 400,
      msg: "You cannot increase or decrease an article's votes by more than 5.",
    });
  }
  return Promise.resolve();
}

function validatePostArticle(body) {
  if (
    typeof body.title !== "string" ||
    typeof body.body !== "string" ||
    typeof body.topic !== "string" ||
    typeof body.author !== "string"
  ) {
    return Promise.reject({
      status: 400,
      msg: 'Request body must be valid json with keys of "title", "body", "topic", and "author". All values should be strings.',
    });
  } else if (body.article_img_url) {
    if (
      !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
        body.article_img_url
      )
    ) {
      return Promise.reject({ status: 400, msg: "Invalid image url" });
    }
  }
  return Promise.resolve();
}

function validateArticleQueries({ sort_by = "created_at", order = "DESC" }) {
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
    "article_img_url",
  ];
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid "sort_by" query. Must be a key from GET articles/:article_id, e.g. "comment_count".',
    });
  } else if (!["ASC", "DESC"].includes(order.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid "order" query. Must be "asc" or "desc".',
    });
  }
  return Promise.resolve();
}

function validatePaginationQueries({ limit = 10, p = 1 }) {
  if (!/^[1-9]\d*$/.test(limit)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid "limit" query, must be an integer greater than 1',
    });
  } else if (!/^[1-9]\d*$/.test(p)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid "p" query, must be an integer greater than 1',
    });
  }
  return Promise.resolve();
}

module.exports = {
  validatePostArticle,
  validateArticleQueries,
  validatePaginationQueries,
  validatePatchArticle,
};
