import { useEffect, useState } from 'react'
import api from './api'

export default function Accounts({ user, onOpenAccount }) {
  const [accounts, setAccounts] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true)
        const data = await api.getAccountsByUser(user.id)
        setAccounts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [user])

  const totalBalance = accounts.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0)

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Balance</p>
        <div style={{
          background: 'linear-gradient(120deg, var(--accent-gold) 0%, var(--accent-blue-light) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '2.8rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: '700'
        }}>
          ${totalBalance.toFixed(2)}
        </div>
      </div>

      <h2 style={{ marginBottom: '2rem' }}>Your Accounts</h2>
      
      {error && <div className="error">{error}</div>}
      
      {isLoading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading your accounts...</p>
      ) : accounts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No accounts found</p>
      ) : (
        <ul className="accounts">
          {accounts.map(a => (
            <li key={a.id} onClick={() => onOpenAccount(a)}>
              <strong>{a.accountNumber}</strong>
              <div>Account Balance</div>
              <div style={{ fontSize: '1.2rem', color: 'var(--accent-gold)', fontWeight: '600' }}>
                ${parseFloat(a.balance || 0).toFixed(2)}
              </div>
              <button type="button" style={{ marginTop: 'auto' }}>
                View Details →
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
