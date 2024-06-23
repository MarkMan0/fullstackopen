const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  let TOKEN = ''
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await api.post('/api/users').send(helper.testUser)
    const login = await api.post('/api/login').send({ username: helper.testUser.username, password: helper.testUser.password })
    TOKEN = `Bearer ${login.body.token}`

    const postBlog = async (blog) => {
      return await api
        .post('/api/blogs')
        .set('authorization', TOKEN)
        .send(blog)
    }

    const promises = helper.initialBlogs.map(b => postBlog(b))
    await Promise.all(promises)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await helper.blogsInDb()
    assert.strictEqual(response.length, helper.initialBlogs.length)
  })

  test('blogs are created by user', async () => {
    const blogs = await helper.blogsInDb()
    const users = await helper.usersInDb()

    for (const blog of blogs) {
      assert.strictEqual(blog.user.toString(), users[0].id)
    }
  })

  test('user has all blogs', async () => {
    const blogs = await helper.blogsInDb()
    const users = await helper.usersInDb()

    const blogIds = blogs.map(b => b.id).sort()
    const userBlogs = users[0].blogs.map(b => b.toString()).sort()

    assert.deepEqual(blogIds, userBlogs)
  })

  test('blog has \'id\' parameter', async () => {
    const response = await helper.blogsInDb()
    const ids = response.map(b => b.id)
    assert.ok(ids[0] !== ids[1])
  })

  test('can create blog', async () => {
    const blog = {
      title: 'blog2',
      author: 'author2',
      url: 'http://url2.com',
      likes: 2
    }
    const response = await api
      .post('/api/blogs')
      .set('authorization', TOKEN)
      .send(blog)
      .expect(201)

    assert.strictEqual(response.body.title, blog.title)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
    const titles = blogs.map(n => n.title)
    assert(titles.includes('blog2'))
  })

  test('cant create without token', async () => {
    const blog = {
      title: 'blog222',
      author: 'author222',
      url: 'http://url222.com',
      likes: 222
    }
    const response = await api
      .post('/api/blogs')
      .send(blog)
      .expect(401)

    assert(response.body.error.includes('token invalid'))

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })

  test('adding without url fails', async () => {
    const blog = {
      title: 'bloginvalid',
      author: 'authorinvalid',
      //url: "http://urlinvalid.com",
    }

    await api
      .post('/api/blogs')
      .set('authorization', TOKEN)
      .send(blog)
      .expect(400)

    const response = await helper.blogsInDb()
    assert.strictEqual(response.length, helper.initialBlogs.length)
  })

  test('adding without title fails', async () => {
    const blog = {
      //title: "bloginvalid",
      author: 'authorinvalid',
      url: 'http://urlinvalid.com',
    }

    await api
      .post('/api/blogs')
      .set('authorization', TOKEN)
      .send(blog)
      .expect(400)

    const response = await helper.blogsInDb()
    assert.strictEqual(response.length, helper.initialBlogs.length)
  })

  test('likes are 0 by default', async () => {
    const blog = {
      title: 'blog2',
      author: 'author2',
      url: 'http://url2.com'
    }
    const response = await api
      .post('/api/blogs')
      .set('authorization', TOKEN)
      .send(blog)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog can be deleted by their user', async () => {
    const blogs = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set('authorization', TOKEN)
      .expect(204)

    const blogs2 = await helper.blogsInDb()
    assert.strictEqual(blogs2.length, helper.initialBlogs.length - 1)
    assert(!blogs2.map(b => b.title).includes(blogs[0].title))
  })

  test('blog cant be deleted by a different user', async () => {
    const user2 = {
      username: 'user2',
      password: 'user2',
      name: 'user 2',
    }
    await api.post('/api/users').send(user2)
    const login2 = await api.post('/api/login').send({ username: user2.username, password: user2.password })
    const token2 = `Bearer ${login2.body.token}`

    const blog = {
      title: 'blogdel',
      author: 'authordel',
      url: 'http://urldel.com'
    }

    const blogresponse = await api
      .post('/api/blogs')
      .set('authorization', TOKEN)
      .send(blog)

    const blogs = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${blogresponse.body.id}`)
      .set('authorization', token2)
      .expect(401)

    const blogs2 = await helper.blogsInDb()
    assert.strictEqual(blogs2.length, blogs.length)
  })

  test('can update blog', async () => {
    const blogs = await helper.blogsInDb()
    const blog2 = { ...blogs[0], likes: 666 }
    await api
      .put(`/api/blogs/${blog2.id}`)
      .send(blog2)
      .expect(200)

    const blogs2 = await helper.blogsInDb()
    const updated = blogs2.find(b => b.id === blog2.id)
    assert.strictEqual(updated.likes, 666)
  })
})

after(async () => {
  await mongoose.connection.close()
})
