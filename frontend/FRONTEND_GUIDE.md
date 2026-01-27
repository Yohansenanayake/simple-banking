# Simple Banking Frontend - Implementation Guide

## Overview

The Simple Banking frontend is built with **React 19** and **Vite** as the build tool. It provides a modern, responsive user interface for managing bank accounts and performing financial transactions.

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx           # Login authentication form
│   │   ├── Register.jsx        # User registration form
│   │   ├── Accounts.jsx        # Dashboard showing all accounts & account creation
│   │   ├── AccountDetail.jsx   # Account details with transaction operations
│   │   ├── Nav.jsx             # Navigation header
│   │   └── api.js              # API client for backend communication
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── index.css               # Global styles & theme
│   └── main.jsx                # React entry point
├── vite.config.js              # Vite configuration with API proxy
├── package.json                # Dependencies
└── index.html                  # HTML entry point
```

---

## Key Components

### 1. **App.jsx** - Main Application Shell

- Manages application state (user, view, selected account)
- Handles routing between different views
- Manages user authentication state
- Loads user from localStorage on app start

**State Management**:

```javascript
- user: null | { id, name, email } (logged-in user)
- view: 'login' | 'register' | 'accounts' | 'account'
- selectedAccount: null | { id, accountNumber, balance, ... }
```

**Key Functions**:

- `handleLogin(user)` - Sets user and stores in localStorage
- `handleLogout()` - Clears user data and redirects to login
- View rendering based on authentication and selected view

### 2. **Login.jsx** - Authentication Page

**Features**:

- Email and password input fields
- Form validation and error handling
- Loading state during authentication
- Link to switch to registration page

**User Flow**:

```
1. User enters email & password
2. Submits form
3. API call to POST /api/users/login
4. On success: stores user in localStorage
5. On error: displays error message
```

**Props**:

- `onLogin(user)` - Callback when login succeeds
- `onSwitch()` - Callback to switch to registration view

### 3. **Register.jsx** - User Registration

**Features**:

- Name, email, and password input fields
- Form validation
- Auto-login after successful registration
- Error handling

**User Flow**:

```
1. User fills registration form
2. Submits form
3. API call to POST /api/users/register
4. Auto-attempts login with provided credentials
5. Stores user in localStorage on success
```

**Props**:

- `onLogin(user)` - Callback when registration succeeds
- `onSwitch()` - Callback to switch to login view

### 4. **Accounts.jsx** - Dashboard & Account Management

**Features**:

- Displays total balance across all accounts
- Lists all user's bank accounts
- Create new bank account functionality
- Account cards with balance and quick actions
- Empty state with account creation prompt

**States**:

```
isLoading - Loading accounts from backend
showCreateForm - Toggle account creation form
accounts - Array of user's accounts
error/success - Message feedback
```

**User Flow**:

```
Scenario 1: New User (No Accounts)
- Displays "No accounts found" message
- Shows "Create Bank Account" button
- User clicks to show creation form
- Enters account number (optional) or accepts auto-generated
- Account is created and appears in list

Scenario 2: Existing Accounts
- Displays total balance (sum of all)
- Shows grid of account cards
- User can click to view details
- "Create Another Account" button available
```

**Key Functions**:

- `loadAccounts()` - Fetches user's accounts from backend
- `handleCreateAccount(e)` - Creates new bank account

### 5. **AccountDetail.jsx** - Account Operations & Transactions

**Features**:

- Displays current account balance and number
- Three transaction sections: Deposit, Withdraw, Transfer
- Transaction history list
- Quick action buttons
- Form validation and error handling

**Transaction Operations**:

#### Deposit:

```
User enters amount and description
→ POST /api/transactions/deposit
→ Account balance increases
→ Transaction added to history
```

#### Withdrawal:

```
User enters amount and description
→ POST /api/transactions/withdraw
→ Validates sufficient balance
→ Account balance decreases
→ Transaction added to history
```

#### Transfer:

```
User enters:
- Amount
- Recipient account ID
- Description
→ POST /api/transactions/transfer
→ Validates source balance
→ Debits source account
→ Credits recipient account
→ Transaction added to history
```

**State Management**:

```javascript
- transactions: [] (transaction history)
- amount: '' (transaction amount)
- desc: '' (transaction description)
- toAccount: '' (transfer recipient)
- error/success: null | string (feedback messages)
- isLoading: boolean (processing state)
```

**Key Functions**:

- `loadTransactions()` - Fetches account transactions
- `doDeposit(e)` - Process deposit
- `doWithdraw(e)` - Process withdrawal
- `doTransfer(e)` - Process transfer

### 6. **Nav.jsx** - Navigation Header

**Features**:

- Application branding (Luxe)
- User greeting (if logged in)
- Navigation buttons based on auth state
- Logout functionality

**Conditional Rendering**:

```
Authenticated User:
- "My Accounts" button
- "Sign Out" button

