const format = require("pg-format");
const db = require("../connection");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("./utils");

const seed = ({
  topicData,
  userData,
  articleData,
  commentData,
  userCommentsData,
  userArticlesData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS users_comments_votes;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users_articles_votes;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS comments;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then(() => {
      const topicsTablePromise = db.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
      );`);

      const usersTablePromise = db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR DEFAULT 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
        password_hash VARCHAR NOT NULL,
        refresh_token VARCHAR
      );`);

      return Promise.all([topicsTablePromise, usersTablePromise]);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
        body VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        article_id INT REFERENCES articles(article_id) ON DELETE cascade NOT NULL,
        author VARCHAR REFERENCES users(username) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users_articles_votes (
        username VARCHAR REFERENCES users(username),
        article_id INT REFERENCES articles(article_id),
        votes INT DEFAULT 1 NOT NULL, 
        CONSTRAINT users_articles_votes_pk PRIMARY KEY(username,article_id)
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users_comments_votes (
        username VARCHAR REFERENCES users(username),
        comment_id INT REFERENCES comments(comment_id),
        votes INT DEFAULT 1 NOT NULL, 
        CONSTRAINT users_comments_votes_pk PRIMARY KEY(username,comment_id)
      );`);
    })
    .then(() => {
      const insertTopicsQueryStr = format(
        "INSERT INTO topics (slug, description) VALUES %L;",
        topicData.map(({ slug, description }) => [slug, description])
      );
      const topicsPromise = db.query(insertTopicsQueryStr);
      const insertUsersQueryStr = format(
        "INSERT INTO users ( username, name, avatar_url, password_hash) VALUES %L;",
        userData.map(({ username, name, avatar_url, password_hash }) => [
          username,
          name,
          avatar_url,
          password_hash,
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);
      return Promise.all([topicsPromise, usersPromise]);
    })
    .then(() => {
      const formattedArticleData = articleData.map(convertTimestampToDate);
      const insertArticlesQueryStr = format(
        "INSERT INTO articles (title, topic, author, body, created_at, article_img_url) VALUES %L RETURNING *;",
        formattedArticleData.map(
          ({ title, topic, author, body, created_at, article_img_url }) => [
            title,
            topic,
            author,
            body,
            created_at,
            article_img_url,
          ]
        )
      );
      return db.query(insertArticlesQueryStr);
    })
    .then(({ rows: articleRows }) => {
      const articleIdLookup = createRef(articleRows, "title", "article_id");
      const formattedCommentData = formatComments(commentData, articleIdLookup);
      const insertCommentsQueryStr = format(
        "INSERT INTO comments (body, author, article_id, created_at) VALUES %L;",
        formattedCommentData.map(({ body, author, article_id, created_at }) => [
          body,
          author,
          article_id,
          created_at,
        ])
      );
      return db.query(insertCommentsQueryStr);
    })
    .then(() => {
      const insertUserCommentsQueryStr = format(
        "INSERT INTO users_comments_votes (username, comment_id, votes) VALUES %L;",
        userCommentsData.map(({ username, comment_id, votes }) => {
          return [username, comment_id, votes];
        })
      );
      return db.query(insertUserCommentsQueryStr);
    })
    .then(() => {
      const insertUserArticlesQueryStr = format(
        "INSERT INTO users_articles_votes (username, article_id, votes) VALUES %L;",
        userArticlesData.map(({ username, article_id, votes }) => {
          return [username, article_id, votes];
        })
      );
      return db.query(insertUserArticlesQueryStr);
    })
    .catch((err) => console.log(err));
};

module.exports = seed;
