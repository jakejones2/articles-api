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

describe("users", () => {
  test("GET 200 from /api/users", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("GET users from /api/users", () => {
    return request(app)
      .get("/api/users")
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        expect(users[0]).toMatchObject({
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          name: "jonny",
          username: "butter_bridge",
        });
      });
  });
});
