module.exports = (req, res, next) => {
  const authorizationHeader = req.get('Authorization')
  if (authorizationHeader) {
    const token = authorizationHeader.split(' ')[1]
    if (token) {
      req.token = token
      return next()
    }
  }
  req.token = null
  return next()
}
