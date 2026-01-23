import { useState } from 'react'
import api from './api'

export default function Register({ onLogin, onSwitch }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleRegister(e) {
    e.preventDefault()
    try {
      await api.register({ name, email, password })
      // after successful register, attempt login
      const user = await api.login({ email, password })
      onLogin(user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth">
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <div style={{marginTop:8}}>
        <small>Already have an account? <button onClick={onSwitch}>Login</button></small>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
