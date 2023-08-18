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
  test("user information does not include password_hash", () => {
    return request(app)
      .get("/api/users")
      .then(({ body: { users } }) => {
        expect(users[0]).not.toHaveProperty("password_hash");
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
  test("password_hash should not be sent", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .then(({ body: { user } }) => {
        expect(user).not.toHaveProperty("password_hash");
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

describe("POST /api/users", () => {
  test("should return 201 if username does not already exist", () => {
    const postBody = {
      username: "bob",
      name: "boris",
      avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      password: "myCrazy44P@ssword",
    };
    return request(app).post("/api/users").send(postBody).expect(201);
  });
  test("should return 409 if username already exists", () => {
    const postBody = {
      username: "butter_bridge",
      name: "boris",
      avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      password: "myCrazy44P@ssword",
    };
    return request(app).post("/api/users").send(postBody).expect(409);
  });
});
// need to test the rest of the POST body - validate fields etc. even image url eventually.
// validate password on front end?

describe("DELETE /api/users", () => {
  test("should respond with 401 if not logged in", () => {
    return request(app).delete("/api/users/rogersop").expect(401);
  });
  test("should respond with 204 if user matches logged in user, deleting user and their articles", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    // authenticate user
    return request(app)
      .post("/auth")
      .send(postBody)
      .then(({ body: { accessToken } }) => {
        // send delete along with accessToken
        return request(app)
          .delete("/api/users/rogersop")
          .set("Authorization", `Bearer ${accessToken}`)
          .expect(204)
          .then(() => {
            // check user deleted
            return request(app)
              .get("/api/users/rogersop")
              .expect(404)
              .then(() => {
                // check article deleted
                return request(app)
                  .get("/api/articles?author=rogersop")
                  .expect(404);
              });
          });
      });
  });
});

describe("admin page", () => {
  test("should respond 403 if not logged in", () => {
    return request(app).get("/auth/admin").expect(401);
  });
  test("should respond with 200 if logged in", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    return request(app)
      .post("/auth")
      .send(postBody)
      .then(({ body: { accessToken } }) => {
        return request(app)
          .get("/auth/admin")
          .set("Authorization", `Bearer ${accessToken}`)
          .expect(200);
      });
  });
});
