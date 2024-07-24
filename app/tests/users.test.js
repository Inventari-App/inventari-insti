const { initMongoDb, closeMongoDb } = require('./setupTests')
const appRouter = require('../routers/appRouter')
const request = require('supertest')
const db = require('../database')
const configureApp = require('../config')
const { handleRouteError, handleError } = require('../middleware')
const Centre = require('../models/center')
const User = require('../models/user')

describe('Users', () => {
  let container
  let connection
  let app

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    const setup = await initMongoDb({ container, connection })
    container = setup.container
    connection = setup.connection

    const sessionConfig = db.setupDatabase(connection)
    app = configureApp(sessionConfig)

    app.use(appRouter())
    app.use(handleRouteError)
    app.use(handleError)
  })

  afterAll(async () => {
    await closeMongoDb(container)
  })

  test('should create a center and an Admin user', async () => {
    await request(app)
      .post('/register-center')
      .send({
        center: 'Center 1',
        name: 'John',
        surname: 'Doe',
        email: 'test@test.com',
        password: 'password',
        token: 'token'
      })

    const center = await Centre.findOne({ name: 'Center 1' })
    expect(center).not.toBeNull()
    expect(center.name).toBe('Center 1')

    const user = await User.findOne({ email: 'test@test.com' })
    expect(user).not.toBeNull()
    expect(user.name).toBe('John')
    expect(user.isAdmin).toBe(true)
  })
})
