# Simple Banking Application - User Journey & UI Flow

## Overview

Simple Banking is a full-stack web application that allows users to manage bank accounts and perform financial transactions (deposits, withdrawals, transfers).

---

## Application Architecture

### Frontend (React + Vite)

- **Port**: 5173
- **Location**: `/frontend`
- **Key Components**: Login, Register, Accounts, AccountDetail, Navigation

### Backend (Spring Boot 3.2.0)

- **Port**: 8080
- **Location**: `/backend`
- **Database**: H2 (In-Memory)
- **Key Endpoints**:
  - `/api/users/*` - User management
  - `/api/accounts/*` - Account management
  - `/api/transactions/*` - Transaction handling

---

## User Journey Flow

### Phase 1: Authentication

#### 1.1 Initial Landing

```
User visits http://localhost:5173
         ↓
App checks localStorage for 'sb_user'
         ↓
  If exists → Proceed to Dashboard
  If NOT → Redirect to Login Screen
```

#### 1.2 Login Page

**Component**: `Login.jsx`
**UI Elements**:

- Email input field
- Password input field
- Sign In button
- Link to Register page

**User Actions**:

```
User enters email & password
         ↓
Clicks "Sign In"
         ↓
Frontend calls POST /api/users/login
         ↓
Backend validates credentials (UserService.login)
         ↓
Returns User object (id, name, email)
         ↓
App stores user in localStorage['sb_user']
         ↓
Redirects to Dashboard (Accounts view)
```

**API Endpoint**:

```
POST /api/users/login
Request Body: { email: "user@example.com", password: "password123" }
Response: { id: 1, name: "John Doe", email: "user@example.com", createdAt: "2025-01-27T..." }
```

#### 1.3 Registration Page

**Component**: `Register.jsx`
**UI Elements**:

- Name input field
- Email input field
- Password input field
- Sign Up button
- Link to Login page

**User Actions**:

```
User enters name, email & password
         ↓
Clicks "Sign Up"
         ↓
Frontend calls POST /api/users/register
         ↓
Backend creates new User (UserService.register)
         ↓
Returns User object
         ↓
Auto-logs in user (stores in localStorage)
         ↓
Redirects to Dashboard (Accounts view)
```

**API Endpoint**:

```
POST /api/users/register
Request Body: { name: "John Doe", email: "user@example.com", password: "password123" }
Response: { id: 1, name: "John Doe", email: "user@example.com", createdAt: "2025-01-27T..." }
```

---

### Phase 2: Dashboard & Account Management

#### 2.1 Accounts Dashboard (Initial State - No Accounts)

**Component**: `Accounts.jsx`
**Triggered**: After successful login
**Scenario**: User just registered and has no bank accounts yet

**User Journey**:

```
User registers new account
         ↓
Auto-logged in → Redirected to Dashboard
         ↓
Component mounts → useEffect triggers
         ↓
Calls GET /api/accounts/user/{userId}
         ↓
Backend returns EMPTY array (no accounts yet)
         ↓
UI displays:
  - "No accounts found" message
  - "Create Bank Account" option/button
```

#### 2.2 Creating a Bank Account

**User Journey**:

```
User clicks "Create Bank Account"
         ↓
Calls POST /api/accounts with Account object
         ↓
Backend creates new Account:
  - Generates unique accountNumber
  - Sets balance to 0.00
  - Links to user
  - Status = ACTIVE
         ↓
Returns new Account object
         ↓
Frontend updates accounts list
         ↓
New account appears in dashboard
```

**API Endpoint**:

```
POST /api/accounts
Request Body: {
  accountNumber: "ACC-1001",
  user: { id: 1 },
  balance: 0.00,
  status: "ACTIVE"
}
Response: {
  id: 1,
  accountNumber: "ACC-1001",
  user: { id: 1, name: "John Doe" },
  balance: 0.00,
  status: "ACTIVE",
  createdAt: "2025-01-27T..."
}
```

