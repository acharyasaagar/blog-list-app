const blogs = require('./blogs')
const listHelper = require('../utils/list_helper')
const oneBlog = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 77,
    __v: 0,
  },
]

test('dummy returns 1', () => {
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('should be sum of all blogs when list with many blogs is passed: 1111 likes', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
  test('should equal to the like of the blog itself when list has only one blog', () => {
    const result = listHelper.totalLikes(oneBlog)
    expect(result).toBe(oneBlog[0].likes)
    expect(result).toBe(77)
  })
})

describe('favorite blog', () => {
  test('should return blog with most likes', () => {
    const favBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(favBlog)
  })
})

describe('most blogs', () => {
  it('should return the author object with most blog counts', () => {
    const authorWithMostBlogs = {
      author: 'Robert C. Martin',
      blogs: 3,
    }
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(authorWithMostBlogs)
  })
})

describe('most likes', () => {
  it('should return the author object with most like counts', () => {
    const authorWithMostLikes = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual(authorWithMostLikes)
  })
})
