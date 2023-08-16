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

describe("GET comments", () => {
  test("GET 200 from /api/articles/:article_id/comments ", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("GET comments from /api/articles/:article_id/comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length > 0).toBe(true);
        expect(comments.length).toBe(11);
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
  test("receive 404 when article_id out of range", () => {
    return request(app)
      .get("/api/articles/0/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
  test("receive 400 when article_id malformed", () => {
    return request(app)
      .get("/api/articles/frog/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("POST comments", () => {
  test("receive 201 when POST /api/articles/:article_id/comments ", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201);
  });
  test("receive 201 when POST body has extra information", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      randomkey: "how did this get here",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201);
  });
  test("receive posted comment when POST /api/articles/:article_id/comments", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
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
  test("posted comment ignores extra keys in body", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      favouriteFruit: "banana",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
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
  test("receive 404 if username not in users table", () => {
    const testComment = {
      username: "bob",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User not found");
      });
  });
  test("receive 400 if body is not a string", () => {
    const testComment = {
      username: "butter_bridge",
      body: true,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("receive 400 if username is missing", () => {
    const testComment = {
      body: true,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("receive 400 if body is missing", () => {
    const testComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("receive 400 if article_id is invalid", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/kiwi/comments")
      .send(testComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("receive 404 if article_id is out of range:", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/10000/comments")
      .send(testComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Item not found");
      });
  });
  test("receive 400 if POST body is not json", () => {
    const testComment = "apple";
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("DELETE comments by id", () => {
  test("DELETE 204 from /api/comments/:comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE comments deletes comment", () => {
    return request(app)
      .delete("/api/comments/1")
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
  test("Returns 404 if comment not found", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment not found");
      });
  });
  test("Returns 400 if comment_id invalid", () => {
    return request(app)
      .delete("/api/comments/fryingpan")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
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
        expect(msg).toBe("Bad request");
      });
  });
  test("returns 400 if body has incorrect key", () => {
    const testBody = { bananas: 30 };
    return request(app)
      .patch("/api/comments/1")
      .send(testBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("returns 400 ifnpm  increase not a number", () => {
    const testBody = { inc_votes: "bananas" };
    return request(app)
      .patch("/api/comments/1")
      .send(testBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("returns 400 if body malformed", () => {
    const testBody = "bananas";
    return request(app)
      .patch("/api/comments/1")
      .send(testBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("returns 400 if body malformed and comment cannot be found", () => {
    const testBody = "bananas";
    return request(app)
      .patch("/api/comments/90000")
      .send(testBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
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