#### 2.3 Accounts Dashboard (With Multiple Accounts)

**Component**: `Accounts.jsx`
**Triggered**: After user creates 1+ bank accounts
**UI Elements**:

- Total Balance display (sum of all accounts)
- List of user's created accounts
- Each account card shows:
  - Account Number
  - Current Balance
  - "View Details →" button
- Option to create additional accounts

**Data Flow**:

```
User has created accounts
         ↓
Dashboard loads → useEffect triggers
         ↓
Calls GET /api/accounts/user/{userId}
         ↓
Backend retrieves all accounts for user
         ↓
Returns array of Account objects
         ↓
UI displays:
  - Total Balance (calculated: sum of all balances)
  - Account List (cards for each account)
  - "Create Another Account" button
```

**API Endpoint**:

```
GET /api/accounts/user/{userId}
Response: [
  { id: 1, accountNumber: "ACC-1001", balance: 5000.00, status: "ACTIVE", createdAt: "..." },
  { id: 2, accountNumber: "ACC-1002", balance: 2500.50, status: "ACTIVE", createdAt: "..." }
]
```

#### 2.4 Switching Between Accounts

**Component**: `Accounts.jsx` + `AccountDetail.jsx`
**User Journey**:

```
User views dashboard with multiple accounts
         ↓
Clicks "View Details →" on Account A
         ↓
AccountDetail page loads with Account A
         ↓
User views transactions for Account A
         ↓
User clicks "Back to Accounts"
         ↓
Returns to Dashboard
         ↓
Clicks "View Details →" on Account B
         ↓
AccountDetail page loads with Account B
         ↓
(Complete isolation - different transactions)
```

This allows users to seamlessly navigate between their different bank accounts.

#### 2.5 Account Details Page

**Component**: `AccountDetail.jsx`
**Triggered**: User clicks "View Details" on an account
**UI Elements**:

- Back to Accounts button
- Account Information header (Account Number, Current Balance)
- Three Transaction Sections (tabs/forms):
  1. **Deposit Form** - Add money to THIS account
  2. **Withdrawal Form** - Remove money from THIS account
  3. **Transfer Form** - Send money to ANOTHER account
- Transaction History List for THIS account

---

### Phase 3: Transactions

#### 3.1 Deposit Transaction (Add Money to Account)

**Component**: `AccountDetail.jsx` (Deposit Form)
**User Journey**:

```
User is viewing Account Detail for their account
         ↓
Clicks "Deposit" tab/section
         ↓
Enters:
  - Deposit amount
  - Optional description (e.g., "Salary", "Cash deposit")
         ↓
Clicks "Deposit" button
         ↓
Frontend validates inputs
         ↓
Calls POST /api/transactions/deposit
         ↓
Backend:
  1. Creates DEPOSIT transaction record
  2. Increases account balance by amount
  3. Saves transaction to database
         ↓
Returns Transaction object
         ↓
Frontend shows success message: "Deposit successful"
         ↓
Reloads transaction history for THIS account
         ↓
Account balance increases visibly
         ↓
Clears form inputs for next transaction
```

**Example**:

- Account balance before: $0.00
- User deposits: $1000.00
- Account balance after: $1000.00

**API Endpoint**:

```
POST /api/transactions/deposit
Request Body: {
  accountId: 1,
  amount: 1000.00,
  description: "Salary deposit"
}
Response: {
  id: 101,
  type: "DEPOSIT",
  amount: 1000.00,
  fromAccount: null,
  toAccount: { id: 1, accountNumber: "ACC-1001" },
  description: "Salary deposit",
  timestamp: "2025-01-27T10:30:00Z"
}
```

#### 3.2 Withdrawal Transaction (Remove Money from Account)

**Component**: `AccountDetail.jsx` (Withdrawal Form)
**User Journey**:

