@echo off
echo ========================================
echo    Starting ERP Development Servers
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    Servers Starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Default Admin Login:
echo Email: admin@college.edu
echo Password: admin123
echo.
echo ========================================
echo Press any key to exit...
pause > nul
