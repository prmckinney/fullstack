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
  useUserControl,
  useUser,
} from "./components/Store";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import BlogList from "./components/BlogList";
import Blog from "./components/Blog";
import blogService from "./services/blogs";

const App = () => {
  const { setNotification } = useNotificationControl();
  const { initializeBlog } = useBlogControl();
  const { initializeUser, logout } = useUserControl();
  const user = useUser();

  useEffect(() => {
    initializeUser();
    initializeBlog();
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
          {user ? (
            <Button color="inherit" component={Link} to="/create" sx={style}>
              new blog
            </Button>
          ) : null}
          {!user ? (
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
          <Route path="/create" element={<CreateBlogForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
