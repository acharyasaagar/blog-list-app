const chalk = require('chalk')

exports.info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(chalk.blue(...params))
  }
}

exports.error = (...params) => {
  console.log(chalk.yellow(...params))
}

exports.log = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}
