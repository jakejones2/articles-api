const express = require("express");
const app = express();

const {
  finalErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
} = require("./controllers/error-handlers");
const { getTopics } = require("./controllers/topics-controller");
const { getApi } = require("./controllers/api-controller");
const { getArticleById } = require("./controllers/articles-controller");
const {
  getComments,
  createComments,
} = require("./controllers/comments-controller");

module.exports = app;

app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);
app.get("/api/topics", getTopics);

app.post("/api/articles/:article_id/comments", createComments);

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(finalErrorHandler);
