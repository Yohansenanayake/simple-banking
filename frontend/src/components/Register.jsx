import { useState } from 'react'
import api from './api'

export default function Register({ onLogin, onSwitch }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.register({ name, email, password })
      // after successful register, attempt login
      const user = await api.login({ email, password })
      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth">
      <h2>Create Account</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Start your banking journey today
      </p>
      <form onSubmit={handleRegister}>
        <label htmlFor="name">Full Name</label>
        <input 
          id="name"
          placeholder="John Doe"
          value={name} 
          onChange={e => setName(e.target.value)}
          disabled={isLoading}
          required
        />

        <label htmlFor="email">Email Address</label>
        <input 
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email} 
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />

        <label htmlFor="password">Password</label>
        <input 
          id="password"
          type="password" 
          placeholder="••••••••"
          value={password} 
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <div style={{marginTop: '1.5rem'}}>
        <small>Already have an account? <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Login here</button></small>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
