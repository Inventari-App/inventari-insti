import { GenericContainer } from "testcontainers"
import { initMongoContainer } from "../db/monogodb/init-container"
import { MongoDBContainer } from "@testcontainers/mongodb"
import mongoose from "mongoose"
import Center from "../../models/center"

describe("Test orders endpoints", () => {
  const tables = ["orders"]
  let container, mongoClient

  beforeAll(async () => {
    container = await new GenericContainer('mongo:4')
      .withExposedPorts(27017)
      .start()

    const url = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/test_db`
    mongoClient = mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  })

  beforeEach(async () => {
  })

  afterEach(async () => {

  })

  afterAll(async () => {
    mongoose.connection.close()
    await container.stop()
  })

  it("should be 1+1", () => {
    expect(1 + 1).toBe(2)
  })

  it("Should create a Center", async () => {
    const center = {
      name: "Test center",
      users: [],
    }
    const newCenter = await new Center(center).save()
    expect(newCenter).toBeDefined()
    expect(newCenter.name).toBe(center.name)
    expect(newCenter.users).toEqual(center.users)
  })

})
