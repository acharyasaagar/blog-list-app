const groudByAuthorsAndCountBlogs = (blogs) => {
  let result = []
  const authorNameWithBlogCount = blogs.reduce((acc, cur) => {
    acc[cur.author] ? (acc[cur.author] += 1) : (acc[cur.author] = 1)
    return acc
  }, {})

  for (let authorName in authorNameWithBlogCount) {
    const author = {
      author: authorName,
      blogs: authorNameWithBlogCount[authorName],
    }
    result = result.concat(author)
  }

  return result
}

const groudByAuthorsAndCountLikes = (blogs) => {
  let result = []
  const authorNameWithLikesCount = blogs.reduce((acc, cur) => {
    acc[cur.author] === undefined
      ? (acc[cur.author] = cur.likes)
      : (acc[cur.author] += cur.likes)
    return acc
  }, {})

  for (let authorName in authorNameWithLikesCount) {
    const author = {
      author: authorName,
      likes: authorNameWithLikesCount[authorName],
    }
    result = result.concat(author)
  }

  return result
}

exports.dummy = () => 1
exports.totalLikes = (blogs) => blogs.reduce((acc, cur) => acc + cur.likes, 0)
exports.favoriteBlog = (blogs) => {
  return blogs.reduce((acc, cur) => {
    if (acc.likes < cur.likes) {
      return {
        title: cur.title,
        author: cur.author,
        likes: cur.likes,
      }
    }
    return { title: acc.title, author: acc.author, likes: acc.likes }
  })
}
exports.mostBlogs = (blogs) => {
  const blogAuthorsWithTotalBlogCount = groudByAuthorsAndCountBlogs(blogs)
  return blogAuthorsWithTotalBlogCount.reduce((acc, cur) => {
    if (acc.blogs < cur.blogs) {
      return cur
    }
    return acc
  })
}

exports.mostLikes = (blogs) => {
  const blogsAuthorsWithTotalLikes = groudByAuthorsAndCountLikes(blogs)
  return blogsAuthorsWithTotalLikes.reduce((acc, cur) => {
    if (acc.likes < cur.likes) {
      return cur
    }
    return acc
  })
}
