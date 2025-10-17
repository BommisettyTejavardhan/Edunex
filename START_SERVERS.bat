@echo off
echo ========================================
echo LMS3 - Starting Servers
echo ========================================
echo.
echo IMPORTANT: Make sure MySQL password is set in backend\.env
echo.
echo Starting Backend Server (Port 5000)...
echo.
start "LMS Backend" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server (Port 3000)...
echo.
start "LMS Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo Servers Starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login Credentials:
echo   Teacher: teacher@example.com / password123
echo   Student: student@example.com / password123
echo.
echo Press any key to close this window...
pause >nul
