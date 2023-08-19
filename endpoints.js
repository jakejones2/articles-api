module.exports = {
  "/api": {
    "GET /api": {
      description:
        "serves up a json representation of all the available endpoints of the api",
      queries: [],
      successfulRequestBody: null,
      successfulResponseBody: null,
      requestHeaderIncludes: null,
      responseHeaderIncludes: null,
    },
  },
  "/api/articles": {
    "GET /api/articles": {
      description:
        "serves an array of all articles, with pagination in 10s by default.",
      queries: ["topic", "author", "sort_by", "order", "limit", "p"],
      successfulRequestBody: null,
      successfulResponseBody: {
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
      requestHeaderIncludes: null,
      responseHeaderIncludes: null,
    },
    "POST /api/articles": {
      description:
        "Adds and validates new articles. Default image url created if none offered.",
      queries: [],
      successfulRequestBody: {
        author: "butter_bridge",
        title: "important new article",
        body: "something I really need to share immediately with everyone",
        topic: "cats",
        article_img_url:
          "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/DCTM_Penguin_UK_DK_AL644648_p7nd0z.jpg",
      },
      successfulResponseBody: {
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
      requestHeaderIncludes: { Authorization: "Bearer <accessToken>" },
      responseHeaderIncludes: null,
    },
  },
  "/api/articles/:ariticle_id": {
    "GET /api/articles/:article_id": {
      description:
        "serves an individual article based on article_id url parameter",
      queries: [],
      successfulRequestBody: null,
      successfulResponseBody: {
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
      requestHeaderIncludes: null,
      responseHeaderIncludes: null,
    },
    "PATCH /api/articles/:article_id": {
      description:
        "Updates the votes property of a given article. Must receive object with a key of 'inc_votes'.",
      queries: [],
      examplePatchBody: { inc_votes: 3 },
      successfulRequestBody: null,
      successfulResponseBody: {
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
      requestHeaderIncludes: { Authorization: "Bearer <accessToken>" },
      responseHeaderIncludes: null,
    },
    "DELETE /api/articles:article_id": {
      description: "deletes article at given id, returns 204 no content",
      queries: [],
      successfulRequestBody: null,
      successfulResponseBody: null,
      requestHeaderIncludes: { Authorization: "Bearer <accessToken>" },
      responseHeaderIncludes: null,
    },
  },
  "/api/articles/:article_id/comments": {
    "GET /api/articles/:article_id/comments": {
      description:
        "Gets all comments on an article, paginated in 10s by default.",
      queries: ["limit", "p"],
      successfulRequestBody: null,
      successfulResponseBody: {
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
      requestHeaderIncludes: null,
      responseHeaderIncludes: null,
    },
    "POST /api/articles/:article_id/comments": {
      description:
        "Creates a comment on an individual article based on article_id url parameter. Username must be registered.",
      queries: [],
      successfulRequestBody: {
        username: "butter_bridge",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      },
      successfulResponseBody: {
        comment: {
          author: "butter_bridge",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 1,
          votes: 0,
          created_at: "2020-10-31T03:03:00.000Z",
        },
      },
      requestHeaderIncludes: { Authorization: "Bearer <accessToken>" },
      responseHeaderIncludes: null,
    },
  },
  "/api/comments/:comment_id": {
    "PATCH /api/comments/:comment_id": {
      description:
        "Updates the votes on a comment based on comment_id in url. Cannot increment or decrement by more than 5 votes, and users can only vote once per article.",
      queries: [],
      successfulRequestBody: null,
      successfulResponseBody: {
        comment: {
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        },
      },
      requestHeaderIncludes: { Authorization: "Bearer <accessToken>" },
      responseHeaderIncludes: null,
    },
    "DELETE /api/comments/:comment_id": {
      description:
        "Deletes a comment based on comment_id in url. Returns a 204.",
      queries: [],
      successfulRequestBody: null,
      successfulResponseBody: null,
      requestHeaderIncludes: { Authorization: "Bearer <accessToken>" },
      responseHeaderIncludes: null,
    },
  },
  "/api/topics": {
    "GET /api/topics": {
      description: "serves an array of all topics",
      queries: [],
      successfulRequestBody: null,
      successfulResponseBody: {
        topics: [{ slug: "football", description: "Footie!" }],
      },
      requestHeaderIncludes: null,
      responseHeaderIncludes: null,
    },
    "POST /api/topics": {
      description: "adds a new topic",
      queries: [],
      successfulRequestBody: {
        slug: "gardening",
        description: "growing stuff",
      },
      successfulResponseBody: {
        topic: { slug: "gardening", description: "growing stuff" },
      },
      requestHeaderIncludes: null,
      responseHeaderIncludes: null,
    },
  },
  "api/users": {
    "GET /api/users": {
      description: "Retreives all users as an array of objects",
      queries: [],
      successfulRequestBody: null,
      successfulResponseBody: {
        users: [
          {
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            name: "jonny",
            username: "butter_bridge",
          },
        ],
      },
      requestHeaderIncludes: null,
      responseHeaderIncludes: null,
    },
    "POST /api/users": {
      description:
        "Create a new user. Avatar url optional. Must be unique - will return 409 if username taken.",
      queries: [],
      successfulRequestBody: {
        username: "bob",
        name: "boris",
        avatar_url:
          "https://avatars3.githubusercontent.com/u/24604688?s=460&v=4",
        password: "myCrazy44P@ssword",
      },
      successfulResponseBody: {
        username: "bob",
        name: "boris",
        avatar_url:
          "https://avatars3.githubusercontent.com/u/24604688?s=460&v=4",
      },
      requestHeaderIncludes: null,
      responseHeaderIncludes: null,
    },
  },
  "/api/users/:username": {
    "GET /api/users/:username": {
      description: "Retrieves a user based on username in url.",
      queries: [],
      successfulRequestBody: null,
      successfulResponseBody: {
        user: {
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        },
      },
      requestHeaderIncludes: null,
      responseHeaderIncludes: null,
    },
    "DELETE /api/user/:username": {
      description:
        "Deletes given user. Must send access token in Authorization header. Returns 204 if success.",
      queries: [],
      successfulRequestBody: null,
      successfulResponseBody: null,
      requestHeaderIncludes: { Authorization: "Bearer <accessToken>" },
      responseHeaderIncludes: null,
    },
  },
  "/auth": {
    "POST /auth": {
      description:
        "Logs users in for a session. Returns access token in body and refresh token as secure, http-only cookie.",
      queries: [],
      successfulRequestBody: {
        username: "bob",
        password: "password",
      },
      successfulResponseBody: {
        AccessToken: "long-string-of-random-characters",
      },
      requestHeaderIncludes: null,
      responseHeaderIncludes: {
        "set-cookie":
          "jwt=some-random-string; Path=/; Expires=some-date; HttpOnly; SameSite=None; Secure",
      },
    },
  },
  "/refresh": {
    "GET /refresh": {
      description:
        "Responds with new access token providing a valid refresh token sent as cookie",
      queries: [],
      successfulRequestBody: null,
      successfulResponseBody: {
        AccessToken: "long-string-of-random-characters",
      },
      requestHeaderIncludes: { Cookie: "jwt=some-random-string" },
      responseHeaderIncludes: null,
    },
  },
  "/logout": {
    "GET /logout": {
      description: "Logs user out by deleting refresh token",
      queries: [],
      successfulResponseBody: null,
      successfulRequestBody: null,
      requestHeaderIncludes: null,
      responseHeaderIncludes: {
        "set-cookie":
          "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=None; Secure",
      },
    },
  },
};
