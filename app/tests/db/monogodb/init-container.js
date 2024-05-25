import { GenericContainer, Network, StartedNetwork } from "testcontainers"

// Connect to Mongo
export async function initMongoContainer(
    name,
    username,
    password,
    hostPort,
    containerPort
) {
    const mongodbContainer = await new GenericContainer("mongo:4")
        .withName(name)
        .withEnvironment({
            MONGO_INITDB_ROOT_USERNAME: username,
            MONGO_INITDB_ROOT_PASSWORD: password,
        })
        .withExposedPorts({ container: containerPort, host: hostPort })
        .start()

    return mongodbContainer
}

