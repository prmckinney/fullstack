import { useNavigate } from "react-router-dom";
import { useUsername, usePassword, useLoginControl } from "../components/Store";
import { TextField, Button } from "@mui/material";

const LoginForm = ({}) => {
  const navigate = useNavigate();
  const username = useUsername();
  const password = usePassword();
  const { setUsername, setPassword, login } = useLoginControl();

  const handleLogin = async (event) => {
    event.preventDefault();
    await login();
    navigate("/");
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button type="submit" variant="contained">
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
