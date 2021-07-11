const testingRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (req, res) => {
  try {
    await Blog.deleteMany({})
    await User.deleteMany({})
    res.status(204).end()
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' })
  }
})

module.exports = testingRouter
