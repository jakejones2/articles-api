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
        expect(comments.length).toBe(11);
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

describe("POST comments", () => {
  test("receive 201 when POST /api/articles/:article_id/comments ", () => {
    const testComment = {
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201);
  });
});
