import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Paper, TextField, Typography } from "@mui/material";

import blogService from "../services/blogs";
import { useLogin, useBlogs, useBlogControl } from "./Store";

const Blog = () => {
  const [comment, setComment] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const blogs = useBlogs();
  const login = useLogin();
  const { addComment, addLike, removeBlog } = useBlogControl();

  if (!blogs) return null;

  const blog = blogs.find((blog) => blog.id === id);
  if (!blog) return null;

  //const likeStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  const handleComment = (e) => {
    e.preventDefault();
    console.log(comment);
    addComment(blog.id, comment);
  };

  return (
    <Paper sx={{ mt: 4, p: 2 }}>
      <Typography variant="h4">{blog.title}</Typography>
      <Typography variant="h6" sx={{ color: "rgba(0,0,0,0.6)" }}>
        by {blog.author}
      </Typography>
      <Typography>
        <a href={blog.url}>{blog.url}</a>
      </Typography>
      <Typography sx={{ color: "rgba(0,0,0,0.5)" }}>
        Added by {blog.user.name}
      </Typography>
      <Typography variant="h6">
        {blog.likes} likes
        {login ? (
          <Button
            onClick={() => {
              addLike(blog.id);
            }}
            sx={{ border: 1, m: 1 }}
          >
            like
          </Button>
        ) : null}
        {login && blog.user.id === login.id ? (
          <Button
            onClick={async () => {
              if (window.confirm(`Remove ${blog.name} by ${blog.author}?`)) {
                removeBlog(blog.id);
                navigate("/");
              }
            }}
            sx={{ border: 1, m: 1, color: "rgba(255,0,0,1)" }}
          >
            remove
          </Button>
        ) : null}
      </Typography>
      <Typography variant="h5">Comments</Typography>
      <form onSubmit={handleComment}>
        <TextField
          size="small"
          label="add comment"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button sx={{ ml: 1 }} type="submit" variant="contained">
          Add Comment
        </Button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </Paper>
  );
};

export default Blog;
