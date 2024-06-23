const { initMongoDb, closeMongoDb } = require("./setupTests");
const express = require("express");
const request = require("supertest");
const app = express();
const appRouter = require("../routers/users.js");

describe("Users", () => {
  let container;
  let connection;

  beforeAll(async () => {
    const setup = await initMongoDb({ container, connection });
    container = setup.container;
    connection = setup.connection;
    app.use(appRouter());
  })

  afterAll(async () => {
    await closeMongoDb(container)
  })

  test("should create a center", async () => {
    const centerName = "Center 1";
    const token = "token";
    const name = "Name";
    const surname = "Surname";
    const email = "test@test.com"
    const password = "password";
    request(app)
      .post("/register")
      .send({ center: centerName, name, surname, email, password, token })
  })
})
