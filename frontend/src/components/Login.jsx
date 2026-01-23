import { useState } from 'react'
import api from './api'

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setIsLoading(true)
    try {
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
      <h2>Welcome Back</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Access your financial hub
      </p>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email Address</label>
        <input 
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email} 
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
        />
        
        <label htmlFor="password">Password</label>
        <input 
          id="password"
          type="password" 
          placeholder="••••••••"
          value={password} 
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
        />
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div style={{marginTop:8}}>
        <small>Don't have an account? <button onClick={onSwitch}>Register</button></small>
      </div>
      {error && <div className="error">{error}</div>}
      <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
        Need an account? 
        <button 
          onClick={onSwitch}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--accent-gold)', 
            cursor: 'pointer',
            padding: '0 0.3rem',
            marginLeft: '0.5rem',
            textDecoration: 'underline'
          }}
        >
          Create one
        </button>
      </p>
    </div>
  )
}