```
User is viewing Account Detail for their account
         ↓
Clicks "Withdraw" tab/section
         ↓
Enters:
  - Withdrawal amount
  - Optional description (e.g., "ATM withdrawal", "Cash withdrawal")
         ↓
Clicks "Withdraw" button
         ↓
Frontend validates:
  - Amount > 0
  - Amount ≤ account balance (sufficient funds)
         ↓
Calls POST /api/transactions/withdraw
         ↓
Backend:
  1. Checks if account has sufficient balance
  2. Creates WITHDRAWAL transaction record
  3. Decreases account balance by amount
  4. Saves transaction to database
         ↓
Returns Transaction object
         ↓
Frontend shows success message: "Withdrawal successful"
         ↓
Reloads transaction history for THIS account
         ↓
Account balance decreases visibly
         ↓
Clears form inputs for next transaction
```

**Example**:

- Account balance before: $1000.00
- User withdraws: $200.00
- Account balance after: $800.00

**Error Scenario**:

```
User has: $500.00
Tries to withdraw: $600.00
         ↓
Backend validation fails
         ↓
Frontend shows error: "Insufficient funds"
         ↓
Transaction NOT executed
         ↓
Balance remains: $500.00
```

**API Endpoint**:

```
POST /api/transactions/withdraw
Request Body: {
  accountId: 1,
  amount: 200.00,
  description: "ATM withdrawal"
}
Response: {
  id: 102,
  type: "WITHDRAWAL",
  amount: 200.00,
  fromAccount: { id: 1, accountNumber: "ACC-1001" },
  toAccount: null,
  description: "ATM withdrawal",
  timestamp: "2025-01-27T10:31:00Z"
}
```

#### 3.3 Transfer Transaction (Send Money Between Own Accounts)

**Component**: `AccountDetail.jsx` (Transfer Form)
**User Journey**:

```
User is viewing Account Detail for Account A
         ↓
Clicks "Transfer" tab/section
         ↓
Enters:
  - Amount to transfer
  - Recipient Account ID (must be one of their OTHER accounts)
  - Optional description (e.g., "Transfer to savings")
         ↓
Clicks "Transfer" button
         ↓
Frontend validates:
  - Amount > 0
  - Amount ≤ source account balance
  - Recipient Account ID exists
  - Recipient account is different from source
         ↓
Calls POST /api/transactions/transfer
         ↓
Backend:
  1. Checks source account has sufficient balance
  2. Checks recipient account exists
  3. Creates TRANSFER transaction record
  4. Debits source account (fromAccountId)
  5. Credits recipient account (toAccountId)
  6. Saves transaction to database
         ↓
Returns Transaction object
         ↓
Frontend shows success message: "Transfer successful"
         ↓
Reloads transaction history for THIS account (source)
         ↓
Source account balance decreases
         ↓
Recipient account balance increases
         ↓
Clears form inputs for next transaction
```

**Example Scenario**:

- User has Account A (Checking) with $1000.00
- User has Account B (Savings) with $500.00
- User transfers $300 from A to B
  - Account A balance after: $700.00
  - Account B balance after: $800.00
  - Single TRANSFER transaction is recorded

**API Endpoint**:

```
POST /api/transactions/transfer
Request Body: {
  fromAccountId: 1,    (Account A - Checking)
  toAccountId: 2,      (Account B - Savings)
  amount: 300.00,
  description: "Transfer to savings"
}
Response: {
  id: 103,
  type: "TRANSFER",
  amount: 300.00,
  fromAccount: { id: 1, accountNumber: "ACC-1001" },
  toAccount: { id: 2, accountNumber: "ACC-1002" },
  description: "Transfer to savings",
  timestamp: "2025-01-27T10:32:00Z"
}
```

#### 3.4 Transaction History

**Component**: `AccountDetail.jsx` (Bottom section)
**Data Flow**:

```
Account details page loads
         ↓
useEffect calls loadTransactions()
         ↓
Calls GET /api/transactions/account/{accountId}
         ↓
Backend returns all transactions for account
         ↓
Displays transaction list:
  - DEPOSIT/WITHDRAWAL/TRANSFER type
  - Amount value
  - Timestamp (formatted date)
  - Description (if provided)
```

