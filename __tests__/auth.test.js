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

describe("POST /auth", () => {
  test("should respond 200 if username and password match", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    return request(app).post("/auth").send(postBody).expect(200);
  });
  test("should respond with 200 if extra keys but username and password correct", () => {
    const postBody = {
      username: "icellusedkars",
      password: "Z7s53@R(",
      football: "bad",
      pastashape: "farfalle",
    };
    return request(app).post("/auth").send(postBody).expect(200);
  });
  test("should offer a jwt access token on body upon 200", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    return request(app)
      .post("/auth")
      .send(postBody)
      .then(({ body }) => {
        expect(body).toHaveProperty("accessToken", expect.any(String));
        expect(body.accessToken.length).toBeGreaterThan(100);
      });
  });
  test("should add a jwt refresh token cookie upon 200", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    return request(app)
      .post("/auth")
      .send(postBody)
      .then(({ header }) => {
        const cookie = header["set-cookie"][0];
        const [cookieVal, maxAge, path, expires, httpOnly, sameSite] =
          cookie.split("; ");
        expect(cookieVal.split("=")).toEqual(["jwt", expect.any(String)]);
        expect(maxAge.split("=")[1]).toBe("86400");
        expect(path.split("=")[1]).toBe("/");
        expect(expires).toEqual(expect.any(String));
        expect(httpOnly).toBe("HttpOnly");
      });
  });
});

describe("POST /auth error handling", () => {
  test("should respond 401 if username true but password invalid", () => {
    const postBody = {
      username: "butter_bridge",
      password: "beans",
    };
    return request(app)
      .post("/auth")
      .send(postBody)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Incorrect password");
      });
  });
  test("should respond 401 if username and password both valid but do not match", () => {
    const postBody = {
      username: "butter_bridge",
      password: "mcNa36GX",
    };
    return request(app).post("/auth").send(postBody).expect(401);
  });
  test("should respond with 400 if username missing", () => {
    const postBody = {
      password: "beans",
    };
    return request(app).post("/auth").send(postBody).expect(400);
  });
  test("should respond with 400 if password missing", () => {
    const postBody = {
      username: "butter_bridge",
    };
    return request(app).post("/auth").send(postBody).expect(400);
  });
  test("should respond with 400 if no body send", () => {
    return request(app).post("/auth").expect(400);
  });
});

describe("GET /refresh", () => {
  test("should respond 401 if no jwt refresh cookie", () => {
    return request(app)
      .get("/refresh")
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Refresh token not found");
      });
  });
  test("should respond with 403 if refresh cookie invalid", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    return request(app)
      .post("/auth")
      .send(postBody)
      .then(({ header }) => {
        const cookie = header["set-cookie"][0];
        const newCookie = cookie.slice(0, 5) + "n" + cookie.slice(6);
        return request(app)
          .get("/refresh")
          .set("Cookie", newCookie)
          .expect(403)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "Invalid refresh token. Request a new one at /auth."
            );
          });
      });
  });
  test("should respond with 200 and access token if jwt refresh cookie correct", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    return request(app)
      .post("/auth")
      .send(postBody)
      .then(({ header }) => {
        const cookie = header["set-cookie"][0];
        return request(app)
          .get("/refresh")
          .set("Cookie", cookie)
          .then(({ body }) => {
            expect(body).toHaveProperty("accessToken", expect.any(String));
            expect(body.accessToken.length).toBeGreaterThan(100);
          });
      });
  });
});

describe("GET /logout", () => {
  test("should respond with 204 if no jwt refresh cookie", () => {
    return request(app).get("/logout").expect(204);
  });
  test("should still respond  204 if jwt cookie, but set value to empty string", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    return request(app)
      .post("/auth")
      .send(postBody)
      .then(({ header }) => {
        const cookie = header["set-cookie"][0];
        return request(app)
          .get("/logout")
          .set("Cookie", cookie)
          .then(({ header }) => {
            const cookie = header["set-cookie"][0];
            const cookieVal = cookie.split("; ")[0];
            expect(cookieVal.split("=")[1]).toBe("");
          });
      });
  });
  test("should leave other cookies intact", () => {
    const postBody = {
      username: "rogersop",
      password: "mcNa36GX",
    };
    return request(app)
      .post("/auth")
      .send(postBody)
      .then(({ header }) => {
        const cookie = header["set-cookie"][0];
        return request(app)
          .get("/logout")
          .set("Cookie", [cookie, "test=1"])
          .then(({ header }) => {
            expect(header["set-cookie"].length).toBe(1);
          });
      });
  });
});
