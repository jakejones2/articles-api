# Setup and Overview

## Welcome!

This RESTful API lets you store and retrieve json data for a news/social media website. It is built using node/express.js and PostgreSQL, and deployed on Render with ElephantSQL.

Try it out at https://nc-news-tm72.onrender.com/api !

## Summary

For a full breakdown of what this API offers, visit the link above and send a GET request to `/api`.

### GET users, topics, articles and comments on the following endpoints:

- `/api/users`
- `/api/topics`
- `/api/articles`
  - `?topic=<topic slug>`
  - `?author=<username>`
  - `?sort_by=<column name>`
  - `?order=<asc/desc>`
  - `?limit=<num of articles per page>`
  - `?p=<page number>`
- `/api/articles/:article_id`
- `/api/articles/:article_id/comments`
  - `?limit=<num of commments per page>`
  - `?p=<page number>`

## Setup

### 1 - Install node/npm/postgres

To create your own version of this project, first install the following:

- node (min v20.4.0)
- npm (min v9.7.2)
- psql (min v14.8)

Set up postgres by following instructions for your operating system. You should be able to create and access databases via the command line with `psql`.

### 2 - Clone the repo locally

To clone the repository, choose and navigate to a parent directory, and enter the following into the command line:

```
git clone https://github.com/jakejones2/nc-news.git
```

### 3 - Install all dependencies

Once you have cloned the repository, cd into the new directory and run `npm install` to install all dependencies.

### 4 - Connect to databases with .env files

Next add two .env files for both testing and development:<br>

- `.env.development`<br>
- `.env.test`<br>

These files should be in the **top level folder** in the repository.<br><br>
Inside these .env files you must set `PGDATABASE` to your testing and development database names respectively.<br>
Make sure that these databases are created **before** running `npm run seed`.

For example, place the following inside `.env.development`:<br>

```
PGDATABASE=my_dev_database
```

This process **defines the names of your databases**. You will need to use these names to manually access data via psql at the command line.

### 5 - Seed local databases

After creating two .env files for development and testing, use the following commands to seed local databases:

1. `npm run setup-dbs`
2. `npm run seed`

The command `run setup-dbs` is included for convenience, and creates development and test databases called `nc-news` and `nc-news-test` respectively. You can skip this step if you have created your own databases. Remember that development and test database names are set in the corresponding `.env` files.

### 6 - Add secrets to .env files

Now we need to add two secret keys to each .env file that the authentication middleware can use to sign and decode JWTs. To create a secret key run the following command from the top-level directory of the repository:

```
node utils/generate-key.js
```

This command will print a 128-character code to the console. Create two of these codes for each `.env` file and assign them to the environment variables `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`. Below is an example `.env.test` file:

```
PGDATABASE=nc_news_test
ACCESS_TOKEN_SECRET=7a5c49401ab467d431b9b15340bf0ad5c0b5af6a6f548cb01ab1062673fea69b27cf9f7360134ec84e7c456ed0332f3e84ede87631ce11f03fe1f4fd9e0523d9
REFRESH_TOKEN_SECRET=24ae15b5dfa7a2d38010a6a0081998fe47ad9a78ab4791067eab8b1db78fabe92386a11fbfada412e04ddd5ad2d9ad29c5673f29c69363175c578204849ffbc7
```

### 7 - Run all tests

To run all tests, enter `npm test` into the command line. Tests are held in the `__tests__` directory.<br><br>Be aware that jest runs tests **concurrently** by default. This will lead to errors if not handled, as each test requires uninterrupted contact with the test db. If you intend to run tests directly with jest include the `--runInBand` flag.<br><br>**Husky** is installed by default to check that all tests pass before git commits. To change this behaviour, alter the `pre-commit` file in `.husky`.

### 8 - Start a local server

To start a local server, enter `node listen.js` into the command line from the top-level directory. You should see a message saying 'Listening on port 9090'. This port can be changed by altering the `port` variable in `listen.js`.

If you are getting unexpected behaviour with the authorization system, it might be because secure cookies are not getting sent over localhost. Try the following steps:

- Navigate to `/controllers/auth-controller.js`, line 40, and set `secure` to `false`.
- Repeat the above step in `/controllers/logout-controller.js`, on line 17.

# Usage

## Articles

### GET

GET `/api/articles` to retrieve all articles paginated in 10s.

Accepts the following queries:

- `author` requests all articles with author=users.username
- `topic` requests all articles with topic=topics.slug
- `sort_by` sorts by any columns in the articles table
- `order` can sort be ASC or DESC
- `limit` (int) determines the number of articles per page
- `p` (int) determines the page

