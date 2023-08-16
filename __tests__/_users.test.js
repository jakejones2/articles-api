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

describe("GET /api/users", () => {
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

describe("GET api/users/:username", () => {
  test("should return a 200 when passed valid username", () => {
    return request(app).get("/api/users/rogersop").expect(200);
  });
  test("should return correct user when passed valid username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("should return a 404 if user not found", () => {
    return request(app)
      .get("/api/users/mystery_user")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User not found");
      });
  });
});
