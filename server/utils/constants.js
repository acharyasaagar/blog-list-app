/**
 * all the values that won't change in the application will be here
 * including environment variables
 */
require('dotenv').config()

exports.PORT = process.env.PORT || 8080
exports.MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI
exports.JWT_SECRET = process.env.JWT_SECRET || 'a'
