const express = require("express");
const notFound = require("./controllers/not-found");
const apiRouter = require("./routes/api-router");
const {
  finalErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
} = require("./controllers/error-handlers");

const app = express();

app.use(express.json());
app.use("/api", apiRouter);
app.use(notFound);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(finalErrorHandler);

module.exports = app;
