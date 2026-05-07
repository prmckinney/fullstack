import { TextField, Button } from '@mui/material'

const LoginForm = ({ username, setUsername, password, setPassword, handleLogin }) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label='username'
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label='password'
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button type="submit" variant="contained">login</Button>
      </form>
    </div>
  )
}

export default LoginForm