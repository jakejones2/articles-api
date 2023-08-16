const app = require("../app");
const request = require("supertest");
let db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api", () => {
  test("GET 200 from /api", () => {
    return request(app).get("/api").expect(200);
  });
  test("GET endpoints from /api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body["GET /api"]).toMatchObject({
          description:
            "serves up a json representation of all the available endpoints of the api",
        });
        expect(body["GET /api/articles"]).toMatchObject({
          description:
            "serves an array of all articles, with pagination in 10s by default.",
          queries: ["topic", "sort_by", "order", "limit", "p"],
          exampleResponse: {
            articles: [
              {
                title: "Seafood substitutions are increasing",
                topic: "cooking",
                author: "weegembump",
                body: "Text from the article..",
                created_at: "2018-05-30T15:59:13.341Z",
                votes: 0,
                comment_count: 6,
              },
            ],
          },
        });
        expect(body["GET /api/topics"]).toMatchObject({
          description: "serves an array of all topics",
          queries: [],
          exampleResponse: {
            topics: [{ slug: "football", description: "Footie!" }],
          },
        });
      });
  });
  test("endpoints match endpoints.js", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({ ...endpoints });
      });
  });
});

describe("GET /api error handling", () => {
  test("non-existent paths should receive 404", () => {
    return request(app)
      .get("/api/dogs")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});
