module.exports = {
  "GET /api": {
    description:
      "serves up a json representation of all the available endpoints of the api",
  },
  "GET /api/articles": {
    description:
      "serves an array of all articles, with pagination in 10s by default.",
    queries: ["topic", "sort_by", "order", "limit", "p"],
    exampleResponse: {
      total_count: 1,
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
  "POST /api/articles": {
    description:
      "Adds and validates new articles. Default image url created if none offered.",
    queries: [],
    examplePostBody: {
      author: "butter_bridge",
      title: "important new article",
      body: "something I really need to share immediately with everyone",
      topic: "cats",
      article_img_url:
        "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/DCTM_Penguin_UK_DK_AL644648_p7nd0z.jpg",
    },
    exampleResponse: {
      article: {
        article_id: 14,
        votes: 0,
        comment_count: 0,
        author: "butter_bridge",
        title: "important new article",
        body: "something I really need to share immediately with everyone",
        topic: "cats",
        created_at: "2020-08-03T13:14:00.000Z",
        article_img_url:
          "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/DCTM_Penguin_UK_DK_AL644648_p7nd0z.jpg",
      },
    },
  },
  "GET /api/articles/:article_id": {
    description:
      "serves an individual article based on article_id url parameter",
    queries: [],
    exampleResponse: {
      article: {
        article_id: 5,
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        comment_count: 11,
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
      article: {
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
  },
  "DELETE /api/articles:article_id": {
    description: "deletes article at given id, returns 204 no content",
    queries: [],
    exampleResponse: null,
  },
  "GET /api/articles/:article_id/comments": {
    description:
      "Gets all comments on an article, paginated in 10s by default.",
    queries: ["limit", "p"],
    exampleResponse: {
      total_count: 11,
      comments: {
        totalCount: 1,
        comments: [
          {
            author: "butter_bridge",
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 1,
            votes: 0,
            created_at: "2020-10-31T03:03:00.000Z",
          },
        ],
      },
    },
  },
  "POST /api/articles/:article_id/comments": {
    description:
      "Creates a comment on an individual article based on article_id url parameter. Username must be registered.",
    queries: [],
    examplePostBody: {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    },
    exampleResponse: {
      comment: {
        author: "butter_bridge",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        votes: 0,
        created_at: "2020-10-31T03:03:00.000Z",
      },
    },
  },
  "PATCH /api/comments/:comment_id": {
    description: "Updates the votes on a comment based on comment_id in url.",
    queries: [],
    exampleResponse: {
      comment: {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 17,
        author: "butter_bridge",
        article_id: 9,
        created_at: "2020-04-06T12:17:00.000Z",
      },
    },
  },
  "DELETE /api/comments/:comment_id": {
    description: "Deletes a comment based on comment_id in url. Returns a 204.",
    queries: [],
    exampleResponse: null,
  },
  "GET /api/topics": {
    description: "serves an array of all topics",
    queries: [],
    exampleResponse: {
      topics: [{ slug: "football", description: "Footie!" }],
    },
  },
  "POST /api/topics": {
    description: "adds a new topic",
    queries: [],
    examplePostBody: {
      slug: "gardening",
      description: "growing stuff",
    },
    exampleResponse: {
      topic: { slug: "gardening", description: "growing stuff" },
    },
  },
  "GET /api/users": {
    description: "Retreives all users as an array of objects",
    queries: [],
    exampleResponse: {
      users: [
        {
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          name: "jonny",
          username: "butter_bridge",
        },
      ],
    },
  },
  "GET /api/users/:username": {
    description: "Retrieves a user based on username in url.",
    queries: [],
    exampleResponse: {
      user: {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
    },
  },
};
