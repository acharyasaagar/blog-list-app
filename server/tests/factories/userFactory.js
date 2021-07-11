const faker = require('faker')
const lodash = require('lodash')

const createFakeUser = () => {
  const name = faker.name.findName()
  const username = faker.internet.userName()
  const password = faker.internet.password()
  return { name, username, password }
}

module.exports = (n = 1) => {
  if (n > 1) {
    let users = []
    for (let i = 0; i < n; i++) {
      const user = createFakeUser()
      users = users.concat(user)
    }
    return lodash.uniqBy(users, 'username')
  }
  return createFakeUser()
}
