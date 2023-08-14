const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET comments", () => {
  test("GET 200 from /api/articles/:article_id/comments ", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("GET comments from /api/articles/:article_id/comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length > 0).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
        });
        expect(comments[0]).toMatchObject({
          comment_id: 2,
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 14,
          author: "butter_bridge",
          article_id: 1,
          created_at: "2020-10-31T03:03:00.000Z",
        });
      });
  });
  test("receive 404 when article_id out of range", () => {
    return request(app)
      .get("/api/articles/0/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article cannot be found");
      });
  });
  test("receive 400 when article_id malformed", () => {
    return request(app)
      .get("/api/articles/frog/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});
