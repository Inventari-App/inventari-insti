import path from "path"
import { GenericContainer, StartedNetwork } from "testcontainers"

export async function initApiContainer(
  name,
  network,
  username,
  password,
  database,
  nodePort,
  mongoPort,
  mongoHost
) {
  const apiContainer = await new GenericContainer("node:18.17")
    .withName(name)
    .withNetwork(network)
    .withExposedPorts(nodePort)
    .withEnvironment({
      PORT,
      MONGO_HOST: mongoHost,
      MONGO_PORT: mongoPort.toString(),
      MONGO_DB: database,
      MONGO_USER: username,
      MONGO_PASSWORD: password,
      MONGO_CONN: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/?directConnection=true`,
      ENV_STATE: "test",
    })
    .withBindMounts([
      {
        source: path.join(__dirname, "../node_modules"),
        target: "/node_modules",
        mode: "ro",
      },
      {
        source: path.join(__dirname, "../package.json"),
        target: "/package.json",
      },
      {
        source: path.join(__dirname, "./"),
        target: "/",
        mode: "ro",
      },
    ])
    .withCommand([
      "sh",
      "-c",
      "npm run dev",
    ])
    .start()

  return apiContainer
}
