import { useEffect, useState } from 'react'
import api from './api'

export default function AccountDetail({ account, onBack }) {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState(null)
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [toAccount, setToAccount] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const tx = await api.getTransactionsForAccount(account.id)
        setTransactions(tx)
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [account])

  async function doDeposit(e) {
    e.preventDefault()
    try {
      await api.deposit({ accountId: account.id, amount: amount, description: desc })
      const tx = await api.getTransactionsForAccount(account.id)
      setTransactions(tx)
      setAmount(''); setDesc('')
    } catch (err) { setError(err.message) }
  }

  async function doWithdraw(e) {
    e.preventDefault()
    try {
      await api.withdraw({ accountId: account.id, amount: amount, description: desc })
      const tx = await api.getTransactionsForAccount(account.id)
      setTransactions(tx)
      setAmount(''); setDesc('')
    } catch (err) { setError(err.message) }
  }

  async function doTransfer(e) {
    e.preventDefault()
    try {
      await api.transfer({ fromAccountId: account.id, toAccountId: Number(toAccount), amount: amount, description: desc })
      const tx = await api.getTransactionsForAccount(account.id)
      setTransactions(tx)
      setAmount(''); setDesc(''); setToAccount('')
    } catch (err) { setError(err.message) }
  }

  return (
    <div>
      <button onClick={onBack}>Back</button>
      <h2>Account {account.accountNumber}</h2>
      <div>Balance: {account.balance}</div>
      {error && <div className="error">{error}</div>}

      <section>
        <h3>Deposit / Withdraw</h3>
        <form onSubmit={doDeposit} style={{display:'inline-block', marginRight:10}}>
          <input placeholder="amount" value={amount} onChange={e=>setAmount(e.target.value)} />
          <input placeholder="description" value={desc} onChange={e=>setDesc(e.target.value)} />
          <button type="submit">Deposit</button>
        </form>
        <form onSubmit={doWithdraw} style={{display:'inline-block'}}>
          <input type="hidden" />
          <button type="submit">Withdraw</button>
        </form>
      </section>

      <section>
        <h3>Transfer</h3>
        <form onSubmit={doTransfer}>
          <input placeholder="to account id" value={toAccount} onChange={e=>setToAccount(e.target.value)} />
          <input placeholder="amount" value={amount} onChange={e=>setAmount(e.target.value)} />
          <input placeholder="description" value={desc} onChange={e=>setDesc(e.target.value)} />
          <button type="submit">Transfer</button>
        </form>
      </section>

      <section>
        <h3>Transactions</h3>
        <ul>
          {transactions.map(t => (
            <li key={t.id}>{t.type} {t.amount} — {t.description} ({new Date(t.timestamp).toLocaleString()})</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
