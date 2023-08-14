const express = require("express");
const app = express();

const { finalErrorHandler } = require("./controllers/error-handlers");
const { getTopics } = require("./controllers/topics-controller");
const { getArticleById } = require("./controllers/article-controller");

module.exports = app;

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/topics", getTopics);

app.use(finalErrorHandler);
