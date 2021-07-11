const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogFactory = require('./factories/blogFactory')
const userFactory = require('./factories/userFactory')

const INITIAL_BLOG_COUNT = 2
const blogs = blogFactory(INITIAL_BLOG_COUNT)

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany()
  for (let blog of blogs) {
    await new Blog(blog).save()
  }
})

describe('Blogs Api', () => {
  it('should return all the blogs in database as json objects', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const receivedBlogs = response.body
    expect(receivedBlogs).toHaveLength(INITIAL_BLOG_COUNT)
  })

  it('should verify the uniq id of blog posts is "id"', async () => {
    const response = await api.get('/api/blogs').expect(200)
    for (let blog of response.body) {
      expect(blog.id).toBeDefined()
    }
  })

  describe('User validation when creating a blog', () => {
    it('should should create a new blog when jwt is valid', async () => {
      const user = userFactory()

      await api.post('/api/users').send(user)
      const loginResponse = await api
        .post('/api/login')
        .send({ username: user.username, password: user.password })
        .expect(200)

      const loggedUser = loginResponse.body

      expect(loggedUser.token).toBeDefined()

      const newBlog = blogFactory()
      const bearerToken = `bearer ${loggedUser.token}`

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', bearerToken)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const newBlogsInDb = await Blog.find({})
      const blogTitles = newBlogsInDb.map((blog) => blog.title)

      expect(newBlogsInDb).toHaveLength(INITIAL_BLOG_COUNT + 1)
      expect(blogTitles).toContain(newBlog.title)
    })

    it('should fail with 401 "Unauthorized" error when trying to create blog with invalid token', async () => {
      const newBlog = blogFactory()
      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set(
          'Authorization',
          'wyjkkajlkdjfpq384jkasdfdhfkjh34LKJFsadfkjhjasf235'
        )
        .expect(401)

      const newBlogsInDb = await Blog.find({})
      const blogTitles = newBlogsInDb.map((blog) => blog.title)
      expect(response.body.err).toBe('Unauthorized')
      expect(newBlogsInDb).toHaveLength(INITIAL_BLOG_COUNT)
      expect(blogTitles).not.toContain(newBlog.title)
    })

    it('should fail with 401 "Unauthorized" error when trying to create blog without token', async () => {
      const newBlog = blogFactory()
      const response = await api.post('/api/blogs').send(newBlog).expect(401)

      const newBlogsInDb = await Blog.find({})
      const blogTitles = newBlogsInDb.map((blog) => blog.title)
      expect(response.body.err).toBe('Unauthorized')
      expect(newBlogsInDb).toHaveLength(INITIAL_BLOG_COUNT)
      expect(blogTitles).not.toContain(newBlog.title)
    })
  })

  describe('Payload validation when creating a blog', () => {
    let bearerToken
    beforeEach(async () => {
      const user = userFactory()

      await api.post('/api/users').send(user)

      const loginResponse = await api
        .post('/api/login')
        .send({ username: user.username, password: user.password })

      const token = loginResponse.body.token
      bearerToken = `bearer ${token}`
    })

    it('should create blog with "likes" 0, if "likes" prop is missing from new blog', async () => {
      const newBlog = blogFactory()
      delete newBlog.likes

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', bearerToken)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsInDb = await Blog.find({})
      expect(blogsInDb).toHaveLength(INITIAL_BLOG_COUNT + 1)
      expect(response.body.likes).toBe(0)
    })

    it('should fail with 400, if "title" prop is missing from new blog', async () => {
      const newBlog = blogFactory()
      delete newBlog.title

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', bearerToken)
        .expect(400)

      const blogsInDb = await Blog.find({})
      expect(blogsInDb).toHaveLength(INITIAL_BLOG_COUNT)
    })

    it('should fail with 400, if "url" prop is missing from new blog', async () => {
      const newBlog = blogFactory()
      delete newBlog.url

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', bearerToken)
        .expect(400)

      const blogsInDb = await Blog.find({})
      expect(blogsInDb).toHaveLength(INITIAL_BLOG_COUNT)
    })
  })

  describe('Deleting and Updating a specific blog', () => {
    let bearerToken
    beforeEach(async () => {
      const user = userFactory()

      await api.post('/api/users').send(user)

      const loginResponse = await api
        .post('/api/login')
        .send({ username: user.username, password: user.password })

      const token = loginResponse.body.token
      bearerToken = `bearer ${token}`
    })

    it('should delete the blog if valid id is provided', async () => {
      const newBlog = blogFactory()
      const { body } = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', bearerToken)
        .expect(201)

      const blogId = body.id

      const newBlogs = await Blog.find({})
      expect(newBlogs).toHaveLength(INITIAL_BLOG_COUNT + 1)

      await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', bearerToken)
        .expect(204)

      const updatedBlogs = await Blog.find({})
      expect(updatedBlogs).toHaveLength(INITIAL_BLOG_COUNT)
    })

    it('should fail with 500 if id is not valid', async () => {
      const id = 'gibberish-id-here'
      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', bearerToken)
        .expect(500)

      const blogsInDb = await Blog.find({})
      expect(blogsInDb).toHaveLength(blogs.length)
    })

    it('should update the blog when valid payload and valid id is given', async () => {
      const newBlog = blogFactory()

      const { body } = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', bearerToken)
        .expect(201)

      const blogId = body.id

      const updatedBlog = blogFactory()
      delete updatedBlog.likes

      await api
        .put(`/api/blogs/${blogId}`)
        .set('Authorization', bearerToken)
        .send(updatedBlog)
        .expect(200)
    })

    it('should increse likes when patch req is done with likes object', async () => {
      const newBlog = blogFactory()

      const { body } = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', bearerToken)
        .expect(201)

      const blogId = body.id
      const payload = { likes: 'like' }

      const res = await api
        .patch(`/api/blogs/${blogId}`)
        .send(payload)
        .expect(200)

      expect(res.body.likes).toBe(newBlog.likes + 1)
    })

    it('should not update the blog when invalid id is given', async () => {
      await api
        .put('/api/blogs/gibberish-id-here')
        .send({})
        .set('Authorization', bearerToken)
        .expect(500)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