**API Endpoint**:

```
GET /api/transactions/account/{accountId}
Response: [
  {
    id: 101,
    type: "DEPOSIT",
    amount: 500.00,
    fromAccount: null,
    toAccount: { id: 1, accountNumber: "ACC-1001" },
    description: "Salary",
    timestamp: "2025-01-27T10:30:00Z"
  },
  {
    id: 102,
    type: "WITHDRAWAL",
    amount: 100.00,
    fromAccount: { id: 1, accountNumber: "ACC-1001" },
    toAccount: null,
    description: "ATM",
    timestamp: "2025-01-27T10:31:00Z"
  }
]
```

---

### Phase 4: Navigation & Logout

#### 4.1 Navigation Menu

**Component**: `Nav.jsx`
**UI Elements**:

- Application logo/title
- User greeting (if logged in)
- Logout button (if logged in)

**Logout Flow**:

```
User clicks "Logout" button
         ↓
Clears localStorage['sb_user']
         ↓
Clears user state (setUser(null))
         ↓
Redirects to Login page
```

---

## Data Models

### User Model

```
{
  id: Long (PK),
  name: String (not null),
  email: String (unique, not null),
  passwordHash: String (not null, not returned in API),
  createdAt: Instant (auto-set)
}
```

### Account Model

```
{
  id: Long (PK),
  accountNumber: String (unique, not null),
  user: User (FK, not null),
  balance: BigDecimal (default: 0.00),
  status: AccountStatus (ACTIVE/INACTIVE),
  createdAt: Instant (auto-set)
}
```

### Transaction Model

```
{
  id: Long (PK),
  type: TransactionType (DEPOSIT/WITHDRAWAL/TRANSFER),
  amount: BigDecimal (not null),
  fromAccount: Account (FK, nullable - only for WITHDRAWAL/TRANSFER),
  toAccount: Account (FK, nullable - only for DEPOSIT/TRANSFER),
  description: String (optional),
  timestamp: Instant (auto-set)
}
```

### Request DTOs

**RegisterRequest**:

```
{ name: String, email: String, password: String }
```

**LoginRequest**:

```
{ email: String, password: String }
```

**DepositRequest**:

```
{ accountId: Long, amount: BigDecimal, description: String }
```

**WithdrawRequest**:

```
{ accountId: Long, amount: BigDecimal, description: String }
```

**TransferRequest**:

```
{ fromAccountId: Long, toAccountId: Long, amount: BigDecimal, description: String }
```

---

## Key UI States & Error Handling

### Loading States

- **Accounts Loading**: Shows "Loading your accounts..." message
- **Transaction Processing**: Buttons disabled, "Signing In..." / "Processing..." text

### Error States

- Invalid credentials → Login error message
- Insufficient funds → Withdrawal/Transfer error
- Invalid account ID → Transfer error
- Network errors → Generic error messages

### Success States

- "Deposit successful"
- "Withdrawal successful"
- "Transfer successful"

---

