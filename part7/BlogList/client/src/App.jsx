import { useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  Alert,
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

import Notification from "./components/Notification";
import {
  useBlogControl,
  useNotificationControl,
  useLoginControl,
  useLogin,
  useUserControl,
} from "./components/Store";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import BlogList from "./components/BlogList";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import UserList from "./components/UserList";
import User from "./components/User";

const App = () => {
  const { setNotification } = useNotificationControl();
  const { initializeLogin, logout } = useLoginControl();
  const { initializeBlog } = useBlogControl();
  const { initializeUsers } = useUserControl();
  const login = useLogin();

  useEffect(() => {
    initializeLogin();
    initializeBlog();
    initializeUsers();
  }, []);

  const navigate = useNavigate();

  const padding = {
    padding: 5,
  };

  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  function ErrorFallback({ error }) {
    return (
      <div role="alert">
        <p>Something went wrong :(</p>
        <pre style={{ color: "red" }}>{error.message}</pre>
      </div>
    );
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={style} sx="flex:1">
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={style}>
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users" sx={style}>
            users
          </Button>
          {login ? (
            <Button color="inherit" component={Link} to="/create" sx={style}>
              new blog
            </Button>
          ) : null}
          {!login ? (
            <Button color="inherit" component={Link} to="/login" sx={style}>
              login
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={async () => {
                logout();
                navigate("/");
              }}
              sx={style}
            >
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Notification />
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/create" element={<CreateBlogForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
