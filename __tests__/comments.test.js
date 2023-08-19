const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { authButterBridge } = require("../test-utils");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET 200 from /api/articles/:article_id/comments ", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("GET comments from /api/articles/:article_id/comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length > 0).toBe(true);
        expect(comments[0]).toMatchObject({
          comment_id: 2,
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 14,
          author: "butter_bridge",
          article_id: 1,
          created_at: "2020-10-31T03:03:00.000Z",
        });
      });
  });
});
describe("GET /api/articles/:article_id/comments error handling", () => {
  test("receive 404 when article_id out of range", () => {
    return request(app)
      .get("/api/articles/0/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No comments found");
      });
  });
  test("receive 400 when article_id malformed", () => {
    return request(app)
      .get("/api/articles/frog/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Bad request. Individual comments and articles must be retrieved by ID, e.g. GET /api/articles/3. To find an ID, search all articles/comments with the queries available."
        );
      });
  });
});
describe("GET /api/articles/:article_id/comments pagination", () => {
  test("comments page length should default to 10", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(10);
      });
  });
  test("comments page length can be set in query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=6")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(6);
      });
  });
  test("response includes a total_count key with number of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { totalCount } }) => {
        expect(totalCount).toBe(11);
      });
  });
  test("second page has correct comments (sorted by id by default)", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=3&p=2")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments[0]).toMatchObject({
          // comment_id 1 has article_id 9
          comment_id: 5,
          body: "I hate streaming noses",
          votes: 0,
          author: "icellusedkars",
          article_id: 1,
          created_at: "2020-11-03T21:00:00.000Z",
        });
      });
  });
  test("if limit higher than total, return all", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=44")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
      });
  });
});

describe("GET /api/articles/:article_id/comments pagination error handling", () => {
  test("if page out of bounds, return 404", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=5")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No comments found");
      });
  });
  test("if limit = 0, return 400", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=0")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Invalid "limit" query, must be an integer greater than 1'
        );
      });
  });
  test("if limit < 0, return 400", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=-3")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Invalid "limit" query, must be an integer greater than 1'
        );
      });
  });
  test("if page = 0, return 400", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=3&p=0")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Invalid "p" query, must be an integer greater than 1'
        );
      });
  });
  test("if page < 0, return 400", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=3&p=-6")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Invalid "p" query, must be an integer greater than 1'
        );
      });
  });
  test("if limit not a number, return 400", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=fish")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Invalid "limit" query, must be an integer greater than 1'
        );
      });
  });
  test("if page not a number, return 400", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=3&p=banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Invalid "p" query, must be an integer greater than 1'
        );
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("receive 201 when POST /api/articles/:article_id/comments ", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/1/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(201);
    });
  });
  test("receive 201 when POST body has extra information", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      randomkey: "how did this get here",
    };
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/1/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(201);
    });
  });
  test("receive posted comment when POST /api/articles/:article_id/comments", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/1/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            author: "butter_bridge",
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 1,
            votes: 0,
          });
          expect(comment).toHaveProperty("created_at", expect.any(String));
        });
    });
  });
  test("posted comment ignores extra keys in body", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      favouriteFruit: "banana",
    };
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/1/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            author: "butter_bridge",
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 1,
            votes: 0,
          });
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).not.toHaveProperty("favouriteFruit");
        });
    });
  });
});

