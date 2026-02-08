# Simple Banking - Complete Setup & Running Guide

## System Requirements

### Minimum

- Node.js 20.19+ or 22.12+
- Java 17+
- npm or yarn
- 2GB RAM
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Recommended

- Node.js 22+
- Java 21+
- 4GB+ RAM
- Chrome/Firefox (latest)

---

## Project Structure

```
simple-banking/
├── backend/                 # Spring Boot application
│   ├── pom.xml             # Maven configuration
│   ├── mvnw / mvnw.cmd     # Maven wrapper
│   └── src/
│       ├── main/java/...   # Java source code
│       └── resources/
│           └── application.properties
├── frontend/               # React application
│   ├── package.json        # NPM dependencies
│   ├── vite.config.js      # Vite configuration
│   └── src/
│       ├── components/...  # React components
│       ├── App.jsx
│       └── index.css
└── USER_JOURNEY.md        # User flow documentation
```

---

## Backend Setup & Running

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Build the Project

```bash
# Using Maven wrapper (no Maven installation needed)
./mvnw clean install -DskipTests

# Or if using Maven directly
mvn clean install -DskipTests
```

**Expected Output**:

- Multiple dependencies download
- Compilation completes
- JAR file created: `target/simple-banking-0.0.1-SNAPSHOT.jar`
- BUILD SUCCESS message

### Step 3: Run the Backend

#### Option A: Using Maven Spring Boot Plugin (Development)

```bash
./mvnw spring-boot:run
```

#### Option B: Using Java JAR (Production-like)

```bash
java -jar target/simple-banking-0.0.1-SNAPSHOT.jar
```

**Expected Output**:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_|\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::        (v3.2.0)

2025-01-27 14:45:00.000  INFO 12345 --- [main] c.p.s.SimpleBankingApplication : Started SimpleBankingApplication
```

**Backend is Ready When**:

- ✅ "Started SimpleBankingApplication" message appears
- ✅ No error messages
- ✅ Port 8080 is listening

### Step 4: Verify Backend is Running

```bash
# Test API endpoint
curl http://localhost:8080/api/users
```

Expected response: Empty JSON array `[]` (if no users yet)

---

## Frontend Setup & Running

### Step 1: Navigate to Frontend Directory

```bash
# From project root
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

**Expected**:

- `node_modules/` folder created
- Dependencies downloaded (takes 1-2 minutes)
- `package-lock.json` updated

### Step 3: Run Development Server

```bash
npm run dev
# or
yarn dev
```

**Expected Output**:

```
  VITE v7.3.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Frontend is Ready When**:

- ✅ "ready in XXX ms" message appears
- ✅ Local URL shows: http://localhost:5173/
- ✅ No error messages

### Step 4: Open Application in Browser

```
http://localhost:5173
```

You should see the Login page with:

- "Welcome Back" heading
- Email input
- Password input
- Sign In button
- Link to Register page

---

## Running Both Simultaneously

### Scenario: Using Two Terminal Windows

**Terminal 1 - Backend**:

```bash
cd simple-banking/backend
./mvnw spring-boot:run

# Wait for "Started SimpleBankingApplication" message
```

**Terminal 2 - Frontend**:

```bash
cd simple-banking/frontend
npm install  # if first time
npm run dev

# Wait for "ready in XXX ms" message
```

Both should be running now!

---

## Quick Test

### 1. Register a User

1. Open http://localhost:5173
2. Click "Create one" or "Register" button
3. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
4. Click "Sign Up"

**Expected**: Auto-login and redirect to Dashboard

### 2. Create Account

1. Click "Create Bank Account"
2. Leave Account Number blank or enter custom
3. Click "Create Account"

**Expected**: Account appears with $0.00 balance

### 3. Make Deposit

1. Click "View Details →"
2. Scroll to "Deposit Funds"
3. Enter Amount: 1000
4. Click "Deposit"

**Expected**: Success message and transaction appears

### 4. Verify

1. Click "Back to Accounts"
2. Account should show: $1000.00
3. Total Balance should show: $1000.00

---

## Database Information

### H2 In-Memory Database

- **Type**: Embedded H2 Database
- **Persistence**: None (resets on backend restart)
- **Purpose**: Development and testing
- **Console Access**: Not enabled by default

### Data Reset

**To clear all data**:

```bash
# Stop backend (Ctrl+C)
# Start backend again - fresh H2 database
./mvnw spring-boot:run
```

**Note**: Frontend localStorage is separate - you may need to logout/login

---

## Troubleshooting

### Backend Won't Start

**Error**: Port 8080 already in use

```bash
# Find process using port 8080
# Windows
netstat -ano | findstr :8080

# macOS/Linux
lsof -i :8080

# Kill process
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

**Error**: Maven build fails

```bash
# Clear Maven cache
rm -rf ~/.m2/repository
./mvnw clean install -DskipTests
```

### Frontend Won't Start

**Error**: Port 5173 already in use

```bash
# Change port
npm run dev -- --port 5174
```

**Error**: Dependencies not installing

```bash
# Clear npm cache
npm cache clean --force
rm package-lock.json node_modules -rf
npm install
```

**Error**: API calls fail

```bash
# Check backend is running on 8080
curl http://localhost:8080/api/users

# Check Vite proxy in vite.config.js
# Should proxy /api to http://localhost:8080
```

### Cannot Login

**Problem**: Login fails

