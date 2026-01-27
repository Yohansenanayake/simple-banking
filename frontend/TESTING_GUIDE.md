# Simple Banking - Frontend Testing Guide

## Pre-Flight Checklist

Before testing, ensure both backend and frontend are running:

### Backend Status

- ✅ Spring Boot running on port 8080
- ✅ H2 database initialized
- ✅ API endpoints accessible

### Frontend Status

- ✅ Vite dev server running on port 5173
- ✅ React components loaded
- ✅ API proxy configured
- ✅ Styles loaded correctly

---

## Test Scenarios

### Test 1: User Registration & Login

**Objective**: Verify user can register and login

**Steps**:

1. Visit http://localhost:5173
2. Click "Register" or "Create one" button
3. Fill in:
   - Full Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
4. Click "Sign Up"

**Expected Results**:

- ✅ Registration succeeds
- ✅ Auto-login occurs
- ✅ Redirected to Dashboard (Accounts page)
- ✅ User info stored in localStorage

**To Verify Storage**:

```javascript
// Open browser console (F12)
console.log(JSON.parse(localStorage.getItem("sb_user")));
// Should show: { id: 1, name: "John Doe", email: "john@example.com", ... }
```

---

### Test 2: Account Creation

**Objective**: Create bank accounts as a new user

**Steps**:

1. After registration, on Dashboard, you should see "No accounts found"
2. Click "Create Bank Account" button
3. Leave Account Number blank (auto-generate) or enter custom:
   - "ACC-CHECKING-001"
4. Click "Create Account"

**Expected Results**:

- ✅ Success message appears
- ✅ Form closes
- ✅ New account appears in the accounts list
- ✅ Account card shows:
  - Account Number
  - Balance: $0.00
  - "View Details →" button

**To Create Multiple Accounts**:

1. Click "Create Another Account" button
2. Enter different account number: "ACC-SAVINGS-001"
3. Create account
4. Verify both accounts appear in dashboard
5. Verify total balance shows: $0.00 (sum of $0.00 + $0.00)

---

### Test 3: Deposit Transaction

**Objective**: Add money to account

**Steps**:

1. Click "View Details →" on an account
2. Scroll to "Deposit Funds" section
3. Enter:
   - Amount: 1000.00
   - Description: "Initial deposit"
4. Click "Deposit" button

**Expected Results**:

- ✅ Success message: "Deposit successful"
- ✅ Form clears
- ✅ Transaction appears in history with:
  - Type: DEPOSIT
  - Amount: $1000.00
  - Description: "Initial deposit"
  - Timestamp
- ✅ Account balance updates (if shown)
- ✅ Message auto-dismisses after 3 seconds

**Verify in Dashboard**:

- Go back to accounts
- Account card should show: $1000.00

---

### Test 4: Withdrawal Transaction

**Objective**: Remove money from account

**Steps**:

1. On account detail, scroll to "Withdraw Funds"
2. Enter:
   - Amount: 250.00
   - Description: "ATM withdrawal"
3. Click "Withdraw" button

**Expected Results**:

- ✅ Success message: "Withdrawal successful"
- ✅ Form clears
- ✅ Transaction added to history
- ✅ Account balance decreased ($1000 - $250 = $750)

**Error Scenario - Insufficient Funds**:

1. Try to withdraw: 1000.00 (more than current balance)
2. Click "Withdraw"

**Expected Results**:

- ✅ Error message appears
- ✅ Transaction NOT created
- ✅ Balance remains unchanged
- ✅ Form data preserved

---

### Test 5: Transfer Between Accounts

**Objective**: Transfer money between own accounts

**Prerequisites**:

- Account A: $1000.00 (ID: 1)
- Account B: $500.00 (ID: 2)

**Steps**:

1. View Account A details
2. Scroll to "Transfer Money"
3. Enter:
   - To Account ID: 2
   - Amount: 300.00
   - Description: "Transfer to savings"
4. Click "Transfer" button

**Expected Results**:

