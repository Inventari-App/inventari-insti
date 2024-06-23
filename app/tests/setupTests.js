const mongoose = require("mongoose");
const { GenericContainer } = require("testcontainers");

async function initMongoDb({ connection, container}) {
  container = await new GenericContainer("mongo")
    .withExposedPorts(27017)
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(27017);

  await mongoose.connect(`mongodb://${host}:${port}/test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection = mongoose.connection;
  return { container, connection };
}

async function closeMongoDb(container) {
  await mongoose.disconnect();
  await container.stop();
}

export { initMongoDb, closeMongoDb };
