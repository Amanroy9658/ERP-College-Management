@echo off
echo ========================================
echo    ERP System Status Check
echo ========================================
echo.

echo [1/4] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js v18+
    goto :end
) else (
    echo ✅ Node.js is installed
)

echo.
echo [2/4] Checking MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB not found! Please install MongoDB
    goto :end
) else (
    echo ✅ MongoDB is installed
)

echo.
echo [3/4] Checking Backend Dependencies...
cd backend
if not exist node_modules (
    echo ❌ Backend dependencies not installed
    echo Run: cd backend && npm install
    goto :end
) else (
    echo ✅ Backend dependencies installed
)

echo.
echo [4/4] Checking Frontend Dependencies...
cd ..\frontend
if not exist node_modules (
    echo ❌ Frontend dependencies not installed
    echo Run: cd frontend && npm install
    goto :end
) else (
    echo ✅ Frontend dependencies installed
)

echo.
echo ========================================
echo           Status Check Complete
echo ========================================
echo.
echo ✅ All dependencies are installed!
echo.
echo Next steps:
echo 1. Start MongoDB: mongod --dbpath ./data/db
echo 2. Run: start-dev.bat
echo.
echo Or manually:
echo - Backend: cd backend && npm run dev
echo - Frontend: cd frontend && npm run dev
echo.

:end
pause
