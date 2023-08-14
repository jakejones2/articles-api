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

describe("GET articles/:article_id", () => {
  test("GET 200 from /articles/:article_id ", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("GETs first article from /articles/:article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GETs random article from /articles/:article_id", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 7,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          votes: 0,
          body: "I was hungry.",
          created_at: "2020-01-07T14:08:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("Out of range id produces 404 and message", () => {
    return request(app)
      .get("/api/articles/36")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
  test("Bad request produces a 400 and message", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("PATCH articles/:article_id", () => {
  test("PATCH 200 from /api/articles/:article_id", () => {
    const examplePatch = { inc_votes: 1 };
    return request(app).patch("/api/articles/1").send(examplePatch).expect(200);
  });
  test("PATCH returns updated article", () => {
    const examplePatch = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(examplePatch)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH returns updated article when inc_votes greater than 1", () => {
    const examplePatch = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/3")
      .send(examplePatch)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 50,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH returns updated article when inc_votes is negative", () => {
    const examplePatch = { inc_votes: -1000 };
    return request(app)
      .patch("/api/articles/5")
      .send(examplePatch)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: -1000,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("Returns 400 if patch body has incorrect syntax", () => {
    const examplePatch = { votes: -1000 };
    return request(app)
      .patch("/api/articles/5")
      .send(examplePatch)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid PATCH body");
      });
  });
  test("Returns 400 if patch body missing", () => {
    return request(app)
      .patch("/api/articles/5")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid PATCH body");
      });
  });
  test("Returns 404 if article_id out of range", () => {
    const examplePatch = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/10000")
      .send(examplePatch)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
});
