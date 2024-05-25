import { Network } from "testcontainers"
import { initMongoContainer } from "./db/mongodb/init-container"
import { initApiContainer } from "./init-api-container"

const USERNAME = "test_user"
const PASSWORD = "test_password"
const DATABASE_NAME = "test_db"
const NODE_TEST_HOST = "test_node_api"
const NODE_TEST_PORT = 8082
const MONGO_TEST_CONTAINER_PORT = 27017
const MONGO_TEST_HOST_PORT = 27018
const MONGO_TEST_HOST = "test_mongo"

export default async function setupTestEnvironment(
  _globalConfig,
  _projectConfig
) {

const network = await new Network().start()

const mongoContainer = await initMongoContainer(
  MONGO_TEST_HOST,
  network,
  USERNAME,
  PASSWORD,
  MONGO_TEST_HOST_PORT,
  MONGO_TEST_CONTAINER_PORT
)

const apiContainer = await initApiContainer(
  NODE_TEST_HOST,
  network,
  USERNAME,
  PASSWORD,
  DATABASE_NAME,
  NODE_TEST_PORT,
  MYSQL_TEST_PORT,
  MYSQL_TEST_HOST,
  MONGO_TEST_CONTAINER_PORT,
  MONGO_TEST_HOST
)

const apiUrl = `http://${apiContainer.getHost()}:${apiContainer.getMappedPort(NODE_TEST_PORT)}`
