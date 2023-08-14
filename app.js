const express = require("express");
const app = express();

const { finalErrorHandler } = require("./controllers/error-handlers");
const { getTopics } = require("./controllers/topics-controller");

module.exports = app;

app.get("/api/topics", getTopics);

app.use(finalErrorHandler);
