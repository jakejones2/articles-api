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

describe("POST /api/topics", () => {
  test("should receive 201 when passed correct body", () => {
    const postBody = {
      slug: "gardening",
      description: "growing stuff",
    };
    return request(app).post("/api/topics").send(postBody).expect(201);
  });
  test("should return the new topic", () => {
    const postBody = {
      slug: "gardening",
      description: "growing stuff",
    };
    return request(app)
      .post("/api/topics")
      .send(postBody)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          ...postBody,
        });
      });
  });
  test("should return 201 if extra keys are provided", () => {
    const postBody = {
      slug: "gardening",
      description: "growing stuff",
      moreinfo: "can I add this?",
    };
    return request(app)
      .post("/api/topics")
      .send(postBody)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          slug: "gardening",
          description: "growing stuff",
        });
      });
  });
});

describe("POST /api/topics error handling", () => {
  test("should respond with 400 if body missing", () => {
    return request(app)
      .post("/api/topics")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should respond with 400 if slug key missing", () => {
    const postBody = {
      description: "growing stuff",
    };
    return request(app)
      .post("/api/topics")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should respond with 400 if description key missing", () => {
    const postBody = {
      slug: "gardening",
    };
    return request(app)
      .post("/api/topics")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should respond with 400 if slug not a string", () => {
    const postBody = {
      description: "growing stuff",
      slug: 1245,
    };
    return request(app)
      .post("/api/topics")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should respond with 400 if description not a string", () => {
    const postBody = {
      description: true,
      slug: "gardening",
    };
    return request(app)
      .post("/api/topics")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should return 400 if body malformed", () => {
    const postBody = "big string";
    return request(app)
      .post("/api/topics")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});
