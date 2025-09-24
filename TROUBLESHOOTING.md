# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. Network Error / Backend Connection Failed

**Problem**: Frontend shows "Network error. Please try again."

**Solutions**:

#### Check Backend Server
```bash
cd backend
npm run dev
```
Should show: `🚀 Server running on port 5000`

#### Check MongoDB Connection
```bash
# Test MongoDB connection
node test-connection.js

# Or manually check
mongod --version
```

#### Start MongoDB
```bash
# Windows
mongod --dbpath ./data/db

# macOS/Linux
sudo mongod --dbpath ./data/db
```

#### Check Ports
```bash
# Check if ports are in use
netstat -an | findstr :5000
netstat -an | findstr :3000

# Kill processes if needed
npx kill-port 5000
npx kill-port 3000
```

### 2. Frontend Build Errors

**Problem**: Frontend fails to start or build

**Solutions**:

#### Clear Cache and Reinstall
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Check Node Version
```bash
node --version
# Should be v18 or higher
```

#### Update Dependencies
```bash
npm update
```

### 3. Database Connection Issues

**Problem**: Backend can't connect to MongoDB

**Solutions**:

#### Install MongoDB
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

#### Create Database Directory
```bash
mkdir -p data/db
```

#### Check MongoDB Service
```bash
# Windows
net start MongoDB

# macOS/Linux
brew services start mongodb-community
```

### 4. Authentication Issues

**Problem**: Login/Register not working

**Solutions**:

#### Create Admin User
```bash
cd backend
npm run create-admin
```

#### Check JWT Secret
Make sure `backend/config.env` has:
```env
JWT_SECRET=your_super_secret_jwt_key_here
```

#### Clear Browser Storage
- Open Developer Tools (F12)
- Go to Application/Storage tab
- Clear Local Storage

### 5. CORS Issues

**Problem**: Frontend can't access backend API

**Solutions**:

#### Check CORS Configuration
In `backend/server.js`, ensure:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

#### Check API URL
In `frontend/src/utils/api.ts`, ensure:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 6. Port Already in Use

**Problem**: "Port 3000/5000 already in use"

**Solutions**:

#### Kill Existing Processes
```bash
# Windows
npx kill-port 3000
npx kill-port 5000

# macOS/Linux
lsof -ti:3000 | xargs kill
lsof -ti:5000 | xargs kill
```

#### Use Different Ports
```bash
# Backend
PORT=5001 npm run dev

# Frontend
npm run dev -- -p 3001
```

### 7. Environment Variables Issues

**Problem**: Environment variables not loading

**Solutions**:

#### Check File Location
- `backend/config.env` should exist
- `frontend/.env.local` should exist

#### Check File Format
```env
# Correct format
MONGODB_URI=mongodb://localhost:27017/student_erp
PORT=5000
JWT_SECRET=your_secret_here
```

### 8. Module Not Found Errors

**Problem**: "Cannot find module" errors

**Solutions**:

#### Reinstall Dependencies
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Check Node Modules
```bash
ls node_modules
# Should show all installed packages
```

## Quick Fix Commands

### Complete Reset
```bash
# Stop all processes
npx kill-port 3000
npx kill-port 5000

# Clean install
cd backend && rm -rf node_modules package-lock.json && npm install
cd ../frontend && rm -rf node_modules package-lock.json && npm install

# Start MongoDB
mongod --dbpath ./data/db

# Start servers
cd backend && npm run dev &
cd frontend && npm run dev
```

### Check System Status
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB
mongod --version

# Check ports
netstat -an | findstr :3000
netstat -an | findstr :5000
```

## Getting Help

If you're still having issues:

1. Check the console logs in both frontend and backend
2. Check browser developer tools for errors
3. Verify all prerequisites are installed
4. Try the complete reset commands above
5. Make sure MongoDB is running before starting the backend

## System Requirements

- **Node.js**: v18 or higher
- **MongoDB**: v5 or higher
- **RAM**: 4GB minimum
- **Disk Space**: 1GB free space
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
