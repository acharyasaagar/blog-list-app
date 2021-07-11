const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../utils/constants')

module.exports = async (req, res, next) => {
  if (req.token) {
    const decoded = await jwt.verify(req.token, JWT_SECRET)
    if (decoded && decoded.id) {
      req.user = decoded
      return next()
    }
  }
  return next()
}
