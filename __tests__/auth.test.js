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

describe("POST /auth", () => {
  test("should respond 200 if username and password match", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    return request(app).post("/auth").send(postBody).expect(200);
  });
  test("should respond 401 if username and password don't match", () => {
    const postBody = {
      username: "butter_bridge",
      password: "beans",
    };
    return request(app).post("/auth").send(postBody).expect(401);
  });
}); // check for bonus keys etc.
