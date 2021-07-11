/* eslint-disable indent */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Handling error ', err.message ? err.message : err)
  }
  if (err instanceof Error) {
    switch (err.name) {
      case 'ValidationError':
        return res
          .status(400)
          .json({ err: err.message.split(/\sfailed:\s/)[1] })
      case 'JsonWebTokenError':
        return res.status(401).json({ err: 'Invalid token' })
      default:
        return res.status(500).json({ err: 'Internal Server Error' })
    }
  }
}
