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

describe("GET /api/articles/:article_id", () => {
  test("GET 200 from /articles/:article_id ", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("GETs first article from /articles/:article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GETs random article from /articles/:article_id", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 7,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          votes: 0,
          body: "I was hungry.",
          created_at: "2020-01-07T14:08:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("returns a new property comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("comment_count", 11);
      });
  });
});
describe("GET /api/articles/:article_id error handling", () => {
  test("Out of range id produces 404 and message", () => {
    return request(app)
      .get("/api/articles/36")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
  test("Bad request produces a 400 and message", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET 200 from /api/articles  ", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("GET all articles from /api/articles", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body: { articles } }) => {
        expect(articles.length > 0).toBe(true);
        articles.forEach((article) => {
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
        });
        expect(articles[6]).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("Articles include a comment_count property", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body: { articles } }) => {
        expect(articles[6]).toHaveProperty("comment_count", 11);
      });
  });
  test("Articles are sorted by created_at descending", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET /api/articles query topic", () => {
  test("Should accept the query topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "mitch");
        });
      });
  });
  test("Should return 404 if topic not in topics table", () => {
    return request(app)
      .get("/api/articles?topic=space")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Topic not found");
      });
  });
});

describe("GET /api/articles query sort_by", () => {
  test("should be able to sort by votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("should be able to sort by article_id", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("should be able to sort by title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("should be able to sort by topic", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("should be able to sort by author", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("should be able to sort by created_at", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("should be able to sort by comment_count", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("comment_count", { descending: true });
      });
  });
  test("should be able to sort by article_img_url", () => {
    return request(app)
      .get("/api/articles?sort_by=article_img_url")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_img_url", { descending: true });
      });
  });
});

describe("GET /api/articles query order", () => {
  test("should be able to add query order=asc", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("should be able to add query order=desc", () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles query author", () => {
  test("should be able to add query author=rogersop", () => {
    return request(app)
      .get("/api/articles?author=rogersop")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article.author).toBe("rogersop");
        });
      });
  });
  test("all queries should work together", () => {
    return request(app)
      .get(
        "/api/articles?author=rogersop&topic=cats&sort_by=article_id&order=asc"
      )
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id");
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
          expect(article.author).toBe("rogersop");
        });
      });
  });
});

