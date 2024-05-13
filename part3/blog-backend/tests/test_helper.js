const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'blog0',
    author: 'author0',
    url: 'http://url0.com',
    likes: 0
  },
  {
    title: 'blog1',
    author: 'author1',
    url: 'http://url1.com',
    likes: 1
  }
]

const testUser = {
  username: 'testuser',
  name: 'Test User',
  password: 'usertest',
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: '', author: '', url: '', likes: 0
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, testUser, nonExistingId, blogsInDb, usersInDb
}