## Complete User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION START                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    Check localStorage
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
       Found User                     No User
            │                             │
            │                      REGISTRATION
            │                             │
            │                    Register form
            │                             │
            │                    Create user account
            │                             │
            │                      /api/users/register
            │                             │
            │                      Auto-login
            │                             │
            └──────────────┬──────────────┘
                           │
                    LOGIN (if needed)
                           │
                    Login form
                           │
              /api/users/login validation
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
      Success                            Failed
         │                                   │
      ✓ Store in localStorage            ✗ Show error
         │
    ┌────▼────────────────────────────────────────┐
    │    DASHBOARD (Accounts List)                │
    │    Check: Does user have accounts?          │
    └────┬────────────────────────────────────────┘
         │
    ┌────┴─────────────────────────────┐
    │                                  │
    ▼ NO ACCOUNTS                      ▼ HAS ACCOUNTS
    "No accounts found"                 Show total balance
    "Create Bank Account" button        List all accounts:
    │                                   - Account Number
    │                                   - Balance
    │                                   - "View Details →"
    │                                   "Create Another" button
    │                                   │
    │  CREATE ACCOUNT                  │
    │  POST /api/accounts              │
    │  │                                │
    │  ▼                                │
    │  Account created & appears        │
    │  │                                │
    └──┬────────────────────────────────┘
       │
       │ User clicks "View Details →"
       │
    ┌──▼──────────────────────────────────────┐
    │  ACCOUNT DETAIL PAGE                   │
    │  - Account info & balance              │
    │  - Back to Accounts button             │
    │  - Three transaction options:          │
    │    • DEPOSIT (add money)               │
    │    • WITHDRAW (remove money)           │
    │    • TRANSFER (to other account)       │
    │  - Transaction history for THIS acc    │
    └──┬──────────────────────────────────────┘
       │
       │ Choose transaction type
       │
    ┌──┴──────────────────────────────────────┐
    │                                         │
    ▼ DEPOSIT                ▼ WITHDRAW        ▼ TRANSFER
    Enter amount            Enter amount      Enter amount
    Enter description       Enter description Enter recipient
    Submit                  Submit            Enter description
                                              Submit
    /api/trans/deposit      /api/trans/       /api/trans/transfer
                            withdraw
    ↓                       ↓                 ↓
    Success                 Success           Success
    Balance ↑               Balance ↓         Source ↓
    History updated         History updated   Recipient ↑
    │                       │                 History updated
    └─────────────┬─────────┴─────────────────┘
                  │
          ┌───────▼────────┐
          │ Continue...    │
          │ • View Txn     │
          │ • Create new   │
          │ • Back to Acc  │
          │ • Logout       │
          └────────────────┘
```

---

## Technical Workflow Summary

1. **User Authentication** → Register/Login → JWT token stored locally
2. **Dashboard View** → Fetch all accounts for logged-in user
3. **Account Selection** → View account details and transaction history
4. **Transaction Execution** → DEPOSIT/WITHDRAW/TRANSFER with balance updates
5. **Real-time Updates** → Transaction history refreshes immediately
6. **Session Management** → Logout clears user data

---

## API Summary Table

| Method | Endpoint                              | Purpose                   | Auth   |
| ------ | ------------------------------------- | ------------------------- | ------ |
| POST   | /api/users/register                   | Create new user           | None   |
| POST   | /api/users/login                      | Authenticate user         | None   |
| GET    | /api/users                            | Get all users             | None\* |
| DELETE | /api/users/{id}                       | Delete user account       | None\* |
| POST   | /api/accounts                         | Create new account        | User   |
| GET    | /api/accounts/{id}                    | Get account details       | User   |
| GET    | /api/accounts                         | Get all accounts          | User   |
| GET    | /api/accounts/user/{userId}           | Get user's accounts       | User   |
| POST   | /api/transactions/deposit             | Deposit money             | User   |
| POST   | /api/transactions/withdraw            | Withdraw money            | User   |
| POST   | /api/transactions/transfer            | Transfer between accounts | User   |
| GET    | /api/transactions/account/{accountId} | Get account transactions  | User   |

\*Currently no authentication middleware implemented - all endpoints are publicly accessible

---

## Important Notes

- **No Authentication Middleware**: The backend currently does NOT validate user identity on endpoints. Any user can access any account/transaction data.
- **Implicit User Context**: Frontend maintains user context via localStorage, but backend doesn't validate it.
- **H2 Database**: In-memory database resets on application restart (no data persistence).
- **Simple Password Handling**: Passwords are hashed but no JWT or session tokens are used.

### Future Improvements Needed:

1. Implement JWT authentication
2. Add authorization checks (ensure users can only access their own data)
3. Add request validation and error handling middleware
4. Implement persistent database (MySQL/PostgreSQL)
5. Add transaction rollback mechanisms
6. Add role-based access control (RBAC)
