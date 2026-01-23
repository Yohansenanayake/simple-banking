import { useEffect, useState } from 'react'
import api from './api'

export default function AccountDetail({ account, onBack }) {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [account])

  async function loadTransactions() {
    try {
      const tx = await api.getTransactionsForAccount(account.id)
      setTransactions(tx)
    } catch (err) {
      setError(err.message)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  async function doDeposit(e) {
    e.preventDefault()
    clearMessages()
    setIsLoading(true)
    try {
      await api.deposit({ accountId: account.id, amount: amount, description: desc })
      setSuccess('Deposit successful')
      await loadTransactions()
      setAmount('')
      setDesc('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function doWithdraw(e) {
    e.preventDefault()
    clearMessages()
    setIsLoading(true)
    try {
      await api.withdraw({ accountId: account.id, amount: amount, description: desc })
      setSuccess('Withdrawal successful')
      await loadTransactions()
      setAmount('')
      setDesc('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function doTransfer(e) {
    e.preventDefault()
    clearMessages()
    setIsLoading(true)
    try {
      await api.transfer({ 
        fromAccountId: account.id, 
        toAccountId: Number(toAccount), 
        amount: amount, 
        description: desc 
      })
      setSuccess('Transfer successful')
      await loadTransactions()
      setAmount('')
      setDesc('')
      setToAccount('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="account-detail">
      <button className="back-button" onClick={onBack} style={{ marginBottom: '2rem' }}>
        Back to Accounts
      </button>

      <div className="account-header">
        <div className="account-info">
          <h2>Account Details</h2>
          <div className="balance-display">
            ${parseFloat(account.balance || 0).toFixed(2)}
          </div>
          <div className="account-number">
            {account.accountNumber}
          </div>
        </div>
        
        <div className="account-info">
          <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
          <div className="account-actions">
            <button onClick={() => document.getElementById('depositForm').scrollIntoView({ behavior: 'smooth' })}>
              💰 Deposit Funds
            </button>
            <button onClick={() => document.getElementById('withdrawForm').scrollIntoView({ behavior: 'smooth' })}>
              📤 Withdraw Funds
            </button>
            <button onClick={() => document.getElementById('transferForm').scrollIntoView({ behavior: 'smooth' })}>
              🔄 Transfer Money
            </button>
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div id="depositForm" className="form-section">
        <h3>💰 Deposit Funds</h3>
        <form onSubmit={doDeposit}>
          <div className="form-row">
            <div>
              <label htmlFor="deposit-amount">Amount</label>
              <input 
                id="deposit-amount"
                placeholder="0.00" 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                disabled={isLoading}
                type="number"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="deposit-desc">Description</label>
              <input 
                id="deposit-desc"
                placeholder="e.g., Paycheck" 
                value={desc} 
                onChange={e => setDesc(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Deposit'}
          </button>
        </form>
      </div>

      <div id="withdrawForm" className="form-section">
        <h3>📤 Withdraw Funds</h3>
        <form onSubmit={doWithdraw}>
          <div className="form-row">
            <div>
              <label htmlFor="withdraw-amount">Amount</label>
              <input 
                id="withdraw-amount"
                placeholder="0.00" 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                disabled={isLoading}
                type="number"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="withdraw-desc">Description</label>
              <input 
                id="withdraw-desc"
                placeholder="e.g., Rent payment" 
                value={desc} 
                onChange={e => setDesc(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Withdraw'}
          </button>
        </form>
      </div>

      <div id="transferForm" className="form-section">
        <h3>🔄 Transfer Money</h3>
        <form onSubmit={doTransfer}>
          <label htmlFor="to-account">To Account ID</label>
          <input 
            id="to-account"
            placeholder="Enter recipient account ID" 
            value={toAccount} 
            onChange={e => setToAccount(e.target.value)}
            disabled={isLoading}
            type="number"
          />
          
          <label htmlFor="transfer-amount">Amount</label>
          <input 
            id="transfer-amount"
            placeholder="0.00" 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            disabled={isLoading}
            type="number"
            step="0.01"
          />
          
          <label htmlFor="transfer-desc">Description</label>
          <input 
            id="transfer-desc"
            placeholder="e.g., Payment to John" 
            value={desc} 
            onChange={e => setDesc(e.target.value)}
            disabled={isLoading}
          />
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Transfer'}
          </button>
        </form>
      </div>

      <div className="transactions-section">
        <h3>📋 Transaction History</h3>
        {transactions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            No transactions yet
          </p>
        ) : (
          <ul className="transactions-list">
            {transactions.map(t => (
              <li key={t.id}>
                <div className="tx-type">{t.type}</div>
                <div className="tx-description">{t.description}</div>
                <div className="tx-amount">${parseFloat(t.amount || 0).toFixed(2)}</div>
                <div className="tx-time">
                  {new Date(t.timestamp).toLocaleDateString()} <br/>
                  {new Date(t.timestamp).toLocaleTimeString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
