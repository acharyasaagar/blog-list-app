const logger = require('../utils/logger')

module.exports = (req, res, next) => {
  const isBodyEmpty = Object.getOwnPropertyNames(req.body).length === 0
  logger.log(
    `${req.method} ${req.url} ${isBodyEmpty ? '' : JSON.stringify(req.body)}`
  )
  next()
}
