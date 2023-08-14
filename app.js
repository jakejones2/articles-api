const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics-controller");

module.exports = app;

app.get("/api/topics", getTopics);
