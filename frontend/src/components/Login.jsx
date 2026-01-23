import { useState } from 'react'
import api from './api'

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const user = await api.login({ email, password })
      onLogin(user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
