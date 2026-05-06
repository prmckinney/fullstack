import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [expanded, setExpanded] = useState(false)
  const hideWhenExpanded = { display: expanded ? 'none' : '' }
  const showWhenExpanded = { display: expanded ? '' : 'none' }
  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const [likes, setLikes] = useState(blog.likes)
  const handleLike = async () => {
    const newBlog = await blogService.incrementLikes(blog)
    updateBlog(newBlog)
    setLikes(newBlog.likes)
  }

  const deleteVisibility = { display: (blog.user.id === user.id) ? '' : 'none' }
  const handleDelete = async () => {
    if (window.confirm(`Remove ${blog.name} by ${blog.author}?`)) {
      await blogService.deleteId(blog.id)
      deleteBlog(blog.id)
    }
  }

  console.log(`likes = ${blog.likes}`)
  console.log(`blog user = ${blog.user}`)
  console.log(`user = ${user}`)
  return (
    <div style={blogStyle}>
      <div style={hideWhenExpanded}>
        {blog.title} {blog.author}
        <button onClick={toggleExpanded}>view</button>
      </div>
      <div style={showWhenExpanded}>
        <li>{blog.title} {blog.author}<button onClick={toggleExpanded}>hide</button></li>
        <li>{blog.url}</li>
        <li>{likes} <button onClick={handleLike}>like</button></li>
        <li>{blog.user.name}</li>
        <button style={deleteVisibility} onClick={handleDelete}>delete</button>
      </div>
    </div>
  )
}

export default Blog