- ✅ Success message: "Transfer successful"
- ✅ Form clears
- ✅ Transaction in Account A history shows:
  - Type: TRANSFER
  - Amount: $300.00
  - From: Account A
  - To: Account B

**Verify in Dashboard**:

- Account A balance: $700.00 (1000 - 300)
- Account B balance: $800.00 (500 + 300)
- Total balance: $1500.00

---

### Test 6: Transaction History

**Objective**: Verify all transactions are recorded correctly

**Steps**:

1. View Account A details
2. Scroll to "Transaction History"

**Expected to See** (in order from most recent):

1. TRANSFER - $300.00 - "Transfer to savings"
2. WITHDRAWAL - $250.00 - "ATM withdrawal"
3. DEPOSIT - $1000.00 - "Initial deposit"

**Verify Details**:

- ✅ Type displays correctly (DEPOSIT, WITHDRAWAL, TRANSFER)
- ✅ Amounts show as $X.XX format
- ✅ Descriptions match input
- ✅ Timestamps show date and time
- ✅ Most recent transaction at top

---

### Test 7: Account Navigation

**Objective**: Verify switching between accounts

**Steps**:

1. On Dashboard, note Account A and Account B balances
2. Click "View Details →" on Account A
3. View transactions and balance
4. Click "Back to Accounts"
5. Click "View Details →" on Account B
6. View Account B transactions

**Expected Results**:

- ✅ Dashboard loads correctly
- ✅ Each account shows its own transactions
- ✅ Each account shows correct balance
- ✅ Switching doesn't affect other account data
- ✅ Back button works smoothly

---

### Test 8: Logout & Re-login

**Objective**: Verify session persistence and logout

**Steps**:

1. On Dashboard, click "Sign Out"
2. Verify redirected to Login page
3. Login with same credentials:
   - Email: "john@example.com"
   - Password: "password123"
4. Verify accounts and balances are restored

**Expected Results**:

- ✅ Logout clears localStorage
- ✅ Redirected to login
- ✅ Login page shows
- ✅ Accounts and balances persist in database
- ✅ Same data appears after re-login

---

### Test 9: Form Validation

**Objective**: Verify form inputs are validated

**Test Cases**:

#### Empty Fields

1. Try to deposit without amount
2. Expected: Button disabled or error message

#### Invalid Account ID

1. On Transfer form, enter invalid ID: "9999"
2. Click Transfer
3. Expected: Error message (account not found)

#### Decimal Amounts

1. Enter deposit: "123.45"
2. Expected: Accepted and formatted correctly
3. Verify in transaction history: $123.45

#### Special Characters

1. Enter description: "Paycheck! 🎉"
2. Expected: Accepted and displayed correctly

---

### Test 10: Responsive Design

**Objective**: Verify mobile responsiveness

**Steps**:

1. Open browser DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test at various screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px

**Expected Results**:

- ✅ Navigation stacks vertically on mobile
- ✅ Account cards display single column on mobile
- ✅ Buttons remain clickable
- ✅ Forms stack properly
- ✅ Text remains readable
- ✅ No horizontal scrolling

---

### Test 11: Error Handling

**Objective**: Verify error messages and recovery

**Scenarios**:

#### Network Error

1. Stop backend server
2. Try to create account or transaction
3. Expected: Error message displayed
4. Restart backend
5. Try again - should work

#### Validation Error

1. Try to withdraw more than balance
2. Expected: Clear error message
3. User can correct and retry

#### Form Recovery

1. Enter transaction details
2. Get error
3. Correct the issue
4. Submit again
5. Expected: Transaction succeeds

---

### Test 12: UI/UX Polish

**Objective**: Verify visual feedback and animations

**Checks**:

- ✅ Buttons show loading state ("Creating...", "Processing...")
- ✅ Forms smooth scroll into view
- ✅ Cards have hover effects
- ✅ Animations are smooth (not jerky)
- ✅ Error messages visible and readable
- ✅ Success messages visible and readable
- ✅ No broken images or fonts
- ✅ Colors are distinct and accessible

