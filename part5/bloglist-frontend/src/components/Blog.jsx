import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [likes, setLikes] = useState('')
  useEffect(() => {
    if (blog) setLikes(blog.likes)
  }, [blog])
  const navigate = useNavigate()

  if (!blog) return null

  const handleLike = async () => {
    const newBlog = await blogService.incrementLikes(blog)
    updateBlog(newBlog)
    setLikes(newBlog.likes)
  }

  const deleteVisibility = { display: (user && blog.user.id === user.id) ? '' : 'none' }
  const handleDelete = async () => {
    if (window.confirm(`Remove ${blog.name} by ${blog.author}?`)) {
      await blogService.deleteId(blog.id)
      deleteBlog(blog.id)
      navigate('/')
    }
  }

  console.log(`likes = ${blog.likes}`)
  console.log(`blog user = ${blog.user}`)
  console.log(`user = ${user}`)
  return (
    <div>
      <h1>{blog.author}: {blog.title}</h1>
      <li><a href={blog.url}>{blog.url}</a></li>
      <li>likes {likes} {(user) ? <button onClick={handleLike}>like</button> : null}</li>
      <li>Added by {blog.user.name}</li>
      <button style={deleteVisibility} onClick={handleDelete}>remove</button>
    </div>
  )
}

export default Blog