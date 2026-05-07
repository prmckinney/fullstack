import { useState, useEffect, useRef } from 'react'
import {
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import { Alert, AppBar, Button, Container, Toolbar, Typography } from '@mui/material'

import Notification from './components/Notification'
import Error from './components/Error'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const navigate = useNavigate()

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch {
      setNotification({ text: 'wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
    console.log('logging in with', username, password)
    navigate('/')
  }

  const handleLogout = async event => {
    event.preventDefault()

    window.localStorage.setItem('loggedBlogappUser', '')

    setUser(null)
    setUsername('')
    setPassword('')

    console.log('logged out')
    navigate('/')
  }

  const createBlog = async ({ title, author, url }) => {
    const newBlogObject = {
      title,
      author,
      url
    }

    try {
      const returnedBlog = await blogService.createNew(newBlogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification({ text: `New blog "${title}" by "${author}" added`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    }
    catch {
      setNotification({ text: `Unable to add "${title}"`, type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const updateBlog = (newBlog) => {
    setBlogs(blogs.map(blog => blog.id === newBlog.id ? newBlog : blog))
  }

  const deleteBlog = (newBlogId) => {
    setBlogs(blogs.filter(blog => blog.id !== newBlogId))
  }

  const padding = {
    padding: 5
  }

  const userLogin = (user) ? `${user.name} logged in` : null

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={style} sx="flex:1">Blog App</Typography>
          <Button color="inherit" component={Link} to="/" sx={style}>
            blogs
          </Button>
          {(user) ?
            <Button color="inherit" component={Link} to="/create" sx={style}>
              new blog
            </Button> : null
          }
          {(!user) ?
            <Button color="inherit" component={Link} to="/login" sx={style}>
              login
            </Button> :
            <Button color="inherit" onClick={handleLogout} sx={style}>
              logout
            </Button>}
        </Toolbar>
      </AppBar>

      {/* <Error message={error} /> */}
      <Notification notification={notification} />

      <Routes>
        <Route path="/" element={
          <div>
            {userLogin}
            <h2>Blogs</h2>
            {blogs.sort((a, b) => b.likes - a.likes).map((blog) => {
              const url = `blogs/${blog.id}`
              return (<li key={blog.id}><a href={url}>{blog.title} by {blog.author}</a></li>)
            })}
          </div>
        } />
        <Route path="/blogs/:id" element={
          <Blog blog={blog} user={user} updateBlog={updateBlog} deleteBlog={deleteBlog} />
        } />
        <Route path="/create" element={
          <CreateBlogForm createBlog={createBlog} />
        } />
        <Route path="/login" element={
          <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleLogin={handleLogin} />
        } />
      </Routes>
    </Container >
  )
}

export default App