module.exports = {
  "GET /api": {
    description:
      "serves up a json representation of all the available endpoints of the api",
  },
  "GET /api/topics": {
    description: "serves an array of all topics",
    queries: [],
    exampleResponse: {
      topics: [{ slug: "football", description: "Footie!" }],
    },
  },
  "GET /api/articles": {
    description: "serves an array of all articles",
    queries: ["author", "topic", "sort_by", "order"],
    exampleResponse: {
      articles: [
        {
          title: "Seafood substitutions are increasing",
          topic: "cooking",
          author: "weegembump",
          body: "Text from the article..",
          created_at: "2018-05-30T15:59:13.341Z",
          votes: 0,
          comment_count: 6,
        },
      ],
    },
  },
  "GET /api/articles/:article_id": {
    description:
      "serves an individual article based on article_id url parameter",
    queries: [],
    exampleResponse: {
      article: {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: "2020-01-07T14:08:00.000Z",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    },
  },
  "PATCH /api/articles/:article_id": {
    description:
      "Updates the votes property of a given article. Must receive object with a key of 'inc_votes'.",
    queries: [],
    examplePatchBody: { inc_votes: 3 },
    exampleResponse: {
      article_id: 5,
      title: "UNCOVERED: catspiracy to bring down democracy",
      topic: "cats",
      author: "rogersop",
      body: "Bastet walks amongst us, and the cats are taking arms!",
      created_at: "2020-08-03T13:14:00.000Z",
      votes: 3,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
  },
  "POST /api/articles/:article_id/comments": {
    description:
      "Creates a comment on an individual article based on article_id url parameter. Username must be registerd.",
    queries: [],
    examplePostBody: {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    },
    exampleResponse: {
      author: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 1,
      votes: 0,
      created_at: "2020-10-31T03:03:00.000Z",
    },
  },
};
