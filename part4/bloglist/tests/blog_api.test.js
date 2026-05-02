const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('initial blog checks', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog has id defined not _id', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body[0]._id, undefined)
    assert.notStrictEqual(response.body[0].id, undefined)
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Me',
      url: 'https://here.com',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    assert(contents.includes('Test Blog'))
  })

  test('default like to 0', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Me',
      url: 'https://here.com',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('put fails on missing title', async () => {
    const newBlog = {
      author: 'Me',
      url: 'https://here.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('put fails on missing url', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Me',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('deleting existing blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(n => n.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

describe('update existing blog', () => {
  test('increment likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes += 1

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate).expect(201)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd[0].likes, blogToUpdate.likes)
  })

  test('set likes to fixed value', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api.put(`/api/blogs/${blogToUpdate.id}`).send({ likes: 10 }).expect(201)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd[0].likes, 10)
  })
})


after(async () => {
  await mongoose.connection.close()
})