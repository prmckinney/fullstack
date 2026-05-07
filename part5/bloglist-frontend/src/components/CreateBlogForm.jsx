import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleCreateBlog = async event => {
    event.preventDefault()

    await createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <div>
      <h2>Add new blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <TextField
            label='title'
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            style={{ marginBottom: 10 }}
          />
        </div>
        <div>
          <TextField
            label='author'
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            style={{ marginBottom: 10 }}
          />
        </div>
        <div>
          <TextField
            label='url'
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            style={{ marginBottom: 10 }}
          />
        </div>
        <Button type="submit" variant="contained">create</Button>
      </form>
    </div>
  )
}

export default CreateBlogForm