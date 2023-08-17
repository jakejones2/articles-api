const express = require("express");

//controllers
const notFound = require("./controllers/not-found");
const {
  finalErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
} = require("./controllers/error-handlers");

// routers
const apiRouter = require("./routes/api-router");
const registerRouter = require("./routes/register-router");
const authRouter = require("./routes/auth-router");

const app = express();

app.use(express.json());
app.use("/register", registerRouter);
app.use("/auth", authRouter);
app.use("/api", apiRouter);
app.use(notFound);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(finalErrorHandler);

module.exports = app;
