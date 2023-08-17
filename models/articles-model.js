const db = require("../db/connection");
const format = require("pg-format");

function selectArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
}

function selectArticles({
  topic,
  sort_by = "created_at",
  order = "DESC",
  limit = 10,
  p = 1,
}) {
  let queryString = `
    SELECT       
      articles.author, 
      articles.title, 
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      CAST(COUNT(*) OVER() AS INT) AS total_count,
      CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles 
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id`;
  if (topic) queryString += ` WHERE articles.topic = '${topic}'`;
  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  queryString += ` LIMIT ${limit} OFFSET ${(p - 1) * limit};`;
  return db.query(queryString).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Articles not found" });
    } else {
      const totalCount = rows[0].total_count;
      const articles = rows.map((row) => {
        delete row.total_count;
        return row;
      });
      return { articles, totalCount };
    }
  });
}

function selectArticleAndCommentCountById(article_id) {
  let queryString = `
    SELECT       
      articles.author, 
      articles.title,
      articles.body, 
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles 
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ORDER BY articles.article_id;`;
  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows[0];
  });
}

function updateArticleById(article_id, increase) {
  if (typeof increase !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid PATCH body" });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [increase, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
}

function insertArticle(body) {
  const values = [body.title, body.topic, body.author, body.body, 0];
  let queryString = `INSERT INTO articles (title, topic, author, body, votes`;
  if (body.article_img_url) {
    values.push(body.article_img_url);
    queryString += `, article_img_url`;
  }
  queryString += `) VALUES %L RETURNING article_id;`;
  const formattedQuery = format(queryString, [values]);
  return db.query(formattedQuery).then(({ rows }) => {
    return rows[0].article_id;
  });
}

function removeArticle(article_id) {
  return db
    .query("DELETE FROM articles WHERE article_id = $1", [article_id])
    .then(({ rowCount }) => {
      if (!rowCount) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
}

module.exports = {
  selectArticleById,
  updateArticleById,
  selectArticles,
  insertArticle,
  selectArticleAndCommentCountById,
  removeArticle,
};
