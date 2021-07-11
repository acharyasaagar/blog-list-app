const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../../app')
const User = require('../models/user')
const userFactory = require('./factories/userFactory')

const api = supertest(app)

const initialUserCount = 2

beforeEach(async () => {
  const fakeUsers = userFactory(initialUserCount)
  await User.deleteMany({})
  for (let fakeUser of fakeUsers) {
    const user = new User(fakeUser)
    await user.save()
  }
})

describe('Users api', () => {
  it('should retrieve all users as json', async () => {
    const { body } = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(body).toHaveLength(initialUserCount)
  })
})

describe('When creating a user', () => {
  it('should create a user when all values are valid', async () => {
    const usersBefore = await User.find({})
    expect(usersBefore).toHaveLength(initialUserCount)

    const newUser = {
      name: 'Poopy Pooperson',
      password: 'asjhflhKSFAH',
      username: 'pooperson',
    }

    const { body } = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(body.name).toBe(newUser.name)
    expect(body.username).toBe(newUser.username)
    expect(body.password).toBeUndefined()

    const usersAfter = await User.find({})
    expect(usersAfter).toHaveLength(initialUserCount + 1)
  })

  it('should fail with 400 status when password is shorter than three characters', async () => {
    const usersBefore = await User.find({})
    expect(usersBefore).toHaveLength(initialUserCount)

    const newUser = {
      name: 'Poopy Pooperson',
      password: 'AH',
      username: 'pooperson',
    }

    const { body } = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(body.err).toBe('Password cannot be shorter than 3 characters!!')

    const usersAfter = await User.find({})
    expect(usersAfter).toHaveLength(initialUserCount)
  })

  it('should fail with 400 status when username is shorter than three characters', async () => {
    const usersBefore = await User.find({})
    expect(usersBefore).toHaveLength(initialUserCount)

    const newUser = {
      name: 'Poopy Pooperson',
      password: 'AfasdfdsfsdafH',
      username: 'on',
    }

    const { body } = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(body.err).toBeDefined()

    const usersAfter = await User.find({})
    expect(usersAfter).toHaveLength(initialUserCount)
  })

  it('should fail with 400 status when username is already exists in database', async () => {
    const usersBefore = await User.find({})
    expect(usersBefore).toHaveLength(initialUserCount)

    const newUser = {
      name: 'Poopy Pooperson',
      password: 'AfasdfdsfsdafH',
      username: 'rockon',
    }

    const user = new User(newUser)
    await user.save()

    const { body } = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(body.err).toBeDefined()

    const usersAfter = await User.find({})
    expect(usersAfter).toHaveLength(initialUserCount + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
