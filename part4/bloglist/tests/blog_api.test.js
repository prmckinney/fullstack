const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const blog = require('../models/blog')

const api = supertest(app)

let token

describe('blog checks', () => {
  beforeEach(async () => {
    // Initialize User
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    const userLogin = {
      username: 'root',
      password: 'sekret'
    }

    const login = await api
      .post('/api/login')
      .send(userLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    token = login.body.token
    const userId = login.body.id

    // Initialize Blogs
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs.map(blog => ({ ...blog, user: userId })))
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
    console.log(response.body)
  })

  test('blog has id defined not _id', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body[0]._id, undefined)
    assert.notStrictEqual(response.body[0].id, undefined)
  })


  describe('addition of a new blog', () => {
    test('blog addition fails without authorization', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Me',
        url: 'https://here.com',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })
  })

  describe('deleting existing blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(n => n.id)
      assert(!ids.includes(blogToDelete.id))
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('fails with status code 400 if not owner of the note', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const login = await api
        .post('/api/login')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      token = login.body.token

      const blogToDelete = blogsAtStart[0]

      const result = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
      assert(result.body.error.includes('UserId not the same as BlogId'))

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(n => n.id)
      assert(ids.includes(blogToDelete.id))
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })


    test('fails with status code 401 if not authorized', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(n => n.id)
      assert(ids.includes(blogToDelete.id))
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
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
})

describe('user checks', () => {
  describe('user creation', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert(result.body.error.includes('expected `username` to be unique'))

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'me',
        name: 'Superuser',
        password: 'salainen'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert(result.body.error.includes('username') && result.body.error.includes('shorter'))

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: '12'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert(result.body.error.includes('`password` too short'))

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

  describe('user login', () => {
    test('login passes and returns token with correct username and password', async () => {
      const userLogin = {
        username: 'root',
        password: 'sekret'
      }

      const result = await api
        .post('/api/login')
        .send(userLogin)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      assert(result.body.token)
    })

    test('login fails and returns correct error message with incorrect username', async () => {
      const userLogin = {
        username: 'route',
        password: 'sekret'
      }

      const result = await api
        .post('/api/login')
        .send(userLogin)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      assert(!result.body.token)
      assert.strictEqual(result.body.error, 'invalid username or password')
    })

    test('login fails and returns correct error message with incorrect password', async () => {
      const userLogin = {
        username: 'root',
        password: 'secret'
      }

      const result = await api
        .post('/api/login')
        .send(userLogin)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      assert(!result.body.token)
      assert.strictEqual(result.body.error, 'invalid username or password')
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})