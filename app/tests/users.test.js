const request = require('supertest')
const Centre = require('../models/center')
const User = require('../models/user')
const { globalSetup, globalTeardown } = require('./globalSetup')

describe('Users', () => {
  let container
  let app

  beforeAll(async () => {
    const setup = await globalSetup()
    app = setup.app
    container = setup.container
  })

  afterAll(async () => {
    await globalTeardown(container)
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

  test('should create a non admin User', async () => {
    const center = await Centre.findOne({ name: 'Center 1' })
    await request(app)
      .post('/register')
      .send({
        centerId: center.id,
        email: 'normal@user.com',
        username: 'normal@user.com',
        name: 'John',
        surname: 'Doe',
        password: 'password'
      })

    const user = await User.findOne({ email: 'normal@user.com' })
    expect(user).not.toBeNull()
    expect(user.name).toBe('John')
    expect(user.isAdmin).toBe(false)
  })
})
