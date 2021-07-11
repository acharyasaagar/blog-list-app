const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../../app')
const User = require('../models/user')

const api = supertest(app)

describe('The login api', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  it('should allow login when provided correct username and password', async () => {
    const credentials = {
      username: 'root',
      password: 'RootyPassword',
    }
    const hash = await bcrypt.hash(credentials.password, 10)

    const userToBeSaved = {
      ...credentials,
      name: 'Rooty Rooterson',
      password: hash,
    }

    const user = new User(userToBeSaved)

    await user.save()

    const { body } = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(user.username).toBe(userToBeSaved.username)
    expect(body.id).toBe(user._id.toString())
    expect(body.token).toBeDefined()
  })

  it('should not allow login when provided incorrect username', async () => {
    const credentials = {
      username: 'root',
      password: 'RootyPassword',
    }
    const hash = await bcrypt.hash(credentials.password, 10)

    const userToBeSaved = {
      ...credentials,
      name: 'Rooty Rooterson',
      password: hash,
    }

    const user = new User(userToBeSaved)

    await user.save()

    const { body } = await api
      .post('/api/login')
      .send({ username: 'rooty', password: 'RootyPassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(body.err).toBe('Invalid username or password')
  })

  it('should not allow login when provided incorrect password', async () => {
    const credentials = {
      username: 'root',
      password: 'RootyPassword',
    }
    const hash = await bcrypt.hash(credentials.password, 10)

    const userToBeSaved = {
      ...credentials,
      name: 'Rooty Rooterson',
      password: hash,
    }

    const user = new User(userToBeSaved)

    await user.save()

    const { body } = await api
      .post('/api/login')
      .send({ username: 'root', password: 'RotyPassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(body.err).toBe('Invalid username or password')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
