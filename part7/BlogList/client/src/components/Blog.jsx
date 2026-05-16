import { useNavigate, useParams } from "react-router-dom";
import { Button, Paper, Typography } from "@mui/material";

import blogService from "../services/blogs";
import { useLogin, useBlogs, useBlogControl } from "./Store";

const Blog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const blogs = useBlogs();
  const login = useLogin();
  const { addLike, removeBlog } = useBlogControl();

  if (!blogs) return null;

  const blog = blogs.find((blog) => blog.id === id);
  console.log("blog ==> ", blog);

  if (!blog) return null;

  //const likeStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

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
    </Paper>
  );
};

export default Blog;
