const request = require("supertest");
const app = require("../app");

function authButterBridge() {
  const postBody = { username: "butter_bridge", password: "wA!!li43" };
  return request(app)
    .post("/auth")
    .send(postBody)
    .then(({ body: { accessToken } }) => {
      return accessToken;
    });
}

module.exports = { authButterBridge };