Unauthenticated:
- "Login" button
- "Register" button
```

### 7. **api.js** - API Client

**Purpose**: Centralized API communication with backend

**Base Configuration**:

- Base URL: `/api` (proxied to `http://localhost:8080` by Vite)
- Content-Type: `application/json`

**Available Functions**:

```javascript
// Authentication
register(payload); // POST /api/users/register
login(payload); // POST /api/users/login

// Accounts
getAccountsByUser(userId); // GET /api/accounts/user/{userId}
getAccount(id); // GET /api/accounts/{id}
createAccount(payload); // POST /api/accounts

// Transactions
deposit(payload); // POST /api/transactions/deposit
withdraw(payload); // POST /api/transactions/withdraw
transfer(payload); // POST /api/transactions/transfer
getTransactionsForAccount(accountId); // GET /api/transactions/account/{accountId}
```

**Error Handling**:

- Non-200 responses throw Error with response text
- Errors are caught in components and displayed to user
- 204 No Content responses return null

---

## Styling System

### Color Palette

```css
--primary-dark: #0a0e27 /* Main background */ --primary-darker: #050812
  /* Darker background */ --secondary-dark: #1a1f3a /* Secondary background */
  --accent-gold: #d4af37 /* Primary accent */ --accent-gold-light: #e8c547
  /* Light accent */ --accent-blue: #4a90e2 /* Secondary accent */
  --accent-blue-light: #6ba3f5 /* Light blue */ --text-light: #e8eaf6
  /* Main text */ --text-muted: #a8afc5 /* Muted text */ --success: #48bb78
  /* Success color */ --danger: #f56565 /* Error color */ --warning: #ed8936
  /* Warning color */;
```

### Typography

```css
--font-display:
  "Playfair Display", serif /* Headings */ --font-body: "Poppins",
  sans-serif /* Body text */ --font-mono: "Inconsolata",
  monospace /* Monospace (amounts, IDs) */;
```

### Key Styles

- **Gradient backgrounds**: Linear and radial gradients for depth
- **Blur effects**: `backdrop-filter: blur()` for glassmorphism
- **Smooth transitions**: `--transition-smooth: all 0.4s cubic-bezier(...)`
- **Animations**: Fade-in, slide-in, float effects

### Responsive Design

- Mobile-first approach
- Breakpoint at 768px for tablet/desktop
- Flexible grid layouts with `auto-fit` and `minmax()`
- Touch-friendly button sizes

---

## User Data Flow

### Authentication Flow

```
1. App loads
   ↓ Checks localStorage for 'sb_user'
   ├─ Found: Proceed to Accounts
   └─ Not found: Show Login
2. User Login/Register
   ↓ API authentication
3. User object stored in localStorage
4. Logged-in user can access Accounts/Transactions
```

### Account Management Flow

```
Dashboard (Accounts.jsx)
   ↓ GET /api/accounts/user/{userId}
   ↓ Display accounts or empty state
   ├─ Click "Create Account"
   │  ↓ POST /api/accounts
   │  ↓ Account created (balance = 0)
   │  ↓ Added to list
   └─ Click "View Details"
      ↓ Set selectedAccount
      ↓ Navigate to AccountDetail
```

### Transaction Flow