When viewing **all** articles, results are sent as an array **without the body of each review**. To see the body of a review, send a GET request to `/api/articles/:article_id`.

### POST

POST `/api/articles` to add new articles.

Example request body to POST an article:

```
{
  author: "butter_bridge",
  title: "important new article",
  body: "something I really need to share immediately with everyone",
  topic: "cats",
}
```

An `author` must correspond to a `username` in the users table, and the `topic` to an existing `topic`. If these fields represent **new data**, you must first add them to their respective tables by sending POST requests to `/api/users` and `/api/topics`. You must also send an **access token** in the request header authenticating you as the username entered. See _Authorization_ for more information.

### PATCH

PATCH `/api/articles/:article_id` to increase an article's `votes` property.

Example request body to PATCH an article and increase its votes by 3:

```
{ inc_votes: 3 }
```

All voting is anonymous and unlimited on this API - any user can send any number of PATCH requests. If you want this feature to be more serious and indicative of popularity, consider representing votes as a many-to-many relationship between users and articles/comments. This will require some refactoring!

### DELETE

DELETE `/api/articles/:article_id` to delete an article.

A succesful deletion returns a status code of 204 (no content). To delete an article, you must send a valid **access token** (see _Authentication_).

## Comments

### GET

GET `/api/articles/:article_id/comments` to get comments by `article_id`, paginated in 10s.

Accepts the following queries:

- `limit` (int) determines the number of comments per page
- `p` (int) determines the page

### POST

POST `/api/articles/:article_id/comments` to add new comments.

Example request body to POST a new comment:

```
{
    username: "butter_bridge",
    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
}
```

Like an article, you must be **authenticated** to post a comment, and must therefore send a valid **access token** (see _Authentication_).

### DELETE

DELETE `/api/comments/:comment_id` to delete comments.

A successful deletion returns a status code of 204 (no content). To delete a comment you must send a valid **access token** (see _Authentication_).

## Topics

- GET `/api/topics` to get topics.
- POST `/api/topics` to add new topics.

Example request body to POST a new topic:

```
{
    slug: "gardening",
    description: "growing stuff",
}
```

Any user can POST a topic, but once created they cannot be deleted via the API.

## Users

### POST

POST `/api/users` to create new users.

Example request body to POST a new user:

```
{
    username: "bob",
    name: "boris",
    avatar_url: "https://avatars3.githubusercontent.com/u/24604688?s=460&v=4",
    password: "myP@ssword",
}
```

After creating a new user, you will **never again** get access to your password, so keep it safe! To modify content related to this user, gain an access token via POST `/auth` or GET `/refresh`, and add this to your **authorization header**. For more information, see _Authorization_.

### DELETE

DELETE `/api/users/:username` to delete users.

A succesful deletion will result in a reponse status of 204 (no content). You must send an **access token** to complete this request (see _Authorization_).

## Authorization

- POST `/auth` to receive an **access token** and **refresh token cookie**.
- GET `/refresh` to receive a new **access token**.
- GET `/logout` to clear the **refresh token cookie**.

Access tokens identify you as a particular user, and are required to perform any operation that modifies user data on the system.

Send a POST request to `/auth` to create a token. The POST body must include a valid username and password associated with a user that has **already been created** via a POST request to `/api/users`. Users are stored **indefinitely** on the server database, but all access and refresh tokens **expire**. Consider a POST to `/auth` as _logging in_ for a session.

Example POST body:

```
{
  "username": <valid_username>,
  "password": <valid_password>
}
```

If the POST request to `/auth` is successful, you will receive a status of 200 and an access token in the response body. This access token needs to be added to an **authorization header** before making requests to protected endpoints.

Example auth header:

```
Authorization: Bearer <token>
```

After sending a successful POST request to `/auth`, you will also receive a secure, http-only cookie containing a **refresh token**. This refresh token allows you to send GET requests to `/refresh` and receive a **new** access token. Access tokens will expire after one hour, whereas refresh tokens last one day, meaning frequent GET requests to `/refresh` can save you submitting (and exposing) credentials regularly. Once the refresh token expires, you will have to log in again at POST `/auth`.

To **log out**, send a GET request to `/logout`. This will delete the refresh token both server side and on the client cookie.

All passwords are **hashed** and **salted** before being stored. There is currently no implementation of a password recovery system, so keep this information safe! Refresh token cookies are set to secure, and so will **only be sent over HTTPS.**
