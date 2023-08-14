const app = require("../app");
const request = require("supertest");
let db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

describe("topics", () => {
  describe("GET /api/topics", () => {
    test("GET 200 from /api/topics", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("GET data from /api/topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          });
          expect(topics[0]).toMatchObject({
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          });
        });
    });
    test("GET 404 from bad path", () => {
      return request(app).get("/api/pancakes").expect(404);
    });
    test("GET 500 from /api/topics if server error", () => {
      // close the database connection prematurely
      // should produce a node-pg error internally
      // having this error last also closes the db conn
      db.end();
      return request(app)
        .get("/api/topics")
        .expect(500)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Internal Server Error");
        });
    });
  });
});
