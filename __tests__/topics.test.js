const app = require("../app");
const request = require("supertest");
let db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api/topics", () => {
  test("GET 200 from /api/topics", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("GET data from /api/topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length > 0).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
        expect(topics[0]).toMatchObject({
          description: "The man, the Mitch, the legend",
          slug: "mitch",
        });
        expect(topics[1]).toMatchObject({
          description: "Not dogs",
          slug: "cats",
        });
        expect(topics[2]).toMatchObject({
          description: "what books are made of",
          slug: "paper",
        });
      });
  });
});
