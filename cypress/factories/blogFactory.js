const faker = require('faker')

const createBlog = () => {
  const author = faker.name.findName()
  const likes = faker.random.number({
    min: 1,
    max: 9,
  })
  const url = faker.internet.url()
  const title = faker.lorem.sentence()
  return { author, likes, url, title }
}

module.exports = (n = 1) => {
  if (n > 1) {
    let blogs = []
    for (let i = 0; i < n; i++) {
      const blog = createBlog()
      blogs = blogs.concat(blog)
    }
    return blogs
  }
  return createBlog()
}
