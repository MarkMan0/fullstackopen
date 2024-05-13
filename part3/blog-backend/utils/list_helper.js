const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const total_likes = (blogs) => {
  return _.sumBy(blogs, (blog) => blog.likes)
}

const favoriteBlog = (blogs) => {
  if (!_.isArray(blogs) || blogs.length === 0) return null
  return _.maxBy(blogs, (blog) => blog.likes)
}

const mostBlogs = (blogs) => {
  if (!_.isArray(blogs) || blogs.length === 0) return null
  const cnt = _.countBy(blogs, (blog) => blog.author)
  const author = _.maxBy(_.keys(cnt), (author) => cnt[author])
  return {
    'author': author,
    'blogs': cnt[author]
  }
}

const mostLikes = (blogs) => {
  if (!_.isArray(blogs) || blogs.length === 0) return null

  const cnt = _.reduce(blogs, (prev, blog) => {
    prev[blog.author] = blog.likes + (prev[blog.author] ? prev[blog.author] : 0)
    return prev
  }, {})

  const author = _.maxBy(_.keys(cnt), (author) => cnt[author])
  return {
    'author': author,
    'likes': cnt[author]
  }

}

module.exports = {
  dummy,
  total_likes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
