const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()

const { JWT_SECRET } = require('../utils/constants')
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  const allowLogin = user
    ? await bcrypt.compare(password, user.password)
    : false
  if (!user || !allowLogin) {
    return res.status(401).send({ err: 'Invalid username or password' })
  }

  const token = await jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET
  )
  return res.json({ username: user.username, id: user._id.toString(), token })
})

module.exports = loginRouter
