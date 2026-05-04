import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Error from './components/Error'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
      setError('wrong credentials')
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
    console.log('logging in with', username, password)
  }

  const handleLogout = async event => {
    event.preventDefault()

    window.localStorage.setItem('loggedBlogappUser', '')

    setUser(null)
    setUsername('')
    setPassword('')

    console.log('logged out')
  }

  const handleCreateBlog = async event => {
    event.preventDefault()
    const newBlogObject = {
      title,
      author,
      url
    }

    try {
      const returnedBlog = await blogService.createNew(newBlogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`New blog "${newBlogObject.title}" by "${newBlogObject.author}" added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    }
    catch {
      setError(`Unable to add "${newBlogObject.title}"`)
      setTimeout(() => {
        setError(null)
      }, 5000)

    }
  }

  return (
    <div>
      <Error message={error} />
      <Notification message={notification} />

      {!user && LoginForm(username, setUsername, password, setPassword, handleLogin)}
      {user && (
        <div>
          <p>{user.name} logged in
            <button onClick={handleLogout}>Logout</button>
          </p>
          <h2>Blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
          {CreateBlogForm(title, setTitle, author, setAuthor, url, setUrl, handleCreateBlog)}
        </div>
      )}
    </div>
  )
}

export default App