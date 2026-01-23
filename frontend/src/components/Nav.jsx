export default function Nav({ user, onLogout, onChangeView }) {
  return (
    <header className="nav">
      <h1>Simple Banking</h1>
      <nav>
        {user ? (
          <>
            <button onClick={() => onChangeView('accounts')}>Accounts</button>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => onChangeView('login')}>Login</button>
        )}
      </nav>
    </header>
  )
}
