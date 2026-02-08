import { useEffect, useState } from 'react'
import api from './api'

export default function Accounts({ user, onOpenAccount }) {
  const [accounts, setAccounts] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [accountNumber, setAccountNumber] = useState('')

  useEffect(() => {
    loadAccounts()
  }, [user])

  async function loadAccounts() {
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

  async function handleCreateAccount(e) {
    e.preventDefault()
    setIsCreating(true)
    try {
      const newAccount = await api.createAccount({
        accountNumber: accountNumber || `ACC-${Date.now()}`,
        user: { id: user.id },
        balance: 0,
        status: 'ACTIVE'
      })
      setAccounts([...accounts, newAccount])
      setSuccess('Account created successfully!')
      setAccountNumber('')
      setShowCreateForm(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  const totalBalance = accounts.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0)

  return (
    <div className="accounts-container">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

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
      
      {isLoading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading your accounts...</p>
      ) : accounts.length === 0 ? (
        <div className="empty-state">
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            💼 No accounts found
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Create your first bank account to get started
          </p>
          {!showCreateForm ? (
            <button 
              className="btn-primary"
              onClick={() => setShowCreateForm(true)}
              style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}
            >
              + Create Bank Account
            </button>
          ) : (
            <form onSubmit={handleCreateAccount} className="create-account-form">
              <label htmlFor="account-number">Account Number (optional)</label>
              <input
                id="account-number"
                placeholder="e.g., ACC-CHECKING-001"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                disabled={isCreating}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Leave blank to auto-generate
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="btn-primary"
                >
                  {isCreating ? 'Creating...' : 'Create Account'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <>
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
          
          {showCreateForm && (
            <div className="create-account-form" style={{ marginTop: '2rem', maxWidth: '500px' }}>
              <h3>Create Another Account</h3>
              <form onSubmit={handleCreateAccount}>
                <label htmlFor="account-number-2">Account Number (optional)</label>
                <input
                  id="account-number-2"
                  placeholder="e.g., ACC-SAVINGS-001"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  disabled={isCreating}
                />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Leave blank to auto-generate
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="submit" 
                    disabled={isCreating}
                    className="btn-primary"
                  >
                    {isCreating ? 'Creating...' : 'Create'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {!showCreateForm && (
            <div style={{ marginTop: '2rem' }}>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="btn-secondary"
              >
                + Create Another Account
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
