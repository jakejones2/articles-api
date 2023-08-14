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

describe("topics", () => {
  test("should have supertest", () => {
    console.log(data);
    expect(true).toBe(true);
  });
});
