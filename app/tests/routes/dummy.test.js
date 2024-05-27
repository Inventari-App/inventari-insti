import { GenericContainer } from "testcontainers"
import Center from "../../models/center"
import { startDbConnection, closeDbConnection, startMongoContainer } from "../test-teardown.js"
import request from "supertest"
import express from "express"
import router from "../../routers/users"
import userRoutes from "../../routers/users"

describe("Test orders endpoints", () => {
  let container, app, router
  const tables = ["orders"]

  beforeAll(async () => {
    container = await startMongoContainer()
    startDbConnection(container)
    router = express.Router();
    router.use("/", userRoutes);
  })

  beforeEach(async () => {
  })

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key]; g,
        await collection.deleteMany();
    }
  })

  afterAll(async () => {
    closeDbConnection(container)
  })

  it("should be 1+1", () => {
    expect(1 + 1).toBe(2)
  })

  it("Should create a Center", function(done) {
    request(router)
      .get("/register-center")
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        done()
      })
  })

})
