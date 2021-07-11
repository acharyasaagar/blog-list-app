const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()

const User = require('../models/user')
const { JWT_SECRET } = require('../utils/constants')

usersRouter.get('/', async (req, res) => {
  res.json(
    await User.find({}).populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
      id: 1,
    })
  )
})

usersRouter.post('/', async (req, res) => {
  const { name, password: plainPassword, username } = req.body
  if (plainPassword.length < 3 || username.length < 3) {
    return res
      .status(400)
      .json({ err: 'Password cannot be shorter than 3 characters!!' })
  }
  const password = await bcrypt.hash(plainPassword, 10)
  const user = new User({ name, password, username })
  const savedUser = await user.save()
  const token = await jwt.sign(
    { id: savedUser.id, username: savedUser.username },
    JWT_SECRET
  )
  return res.status(201).json({
    id: savedUser._id.toString(),
    name: savedUser.name,
    username: savedUser.username,
    token,
  })
})

usersRouter.delete('/:id', async (req, res) => {
  const removed = await User.findByIdAndRemove(req.params.id)
  return res.status(204).send(removed)
})

module.exports = usersRouter
