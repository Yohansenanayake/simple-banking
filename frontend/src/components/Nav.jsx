export default function Nav({ user, onLogout, onChangeView }) {
  return (
    <header className="nav">
      <h1>Luxe</h1>
      <nav>
        {user ? (
          <>
            <button onClick={() => onChangeView('accounts')}>My Accounts</button>
            <button onClick={onLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <button onClick={() => onChangeView('login')}>Login</button>
            <button onClick={() => onChangeView('register')}>Register</button>
          </>
        )}
      </nav>
    </header>
  )
}
