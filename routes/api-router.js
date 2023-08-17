const apiRouter = require("express").Router();
const usersRouter = require("./api/users-router");
const topicsRouter = require("./api/topics-router");
const commentsRouter = require("./api/comments-router");
const articlesRouter = require("./api/articles-router");
const { getApi } = require("../controllers/api/api-controller");

apiRouter.get("/", getApi);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
