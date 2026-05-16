import { useNavigate, useParams } from "react-router-dom";
import { Paper, Typography } from "@mui/material";

import { useUsers } from "./Store";

const User = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const users = useUsers();

  if (!users) return null;

  const user = users.find((user) => user.id === id);
  console.log("user ==> ", user);

  if (!user) return null;

  //const likeStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Paper sx={{ mt: 4, p: 2 }}>
      <Typography variant="h4">{user.name}</Typography>
      <Typography variant="h6">Added Blogs</Typography>
      <ul>
        {user.blogs.map((blog) => (
          <li>{blog.title}</li>
        ))}
      </ul>
    </Paper>
  );
};

export default User;
