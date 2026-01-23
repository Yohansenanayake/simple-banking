import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Accounts from './components/Accounts'
import AccountDetail from './components/AccountDetail'
import Nav from './components/Nav'

function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('accounts')
  const [selectedAccount, setSelectedAccount] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('sb_user')
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      setView('login')
    }
  }, [])

  function handleLogin(u) {
    setUser(u)
    localStorage.setItem('sb_user', JSON.stringify(u))
    setView('accounts')
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('sb_user')
    setView('login')
  }

  return (
    <div className="app">
      <Nav user={user} onLogout={handleLogout} onChangeView={setView} />
      <main>
        {!user && view !== 'register' && (
          <Login onLogin={handleLogin} onSwitch={() => setView('register')} />
        )}

        {user && view === 'accounts' && (
          <Accounts onOpenAccount={(a) => { setSelectedAccount(a); setView('account') }} user={user} />
        )}

        {user && view === 'account' && selectedAccount && (
          <AccountDetail account={selectedAccount} onBack={() => setView('accounts')} />
        )}
      </main>
    </div>
  )
}

export default App
