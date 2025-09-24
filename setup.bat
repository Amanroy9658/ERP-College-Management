@echo off
echo ========================================
echo    ERP Student Management System Setup
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend installation failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed!
    pause
    exit /b 1
)

echo.
echo [3/4] Creating Admin User...
cd ..\backend
call npm run create-admin
if %errorlevel% neq 0 (
    echo Admin user creation failed!
    pause
    exit /b 1
)

echo.
echo [4/4] Setup Complete!
echo.
echo ========================================
echo           Setup Instructions
echo ========================================
echo.
echo 1. Make sure MongoDB is running:
echo    - Download MongoDB from https://www.mongodb.com/try/download/community
echo    - Install and start MongoDB service
echo    - Or run: mongod --dbpath ./data/db
echo.
echo 2. Start Backend Server:
echo    - Open new terminal
echo    - Run: cd backend && npm run dev
echo.
echo 3. Start Frontend Server:
echo    - Open another terminal  
echo    - Run: cd frontend && npm run dev
echo.
echo 4. Access the application:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:5000
echo.
echo 5. Default Admin Credentials:
echo    - Email: admin@college.edu
echo    - Password: admin123
echo.
echo ========================================
pause