```
1. Verify backend is running (check console)
2. Check browser console for error (F12 → Console)
3. Ensure user was registered successfully
4. Clear browser cache and try again
```

### CORS Errors

**Problem**: "Access to XMLHttpRequest blocked by CORS"

```
This shouldn't happen with Vite proxy setup.

Solutions:
1. Verify vite.config.js has proxy configuration
2. Restart frontend dev server
3. Clear browser cache
```

---

## Development Workflow

### Making Changes

**Backend Changes**:

1. Edit Java files in `src/main/java`
2. Save file
3. Backend auto-recompiles in development
4. Test changes via API calls

**Frontend Changes**:

1. Edit React components in `src/components` or `App.jsx`
2. Save file
3. Frontend hot-reloads automatically
4. Changes appear in browser immediately

### No Need to Restart For:

- Frontend component edits ✅ (HMR enabled)
- CSS/styling changes ✅ (HMR enabled)
- Backend Java code ✅ (auto-recompiles)

### Need to Restart For:

- Backend properties/configuration ❌
- New Maven dependencies ❌
- npm package updates ❌

---

## Building for Production

### Backend Build

```bash
cd backend
./mvnw clean package -DskipTests

# JAR ready at: target/simple-banking-0.0.1-SNAPSHOT.jar
```

### Frontend Build

```bash
cd frontend
npm run build

# Built files ready at: dist/
```

### Running JAR in Production

```bash
java -jar simple-banking-0.0.1-SNAPSHOT.jar
```

---

## Environment Variables

### Backend (application.properties)

```properties
# Configured for H2 in-memory
spring.datasource.url=jdbc:h2:mem:simple_banking
spring.datasource.username=sa
spring.datasource.password=
```

### Frontend (vite.config.js)

```javascript
// API proxy to backend
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

---

## Ports Summary

| Service  | Port | URL                   | Purpose   |
| -------- | ---- | --------------------- | --------- |
| Backend  | 8080 | http://localhost:8080 | REST API  |
| Frontend | 5173 | http://localhost:5173 | React App |
| H2 DB    | -    | -                     | In-memory |

---

## Useful Commands

### Backend

```bash
# Build only (no run)
./mvnw clean package -DskipTests

# Run with specific configuration
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"

# View Maven dependency tree
./mvnw dependency:tree
```

### Frontend

```bash
# Install specific version
npm install react@19.2.0

# Check for outdated packages
npm outdated

# Update all packages
npm update

# Run linter
npm run lint

# Preview production build
npm run preview
```

### General

```bash
# Check Node version
node --version

# Check Java version
java -version

# Check Maven version
./mvnw --version
```

---

## Performance Tips

### Backend

- H2 in-memory is fast for development
- For production, use PostgreSQL or MySQL
- Enable query logging in development with `spring.jpa.show-sql=true`

### Frontend

- Development: Vite provides hot module replacement
- Production: `npm run build` creates optimized bundle
- Use DevTools Performance tab to profile

### Network

- Vite proxy eliminates CORS issues
- Keep API responses small
- Use pagination for large datasets

---

## Debugging

### Backend Debugging

```
Add breakpoints in IDE (VSCode, IntelliJ, etc.)
Run: ./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
```

### Frontend Debugging

```
1. Open DevTools (F12)
2. Sources tab → Set breakpoints
3. Reload page
4. Execution pauses at breakpoint
```

### Network Debugging

```
1. Open DevTools (F12)
2. Network tab
3. Perform action
4. See API request/response
5. Check status codes and data
```

---

## Next Steps

1. **Complete First Test**: Follow "Quick Test" section above
2. **Read Documentation**:
   - `USER_JOURNEY.md` - Application flow
   - `frontend/FRONTEND_GUIDE.md` - Frontend details
   - `frontend/TESTING_GUIDE.md` - Test scenarios

3. **Explore Code**:
   - Check backend controllers in `backend/src/main/java`
   - Review frontend components in `frontend/src/components`

4. **Make Changes**:
   - Try modifying styles in `frontend/src/App.css`
   - Add new features to backend services

---

## Support & Issues

### Getting Help

1. **Check Logs**:
   - Backend console output
   - Browser DevTools console (F12)
   - Browser Network tab (F12 → Network)

2. **Common Issues**: See Troubleshooting section above

3. **Documentation**: Check guides in project root

---

## Shutdown

### To Stop Backend

```bash
# Press Ctrl+C in backend terminal
^C
```

### To Stop Frontend

```bash
# Press Ctrl+C in frontend terminal
^C
# Or close terminal window
```

### Cleanup

```bash
# Clean backend build
cd backend && ./mvnw clean

# Remove node_modules (if needed)
cd frontend && rm -rf node_modules

# Clear H2 database (deletes on backend restart anyway)
# No action needed
```

---

## Summary

| Step                 | Command                         | Location  | Expected Time  |
| -------------------- | ------------------------------- | --------- | -------------- |
| 1. Build Backend     | `mvn clean install -DskipTests` | backend/  | 30-60s         |
| 2. Run Backend       | `mvn spring-boot:run`           | backend/  | 10s            |
| 3. Install Frontend  | `npm install`                   | frontend/ | 60s            |
| 4. Run Frontend      | `npm run dev`                   | frontend/ | 5s             |
| 5. Open Browser      | http://localhost:5173           | N/A       | -              |
| **Total Setup Time** | -                               | -         | **~2 minutes** |

You're all set! 🚀 Start building!
