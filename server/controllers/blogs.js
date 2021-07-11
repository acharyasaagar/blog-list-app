const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

const { JWT_SECRET } = require('../utils/constants')

blogsRouter.get('/', async (req, res) => {
  try {
    return res.json(
      await Blog.find({}).populate('user', { id: 1, name: 1, username: 1 })
    )
  } catch (err) {
    return res.status(400).send({ err: 'error occured' })
  }
})

blogsRouter.post('/', async (req, res) => {
  const decodedToken = req.token
    ? await jwt.verify(req.token, JWT_SECRET)
    : null
  if (!(req.token && decodedToken)) {
    return res.status(401).send({ err: 'Unauthorized' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res
      .status(404)
      .send({ err: 'non-existing user can not create a blog' })
  }
  const { title, author, likes, url } = req.body

  if (!title || !author || !url) {
    return res.status(400).end()
  }

  const newBlog = {
    title,
    author,
    likes: likes || 0,
    url,
    user: user._id,
  }
  const blog = new Blog(newBlog)
  const { _id } = await blog.save()
  user.blogs = user.blogs.concat(_id)
  await user.save()
  const savedBlog = await Blog.findOne({ _id }).populate('user', {
    id: 1,
    name: 1,
    username: 1,
  })
  return res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = req.token
    ? await jwt.verify(req.token, JWT_SECRET)
    : null
  if (!(req.token && decodedToken)) {
    return res.status(401).send({ err: 'Unauthorized' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(req.params.id)

  if (blog) {
    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndRemove(req.params.id)
      user.blogs = user.blogs.filter(
        (blog) => blog._id.toString() === req.params.id
      )
      return res.status(204).end()
    }
    return res.status(401).send({ err: 'Unauthorized' })
  }
  return res.status(500).send({ err: 'Server Error' })
})

blogsRouter.put('/:id', async (req, res) => {
  const payload = {
    ...req.body,
  }
  const decodedToken = req.token
    ? await jwt.verify(req.token, JWT_SECRET)
    : null
  if (!(req.token && decodedToken)) {
    return res.status(401).send({ err: 'Unauthorized' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(req.params.id)

  // likes should not be changed by put
  payload.likes = blog.likes
  payload.user = user._id.toString()

  if (blog) {
    if (blog.user.toString() === user._id.toString()) {
      const { _id } = await Blog.findByIdAndUpdate(req.params.id, payload, {
        new: true,
      })
      const updatedBlog = await Blog.findOne({ _id }).populate('user', {
        id: 1,
        name: 1,
        username: 1,
      })
      return res.json(updatedBlog)
    }
    return res.status(401).send({ err: 'Unauthorized' })
  }
  return res.status(500).send({ err: 'Server Error' })
})

blogsRouter.patch('/:id', async (req, res) => {
  const id = req.params.id
  const body = { ...req.body }
  const blog = await Blog.findById(id)

  if (blog) {
    if (body.likes === 'like') {
      blog.likes += 1
    }
    if (body.likes === 'unlike') {
      blog.likes -= 1
    }
    await blog.save()

    const updatedBlog = await Blog.findOne({ _id: blog._id }).populate('user', {
      id: 1,
      name: 1,
      username: 1,
    })
    return res.json(updatedBlog)
  }
  return res.status(404).send({ err: 'Blog does not exist' })
})

module.exports = blogsRouter
