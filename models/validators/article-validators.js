const isUrlHttp = require("is-url-http");

function validatePostArticle(body) {
  if (
    typeof body.title !== "string" ||
    typeof body.body !== "string" ||
    typeof body.topic !== "string" ||
    typeof body.author !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else if (body.article_img_url) {
    if (!isUrlHttp(body.article_img_url)) {
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
  if (
    !validSortBy.includes(sort_by) ||
    !["ASC", "DESC"].includes(order.toUpperCase())
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else return Promise.resolve();
}

function validatePaginationQueries({ limit = 10, p = 1 }) {
  if (!/^[1-9]\d*$/.test(limit) || !/^[1-9]\d*$/.test(p)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else return Promise.resolve();
}

module.exports = {
  validatePostArticle,
  validateArticleQueries,
  validatePaginationQueries,
};
