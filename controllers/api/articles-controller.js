const {
  selectArticleById,
  insertArticle,
  selectArticles,
  removeArticle,
} = require("../../models/articles-model");

const {
  validateArticleQueries,
  validatePostArticle,
  validatePaginationQueries,
  validatePatchArticle,
} = require("../../models/validators/article-validators");

const { selectTopic } = require("../../models/topics-model");
const { selectUser } = require("../../models/users-model");
const {
  deleteCurrentUserArticleVote,
  insertUserArticleVote,
  selectVotesByArticle,
  selectArticleVotes,
} = require("../../models/articles-users-model");

function getArticleById(req, res, next) {
  let article;
  selectArticleById(req.params.article_id)
    .then((articleData) => {
      article = articleData;
      return selectVotesByArticle(articleData.article_id);
    })
    .then(({ rows }) => {
      article.votes = rows[0].votes ? +rows[0].votes : 0;
      res.status(200).send({ article });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  let sortByVotes = false;
  let limit = req.query.limit;
  let page = req.query.p;
  let order = req.query.order;
  const promises = [
    validateArticleQueries(req.query),
    validatePaginationQueries(req.query),
  ];
  const { topic, author, sort_by } = req.query;
  if (sort_by === "votes") {
    req.query.sort_by = "created_at";
    sortByVotes = true;
  }
  if (topic) promises.push(selectTopic(topic));
  if (author) promises.push(selectUser(author));
  let articleData;
  Promise.all(promises)
    .then(() => {
      if (sortByVotes) {
        // get all the articles
        req.query.limit = 10000;
        req.query.p = 1;
      }
      return selectArticles(req.query);
    })
    .then((data) => {
      articleData = data;
      return selectArticleVotes();
    })
    .then(({ rows }) => {
      updateArticlesWithVoteData(articleData, rows);
      if (sortByVotes) {
        manuallySort(articleData, "votes", order);
        manuallyPaginate(articleData, limit, page);
      }
      res.status(200).send(articleData);
    })
    .catch(next);
}

function patchArticleById(req, res, next) {
  validatePatchArticle(req.body.inc_votes)
    .then(() => {
      return deleteCurrentUserArticleVote(req.user, req.params.article_id);
    })
    .then(() => {
      return insertUserArticleVote(
        req.user,
        req.params.article_id,
        req.body.inc_votes
      );
    })
    .then(() => {
      return selectArticleById(req.params.article_id);
    })
    .then((articleData) => {
      article = articleData;
      return selectVotesByArticle(articleData.article_id);
    })
    .then(({ rows }) => {
      article.votes = rows[0].votes ? +rows[0].votes : 0;
      res.status(200).send({ article });
    })
    .catch(next);
}

function postArticles(req, res, next) {
  validatePostArticle(req.body)
    .then(() => {
      return selectTopic(req.body.topic);
    })
    .then(() => {
      return selectUser(req.body.author);
    })
    .then((user) => {
      if (user.username !== req.user) {
        return Promise.reject({
          status: 403,
          msg: "Authenticated user does not match article author",
        });
      } else return insertArticle(req.body);
    })
    .then((article) => {
      return selectArticleById(article.article_id);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
}

function deleteArticleById(req, res, next) {
  selectArticleById(req.params.article_id)
    .then((article) => {
      if (article.author !== req.user) {
        return Promise.reject({
          status: 403,
          msg: "Authenticated user does not match article author",
        });
      } else return Promise.resolve();
    })
    .then(() => {
      return removeArticle(req.params.article_id);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
}

function updateArticlesWithVoteData({ articles }, voteData) {
  for (const article of articles) {
    const matchingVoteRow = voteData.find(
      (row) => row.article_id === article.article_id
    );
    article.votes = +matchingVoteRow?.votes || 0;
  }
}

function manuallyPaginate(articleData, limit = 10, page = 1) {
  articleData.articles = articleData.articles.slice(
    (page - 1) * limit,
    page * limit
  );
}

function manuallySort({ articles }, field, order = "desc") {
  articles.sort((a, b) => {
    return order.toLowerCase() === "desc"
      ? b[field] - a[field]
      : a[field] - b[field];
  });
}

module.exports = {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticles,
  deleteArticleById,
};
