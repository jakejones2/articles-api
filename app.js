const express = require("express");
const cookieParser = require("cookie-parser");

//controllers
const notFound = require("./middleware/not-found");
const {
  finalErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
} = require("./controllers/error-handlers");

// routers
const apiRouter = require("./routes/api-router");
const authRouter = require("./routes/auth-router");
const refreshRouter = require("./routes/refresh-router");
const logoutRouter = require("./routes/logout-router");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/refresh", refreshRouter);
app.use("/logout", logoutRouter);
app.use("/auth", authRouter);
app.use("/api", apiRouter);

app.use(notFound);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(finalErrorHandler);

module.exports = app;