---

## Test Data Reference

### User Credentials

```
Email: john@example.com
Password: password123
Name: John Doe
```

### Account Test Values

```
Account 1: ACC-CHECKING-001
Account 2: ACC-SAVINGS-001

Amounts for Testing:
- Deposit: 1000.00, 500.00
- Withdraw: 250.00, 100.00
- Transfer: 300.00, 150.00
```

---

## Browser DevTools Tips

### Check LocalStorage

```javascript
// View user data
console.log(localStorage.getItem("sb_user"));

// Clear all data
localStorage.clear();

// View all keys
console.log(Object.keys(localStorage));
```

### Monitor API Calls

1. Open Network tab (F12 → Network)
2. Filter by XHR
3. Check each API request:
   - **Request**: Method, Headers, Body
   - **Response**: Status code, JSON data
   - **Timing**: Request duration

### Check for Console Errors

1. Open Console tab (F12 → Console)
2. Look for red error messages
3. Note any JavaScript errors
4. Check for CORS errors

---

## Common Issues & Solutions

### Issue: "Cannot connect to API"

**Cause**: Backend not running or proxy misconfigured
**Solution**:

1. Ensure backend runs on http://localhost:8080
2. Check vite.config.js proxy settings
3. Restart frontend dev server

### Issue: "Login fails silently"

**Cause**: User doesn't exist or password wrong
**Solution**:

1. Register new user first
2. Check backend logs for errors
3. Verify credentials match

### Issue: "Deposit amount shows as NaN"

**Cause**: Input parsing issue
**Solution**:

1. Clear browser cache
2. Ensure amount is valid number
3. Check backend is correctly processing

### Issue: "Page doesn't refresh after transaction"

**Cause**: Transaction history not reloading
**Solution**:

1. Manually navigate away and back
2. Check browser console for errors
3. Verify backend response is valid JSON

---

## Performance Testing

### Page Load Time

1. Open DevTools → Performance
2. Record page load
3. Expected: < 2 seconds for initial load

### Transaction Processing Time

1. Monitor Network tab
2. Deposit/Withdraw/Transfer request
3. Expected: < 500ms response time

### Animation Smoothness

1. Open Performance → Rendering
2. Perform transactions
3. Check FPS - should maintain 60 FPS

---

## Accessibility Testing

### Keyboard Navigation

1. Disable mouse, use only Tab key
2. Verify all controls are reachable
3. Verify focus visible on all elements
4. Verify Enter submits forms

### Screen Reader (Optional)

1. Use browser built-in accessibility checker
2. Or use NVDA/JAWS
3. Verify all form labels readable
4. Verify error messages announced

---

## Sign-Off Checklist

Before deploying, verify:

- [ ] Registration works
- [ ] Login works
- [ ] Account creation works
- [ ] Deposit transaction works
- [ ] Withdrawal transaction works
- [ ] Transfer transaction works
- [ ] Transaction history displays correctly
- [ ] Account switching works
- [ ] Logout works
- [ ] Re-login restores data
- [ ] Forms validate input
- [ ] Error messages display
- [ ] Success messages display
- [ ] Mobile responsive
- [ ] No console errors
- [ ] API calls successful
- [ ] LocalStorage persists

---

## Reporting Issues

When reporting a frontend issue, include:

1. **Browser & Version**: Chrome 120, Firefox 121, Safari 17, etc.
2. **Device**: Desktop, iPhone 12, Samsung S21, etc.
3. **Steps to Reproduce**: Exact steps to trigger the issue
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Screenshots/Videos**: Visual evidence if possible
7. **Console Errors**: Copy any error messages
8. **Network Errors**: Check Network tab for failed requests

---

## Notes for Testing

- Tests should be run in order
- Each test builds on previous state
- Test data persists in H2 in-memory database
- Database resets when backend restarts
- LocalStorage persists across page refreshes
- Browser DevTools essential for debugging

Happy testing! 🚀
