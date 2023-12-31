const jwt = require("jsonwebtoken");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

function verifyJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .send({
        msg: "You need to send an access token to complete this request",
      });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = decoded.username;
    next();
  });
}

function authenticateUsername(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.username !== req.body.username) {
      return res.sendStatus(403);
    }
    next();
  });
}

function authenticateUsernameParameter(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.username !== req.params.username) {
      return res.sendStatus(403);
    }
    next();
  });
}

module.exports = {
  verifyJWT,
  authenticateUsername,
  authenticateUsernameParameter,
};
