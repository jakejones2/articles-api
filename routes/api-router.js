const apiRouter = require("express").Router();
const usersRouter = require("./users-router");
const topicsRouter = require("./topics-router");
const commentsRouter = require("./comments-router");
const articlesRouter = require("./articles-router");
const { getApi } = require("../controllers/api/api-controller");

apiRouter.get("/", getApi);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
