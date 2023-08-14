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
});