describe("POST api/articles/:article_id/comments error handling", () => {
  test("receive 401 if request not authenticated", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(401);
  });
  test("receive 403 if username does not match authenticated user", () => {
    const testComment = {
      username: "rogersop",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/1/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(403)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Authenticated user does not match comment author");
        });
    });
  });
  test("receive 404 if username not in users table", () => {
    const testComment = {
      username: "bob",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/1/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User not found");
        });
    });
  });
  test("receive 400 if body is not a string", () => {
    const testComment = {
      username: "butter_bridge",
      body: true,
    };
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/1/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Request body must be valid json, and must include a key of "body" with a value of type string'
          );
        });
    });
  });
  test("receive 400 if username is missing", () => {
    const testComment = {
      body: true,
    };
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/1/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Request body must be valid json, and must include a key of "body" with a value of type string'
          );
        });
    });
  });
  test("receive 400 if body is missing", () => {
    const testComment = {
      username: "butter_bridge",
    };
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/1/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Request body must be valid json, and must include a key of "body" with a value of type string'
          );
        });
    });
  });
  test("receive 400 if article_id is invalid", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/pancake/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "Bad request. Individual comments and articles must be retrieved by ID, e.g. GET /api/articles/3. To find an ID, search all articles/comments with the queries available."
          );
        });
    });
  });
  test("receive 404 if article_id is out of range:", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/10000/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Item not found");
        });
    });
  });
  test("receive 400 if POST body is not json", () => {
    const testComment = "apple";
    return authButterBridge().then((accessToken) => {
      return request(app)
        .post("/api/articles/1/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Request body must be valid json, and must include a key of "body" with a value of type string'
          );
        });
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE 204 from /api/comments/:comment_id", () => {
    return authButterBridge().then((accessToken) => {
      return request(app)
        .delete("/api/comments/1")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(204);
    });
  });
  test("DELETE comments deletes comment", () => {
    return authButterBridge().then((accessToken) => {
      return request(app)
        .delete("/api/comments/1")
        .set("Authorization", `Bearer ${accessToken}`)
        .then(() => {
          return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              // used to be two comments, see data
              expect(comments.length).toBe(1);
            });
        });
    });
  });
});
describe("DELETE /api/comments/:comment_id error handling", () => {
  test("Returns 401 if use not authenticated", () => {
    return request(app).delete("/api/comments/1").expect(401);
  });
  test("Returns 403 if comment author does not match authenticated user", () => {
    return authButterBridge().then((accessToken) => {
      return request(app)
        .delete("/api/comments/3")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(403)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Authenticated user does not match comment author");
        });
    });
  });
  test("Returns 404 if comment not found", () => {
    return authButterBridge().then((accessToken) => {
      return request(app)
        .delete("/api/comments/1000")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Comment not found");
        });
    });
  });
  test("Returns 400 if comment_id invalid", () => {
    return authButterBridge().then((accessToken) => {
      return request(app)
        .delete("/api/comments/fryingpan")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "Bad request. Individual comments and articles must be retrieved by ID, e.g. GET /api/articles/3. To find an ID, search all articles/comments with the queries available."
          );
        });
    });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("responds with 200 when given valid body", () => {
    const testBody = { inc_votes: 1 };
    return request(app).patch("/api/comments/1").send(testBody).expect(200);
  });
  test("responds with updated comment when given valid body", () => {
    const testBody = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(testBody)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("can decrement votes", () => {
    const testBody = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/1")
      .send(testBody)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 15,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("can increment votes more than one", () => {
    const testBody = { inc_votes: 30 };
    return request(app)
      .patch("/api/comments/1")
      .send(testBody)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 46,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("returns 200 if extra keys in body", () => {
    const testBody = { inc_votes: 1, bananas: true };
    return request(app)
      .patch("/api/comments/1")
      .send(testBody)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
});
describe("PATCH /api/comments/:comment_id error handling", () => {
  test("returns 404 if comment cannot be found", () => {
    const testBody = { inc_votes: 30 };
    return request(app)
      .patch("/api/comments/900000")
      .send(testBody)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment not found");
      });
  });
  test("returns 400 if body missing", () => {
    return request(app)
      .patch("/api/comments/1")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Request body must be valid json and include a key of "inc_votes" of type number'
        );
      });
  });
  test("returns 400 if body has incorrect key", () => {
    const testBody = { bananas: 30 };
    return request(app)
      .patch("/api/comments/1")
      .send(testBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Request body must be valid json and include a key of "inc_votes" of type number'
        );
      });
  });
  test("returns 400 if increase not a number", () => {
    const testBody = { inc_votes: "bananas" };
    return request(app)
      .patch("/api/comments/1")
      .send(testBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Request body must be valid json and include a key of "inc_votes" of type number'
        );
      });
  });
  test("returns 400 if body malformed", () => {
    const testBody = "bananas";
    return request(app)
      .patch("/api/comments/1")
      .send(testBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Request body must be valid json and include a key of "inc_votes" of type number'
        );
      });
  });
  test("returns 400 if body malformed and comment cannot be found", () => {
    const testBody = "bananas";
    return request(app)
      .patch("/api/comments/90000")
      .send(testBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Request body must be valid json and include a key of "inc_votes" of type number'
        );
      });
  });
});
