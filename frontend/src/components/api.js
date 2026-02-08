const API_BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.status === 204 ? null : res.json()
}

export function register(payload) { return request('/users/register', { method: 'POST', body: JSON.stringify(payload) }) }
export function login(payload) { return request('/users/login', { method: 'POST', body: JSON.stringify(payload) }) }

export function getAccountsByUser(userId) { return request(`/accounts/user/${userId}`) }
export function getAccount(id) { return request(`/accounts/${id}`) }
export function createAccount(payload) { return request('/accounts', { method: 'POST', body: JSON.stringify(payload) }) }

export function deposit(payload) { return request('/transactions/deposit', { method: 'POST', body: JSON.stringify(payload) }) }
export function withdraw(payload) { return request('/transactions/withdraw', { method: 'POST', body: JSON.stringify(payload) }) }
export function transfer(payload) { return request('/transactions/transfer', { method: 'POST', body: JSON.stringify(payload) }) }
export function getTransactionsForAccount(accountId) { return request(`/transactions/account/${accountId}`) }

export default { register, login, getAccountsByUser, getAccount, createAccount, deposit, withdraw, transfer, getTransactionsForAccount }
