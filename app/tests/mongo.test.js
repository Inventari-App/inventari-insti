const { initMongoDb, closeMongoDb } = require("./setupTests");

describe("MongoDB", () => {
  let container;
  let connection;

  beforeAll(async () => {
    const setup = await initMongoDb({ container, connection });
    container = setup.container;
    connection = setup.connection;
  })

  afterAll(async () => {
    await closeMongoDb(container)
  })

  test("should connect to MongoDB", async () => {
    expect(connection.readyState).toBe(1);
  })

  test("should disconnect from MongoDB", async () => {
    await closeMongoDb(container)
    expect(connection.readyState).toBe(0);
  })
})
