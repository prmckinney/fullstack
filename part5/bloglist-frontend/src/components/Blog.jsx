import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { Button, Paper, Typography } from '@mui/material'

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

  const handleDelete = async () => {
    if (window.confirm(`Remove ${blog.name} by ${blog.author}?`)) {
      await blogService.deleteId(blog.id)
      deleteBlog(blog.id)
      navigate('/')
    }
  }

  //const likeStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Paper sx={{ mt: 4, p: 2 }}>
      <Typography variant="h4">{blog.title}</Typography>
      <Typography variant="h6" sx={{ color: 'rgba(0,0,0,0.6)' }}>by {blog.author}</Typography>
      <Typography><a href={blog.url}>{blog.url}</a></Typography>
      <Typography sx={{ color: 'rgba(0,0,0,0.5)' }}>Added by {blog.user.name}</Typography>
      <Typography variant="h6">
        {likes} likes
        {(user) ? <Button onClick={handleLike} sx={{ border: 1, m: 1 }}>like</Button> : null}
        {(user && blog.user.id === user.id) ? <Button onClick={handleDelete} sx={{ border: 1, m: 1, color: 'rgba(255,0,0,1)' }}>remove</Button> : null}
      </Typography>
    </Paper>
  )
}

export default Blog