const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
require('express-async-errors')

/** Models */
const blogsRouter = require('./server/controllers/blogs')
const loginRouter = require('./server/controllers/login')
const testingRouter = require('./server/controllers/testing')
const usersRouter = require('./server/controllers/users')

/** Custom Middlewares */
const errorHandler = require('./server/middlewares/errorHandler')
const requestLogger = require('./server/middlewares/requestLogger')
const tokenExtractor = require('./server/middlewares/tokenExtractor')

/** Utils */
const logger = require('./server/utils/logger')
const { MONGODB_URI } = require('./server/utils/constants')

const isTestEnv = process.env.NODE_ENV === 'test'
const isDevelopmentEnv = process.env.NODE_ENV === 'development'
const not = (value) => !value

/** ----------------------------------------------- */
const app = express()

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => logger.info('Mongo connected'))
  .catch(() => logger.error('mongo not connected'))

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (isTestEnv) {
  app.use('/api/testing', testingRouter)
}

if (not(isDevelopmentEnv)) {
  const clientBuildDir = path.resolve(__dirname, 'client/build')
  app.use('/', express.static(clientBuildDir))
}

app.use(errorHandler)

module.exports = app
