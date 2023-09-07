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
  test("should return 201 and new user without password_hash or refresh_token, if username does not already exist", () => {
    const postBody = {
      username: "bob",
      name: "boris",
      avatar_url: "https://avatars3.githubusercontent.com/u/24604688?s=460&v=4",
      password: "myCrazy44P@ssword",
    };
    return request(app)
      .post("/api/users")
      .send(postBody)
      .expect(201)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: "bob",
          name: "boris",
          avatar_url:
            "https://avatars3.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
  test("should return 201 if details correct but extra keys in body", () => {
    const postBody = {
      username: "bob",
      favefood: "ricecakes",
      name: "boris",
      avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      password: "myCrazy44P@ssword",
    };
    return request(app).post("/api/users").send(postBody).expect(201);
  });
  test("should add default avatar_url if not provided", () => {
    const postBody = {
      username: "bob",
      name: "boris",
      password: "myCrazy44P@ssword",
    };
    return request(app)
      .post("/api/users")
      .send(postBody)
      .expect(201)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: "bob",
          name: "boris",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
});

describe("POST /api/users error handling", () => {
  test("should return 409 if username already exists", () => {
    const postBody = {
      username: "butter_bridge",
      name: "boris",
      avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      password: "myCrazy44P@ssword",
    };
    return request(app).post("/api/users").send(postBody).expect(409);
  });
  test("should return 400 if username is missing", () => {
    const postBody = {
      name: "boris",
      avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      password: "myCrazy44P@ssword",
    };
    return request(app)
      .post("/api/users")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Body missing username, password or name");
      });
  });
  test("should return 400 if password is missing", () => {
    const postBody = {
      username: "butter_bridge",
      name: "boris",
      avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
    };
    return request(app).post("/api/users").send(postBody).expect(400);
  });
  test("should return 400 if name is missing", () => {
    const postBody = {
      username: "butter_bridge",
      avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      password: "myCrazy44P@ssword",
    };
    return request(app).post("/api/users").send(postBody).expect(400);
  });
  test("respond with 400 if url invalid", () => {
    const postBody = {
      username: "butter_bridge",
      name: "boris",
      avatar_url: "not_a_url",
      password: "myCrazy44P@ssword",
    };
    return request(app)
      .post("/api/users")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid image url");
      });
  });
});

describe("DELETE /api/users", () => {
  test("should respond with 401 if not logged in", () => {
    return request(app).delete("/api/users/rogersop").expect(401);
  });
  test("should respond with 404 if logged in but user does not exist", () => {
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
          .delete("/api/users/newuser")
          .set("Authorization", `Bearer ${accessToken}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User not found");
          });
      });
  });
  test("should respond with 403 if logged in and user exists, but logged-in user is not target", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    // authenticate user
    return request(app)
      .post("/auth")
      .send(postBody)
      .then(({ body: { accessToken } }) => {
        // send delete request along with accessToken
        return request(app)
          .delete("/api/users/butter_bridge")
          .set("Authorization", `Bearer ${accessToken}`)
          .expect(403);
      });
  });
  test("should respond with 204 if target matches logged in user, deleting user and their articles", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    // authenticate user
    return request(app)
      .post("/auth")
      .send(postBody)
      .then(({ body: { accessToken } }) => {
        // send delete request along with accessToken
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

describe("GET /api/users/:username/votes/articles", () => {
  test("should return 404 if username not valid", () => {
    return request(app).get("/api/users/frog/votes/articles").expect(404);
  });
  test("should return many to many correspondences if username valid", () => {
    return request(app)
      .get("/api/users/butter_bridge/votes/articles")
      .expect(200)
      .then(({ body: { articleVotes } }) => {
        expect(articleVotes).toEqual([
          { article_id: 1, username: "butter_bridge", votes: 0 },
        ]);
      });
  });
});

describe("GET /api/users/:username/votes/comments", () => {
  test("should return 404 if username not valid", () => {
    return request(app).get("/api/users/dogs/votes/comments").expect(404);
  });
  test("should return many to many correspondences if username valid", () => {
    return request(app)
      .get("/api/users/butter_bridge/votes/comments")
      .expect(200)
      .then(({ body: { commentVotes } }) => {
        expect(commentVotes).toEqual([
          { comment_id: 3, username: "butter_bridge", votes: 0 },
        ]);
      });
  });
});