describe("GET /api/articles query error handling", () => {
  test("invalid sort_by query returns 400", () => {
    return request(app)
      .get("/api/articles?sort_by=pancakes")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should return 400 if order is not asc or desc", () => {
    return request(app)
      .get("/api/articles?order=desc;+DROP+TABLE+IF+EXISTS+articles;")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("if one query is incorrect and others pass, still return 400", () => {
    return request(app)
      .get("/api/articles?topic=cats&sort_by=article_id&order=OVERHERE")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("if topic does not exist return 404", () => {
    return request(app).get("/api/articles?topic=dogs").expect(404);
  });
  test("if author does not exist return 404", () => {
    return request(app).get("/api/articles?author=dogs").expect(404);
  });
  test("if author and topic exist but no results, return empty array", () => {
    return request(app)
      .get("/api/articles?topic=cats&author=butter_bridge")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0);
      });
  });
});

describe("GET /api/articles with pagination", () => {
  test("should only return 10 articles", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
      });
  });
  test("should only return 8 articles if limit = 8", () => {
    return request(app)
      .get("/api/articles?limit=8")
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(8);
      });
  });
  test("should receive 5 articles on page 2 with limit = 8", () => {
    return request(app)
      .get("/api/articles?limit=8&p=2")
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5);
      });
  });
  test("page 2 should have the correct data", () => {
    return request(app)
      .get("/api/articles?limit=8&p=2")
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5);
        expect(articles[0]).toMatchObject({
          // sorts by created_at by default
          article_id: 10,
          author: "rogersop",
          created_at: "2020-05-14T04:15:00.000Z",
          title: "Seven inspirational thought leaders from Manchester UK",
          topic: "mitch",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("articles should arrive alongside a key of totalCount", () => {
    return request(app)
      .get("/api/articles?limit=8&p=2")
      .then(({ body: { totalCount } }) => {
        expect(totalCount).toBe(13);
      });
  });
  test("if limit greater than totalCount, return totalCount", () => {
    return request(app)
      .get("/api/articles?limit=15")
      .then(({ body: { totalCount } }) => {
        expect(totalCount).toBe(13);
      });
  });
  test("if page out of bounds, return 200 with empty array", () => {
    return request(app)
      .get("/api/articles?limit=5&p=5")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
  test("should work with other queries", () => {
    return request(app)
      .get("/api/articles?limit=2&p=2&topic=mitch&sort_by=article_id&order=asc")
      .then(({ body: { articles, totalCount } }) => {
        expect(totalCount).toBe(12);
        expect(articles.length).toBe(2);
        expect(articles[0]).toMatchObject({
          article_id: 3,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          author: "icellusedkars",
          comment_count: 2,
          created_at: "2020-11-03T09:12:00.000Z",
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          votes: 0,
        });
      });
  });
});

describe("GET /api/articles pagination error handling", () => {
  test("if limit = 0, return 400", () => {
    return request(app)
      .get("/api/articles?limit=0")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("if limit < 0, return 400", () => {
    return request(app)
      .get("/api/articles?limit=-3")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("if page = 0, return 400", () => {
    return request(app)
      .get("/api/articles?limit=3&p=0")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("if page < 0, return 400", () => {
    return request(app)
      .get("/api/articles?limit=3&p=-6")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("if limit not a number, return 400", () => {
    return request(app)
      .get("/api/articles?limit=fish")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("if page not a number, return 400", () => {
    return request(app)
      .get("/api/articles?limit=3&p=banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("PATCH api/articles/:article_id", () => {
  test("PATCH 200 from /api/articles/:article_id", () => {
    const examplePatch = { inc_votes: 1 };
    return request(app).patch("/api/articles/1").send(examplePatch).expect(200);
  });
  test("PATCH returns updated article", () => {
    const examplePatch = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(examplePatch)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH returns updated article when inc_votes greater than 1", () => {
    const examplePatch = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/3")
      .send(examplePatch)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 50,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH returns updated article when inc_votes is negative", () => {
    const examplePatch = { inc_votes: -1000 };
    return request(app)
      .patch("/api/articles/5")
      .send(examplePatch)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: -1000,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
});
describe("PATCH /api/articles/:article_id error handling", () => {
  test("Returns 400 if patch body has incorrect syntax", () => {
    const examplePatch = { votes: -1000 };
    return request(app)
      .patch("/api/articles/5")
      .send(examplePatch)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid PATCH body");
      });
  });
  test("Returns 400 if patch body missing", () => {
    return request(app)
      .patch("/api/articles/5")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid PATCH body");
      });
  });
  test("Returns 400 if patch inc_votes is not a number", () => {
    const examplePatch = { votes: "cat" };
    return request(app)
      .patch("/api/articles/5")
      .send(examplePatch)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid PATCH body");
      });
  });
  test("Returns 404 if article_id out of range", () => {
    const examplePatch = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/10000")
      .send(examplePatch)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
  test("Returns 400 if article_id is invalid", () => {
    const examplePatch = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/geese")
      .send(examplePatch)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles", () => {
  test("should respond with 201 given correct body", () => {
    const testArticle = {
      author: "butter_bridge",
      title: "important new article",
      body: "something I really need to share immediately with everyone",
      topic: "cats",
    };
    return request(app).post("/api/articles").send(testArticle).expect(201);
  });
  test("should respond with new article given valid body", () => {
    const testArticle = {
      author: "butter_bridge",
      title: "important new article",
      body: "something I really need to share immediately with everyone",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 14,
          votes: 0,
          comment_count: 0,
          author: "butter_bridge",
          title: "important new article",
          body: "something I really need to share immediately with everyone",
          topic: "cats",
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
        });
        expect(article).toHaveProperty("created_at", expect.any(String));
        const currentTime = new Date().getTime();
        const articleTime = new Date(article.created_at).getTime();
        expect(articleTime / 10000).toBeCloseTo(currentTime / 10000);
      });
  });
  test("should be able to add a new article image url rather than default", () => {
    const testArticle = {
      author: "butter_bridge",
      title: "important new article",
      body: "something I really need to share immediately with everyone",
      topic: "cats",
      article_img_url:
        "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/DCTM_Penguin_UK_DK_AL644648_p7nd0z.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_img_url:
            "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/DCTM_Penguin_UK_DK_AL644648_p7nd0z.jpg",
        });
      });
  });
  test("superfluous keys ignored", () => {
    const testArticle = {
      author: "butter_bridge",
      fridge: false,
      title: "important new article",
      body: "something I really need to share immediately with everyone",
      topic: "cats",
      bananas: "yellow",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 14,
          votes: 0,
          comment_count: 0,
          author: "butter_bridge",
          title: "important new article",
          body: "something I really need to share immediately with everyone",
          topic: "cats",
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
        });
        expect(article).toHaveProperty("created_at", expect.any(String));
      });
  });
});
describe("POST /api/articles error handling", () => {
  test("should receive a 400 if body is missing", () => {
    return request(app)
      .post("/api/articles")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should recieve a 400 if title is missing", () => {
    const testArticle = {
      author: "butter_bridge",
      body: "something I really need to share immediately with everyone",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should recieve a 400 if author is missing", () => {
    const testArticle = {
      title: "important new article",
      body: "something I really need to share immediately with everyone",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should recieve a 400 if body is missing", () => {
    const testArticle = {
      title: "important new article",
      author: "butter_bridge",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should recieve a 400 if topic is missing", () => {
    const testArticle = {
      title: "important new article",
      body: "something I really need to share immediately with everyone",
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should receive a 400 if title is not a string", () => {
    const testArticle = {
      author: "butter_bridge",
      title: true,
      body: "something I really need to share immediately with everyone",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should receive a 400 if body is not a string", () => {
    const testArticle = {
      author: "butter_bridge",
      title: "test title",
      body: 5852,
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("should receive a 404 if topic not in topics", () => {
    const testArticle = {
      author: "butter_bridge",
      title: "test title",
      body: "some body",
      topic: "dogs",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Topic not found");
      });
  });
  test("should receive a 404 if author not in authors", () => {
    const testArticle = {
      author: "me_a_new_author!",
      title: "test title",
      body: "some body",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User not found");
      });
  });
  test("should receive a 400 if url not valid", () => {
    const testArticle = {
      author: "butter_bridge",
      title: "test title",
      body: "some body",
      topic: "cats",
      article_img_url: "this_couldn't be a url",
    };
    return request(app)
      .post("/api/articles")
      .send(testArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid image url");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("should return 204 when given valid article_id", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });
  test("should delete specified article", () => {
    return request(app)
      .delete("/api/articles/1")
      .then(() => {
        return request(app).get("/api/articles/1").expect(404);
      });
  });
  test("should delete all related comments", () => {
    return request(app)
      .delete("/api/articles/1")
      .then(() => {
        return request(app).get("/api/articles/1/comments").expect(404);
      });
  });
});
describe("DELETE /api/articles/:article_id error handling", () => {
  test("sohuld return 404 if article cannot be found", () => {
    return request(app)
      .delete("/api/articles/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
});
