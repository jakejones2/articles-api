const express = require("express");
const app = express();

const {
  finalErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
} = require("./controllers/error-handlers");
const { getTopics } = require("./controllers/topics-controller");
const { getApi } = require("./controllers/api-controller");
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("./controllers/articles-controller");
const { getComments } = require("./controllers/comments-controller");

module.exports = app;

app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.get("/api/topics", getTopics);

app.use(express.json());

app.patch("/api/articles/:article_id", patchArticleById);

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(finalErrorHandler);
