import { useEffect, useState } from 'react'
import api from './api'

export default function Accounts({ user, onOpenAccount }) {
  const [accounts, setAccounts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAccountsByUser(user.id)
        setAccounts(data)
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [user])

  return (
    <div>
      <h2>Your Accounts</h2>
      {error && <div className="error">{error}</div>}
      <ul className="accounts">
        {accounts.map(a => (
          <li key={a.id}>
            <div><strong>{a.accountNumber}</strong></div>
            <div>Balance: {a.balance}</div>
            <button onClick={() => onOpenAccount(a)}>Open</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