```
Account Detail (AccountDetail.jsx)
   ↓ GET /api/transactions/account/{accountId}
   ↓ Display transaction history
   ├─ Deposit Form
   │  ↓ POST /api/transactions/deposit
   │  ↓ Balance increases
   └─ Withdraw/Transfer Forms
      ↓ POST /api/transactions/{withdraw|transfer}
      ↓ Balance updates
      ↓ History refreshed
```

---

## Form Validation

### Input Validation

- **Required fields**: Name (register), Email, Password
- **Email format**: HTML5 email input validation
- **Number fields**: Type="number" with step="0.01" for amounts
- **Amount validation**: Backend validates sufficient balance

### Error Messages

- Network errors displayed in red alert
- Form submission errors shown to user
- Success messages shown in green
- Auto-dismiss success messages after 3 seconds

---

## Local Storage

### Key: `sb_user`

Stores authenticated user object:

```javascript
{
  id: number,
  name: string,
  email: string,
  createdAt: string (ISO 8601)
}
```

**Usage**:

- Persists login across page refreshes
- Checked on app startup
- Cleared on logout

---

## Environment Configuration

### Vite Proxy Setup

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

This allows:

- Frontend requests to `/api/...` are proxied to backend
- CORS issues avoided in development
- Same API URL works in production if served together

---

## Running the Application

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Setup & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

- Hot Module Replacement (HMR) enabled
- API proxy active
- Source maps for debugging

---

## Performance Optimizations

1. **Component Code Splitting**: Each route is a separate component
2. **Smooth Animations**: CSS animations instead of JavaScript
3. **Lazy Loading**: Images and components load on demand
4. **Efficient Re-renders**: useState hook management
5. **Backdrop Filters**: GPU-accelerated blur effects

---

## Accessibility Features

1. **Semantic HTML**: Proper form labels and inputs
2. **Keyboard Navigation**: Tab, Enter support
3. **Focus States**: Visible focus rings on interactive elements
4. **Error Messages**: Associated with form fields
5. **Color Contrast**: Text meets WCAG standards

---

## Future Enhancements

1. **Additional Pages**:
   - Account settings
   - Transaction filters/search
   - Transaction export

2. **Features**:
   - Transaction scheduling
   - Bill payment setup
   - Account statements PDF
   - Multi-account transfers in UI

3. **Improvements**:
   - Toast notifications instead of alerts
   - Pagination for large transaction lists
   - Real-time balance updates
   - Dark/Light theme toggle

4. **Security**:
   - JWT token handling
   - Secure password reset
   - 2FA support
   - Session timeout

---

## Troubleshooting

### API Connection Issues

**Problem**: "Failed to fetch" errors
**Solution**:

1. Ensure backend is running on port 8080
2. Check vite.config.js proxy configuration
3. Verify CORS headers in backend

### Login Not Working

**Problem**: Cannot login even with correct credentials
**Solution**:

1. Check backend is running
2. Verify user exists in database
3. Check browser console for API errors
4. Clear localStorage and try again

### Styling Issues

**Problem**: Colors or fonts not displaying
**Solution**:

1. Verify index.css is loaded
2. Check CSS custom properties in :root
3. Clear browser cache
4. Check for CSS file syntax errors

---

## Component Props Reference

### Login

```jsx
<Login
  onLogin={(user) => {}} // Required
  onSwitch={() => {}} // Required
/>
```

### Register

```jsx
<Register
  onLogin={(user) => {}} // Required
  onSwitch={() => {}} // Required
/>
```

### Accounts

```jsx
<Accounts
  user={currentUser} // Required
  onOpenAccount={(account) => {}} // Required
/>
```

### AccountDetail

```jsx
<AccountDetail
  account={selectedAccount} // Required
  onBack={() => {}} // Required
/>
```

### Nav

```jsx
<Nav
  user={currentUser} // Required
  onLogout={() => {}} // Required
  onChangeView={(view) => {}} // Required
/>
```

---

## Conclusion

The Simple Banking frontend provides a complete, user-friendly interface for managing bank accounts and transactions. With its modern design, responsive layout, and smooth interactions, it delivers an excellent user experience while maintaining security and performance best practices.

For questions or contributions, please refer to the main project README.
