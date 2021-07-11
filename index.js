const http = require('http')

const app = require('./app')
const logger = require('./server/utils/logger')
const { PORT } = require('./server/utils/constants')

const server = http.createServer(app)
server.listen(PORT, () => logger.info(`Server listening on port ${PORT}`))

/** handle graceful shutdown */
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit()
  })
})
