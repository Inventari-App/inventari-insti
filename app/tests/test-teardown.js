import mongoose from "mongoose"
import { GenericContainer } from "testcontainers"

async function startMongoContainer() {
  const container = await new GenericContainer('mongo:4')
    .withExposedPorts(27017)
    .start()

  return container
}

async function startDbConnection(container) {
  const url = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/test_db`
  const mongoClient = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  return { mongoClient }
}

async function closeDbConnection(container) {
  mongoose.connection.close()
  await container.stop()
}

export { startMongoContainer, startDbConnection, closeDbConnection }
