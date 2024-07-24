const { initMongoDb, closeMongoDb } = require('./setupTests')
const appRouter = require('../routers/appRouter')
const db = require('../database')
const configureApp = require('../config')
const { handleRouteError, handleError } = require('../middleware')

let container
let connection
let app

async function globalSetup () {
  process.env.NODE_ENV = 'test'
  const setup = await initMongoDb({ container, connection })
  container = setup.container
  connection = setup.connection

  const sessionConfig = db.setupDatabase(connection)
  app = configureApp(sessionConfig)

  app.use(appRouter())
  app.use(handleRouteError)
  app.use(handleError)

  return { app, container }
}

async function globalTeardown (container) {
  await closeMongoDb(container)
}

module.exports = { globalSetup, globalTeardown }
