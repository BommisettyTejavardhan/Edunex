@echo off
echo ========================================================
echo LMS3 - Quick Setup and Run
echo ========================================================
echo.
echo This script will help you configure and start the LMS.
echo.
echo STEP 1: MySQL Password Configuration
echo ========================================================
echo.
echo Please enter your MySQL root password:
echo (If you don't have a password, just press Enter)
echo.
set /p MYSQL_PASSWORD="MySQL Password: "
echo.
echo Updating configuration file...
cd backend
powershell -Command "(Get-Content .env) -replace 'DB_PASSWORD=.*', 'DB_PASSWORD=%MYSQL_PASSWORD%' | Set-Content .env"
echo Done!
echo.
echo STEP 2: Setting up database...
echo ========================================================
node setup-database.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Database setup failed!
    echo Please check your MySQL password and try again.
    echo.
    pause
    exit /b 1
)
echo.
echo STEP 3: Starting servers...
echo ========================================================
echo.
echo Starting Backend Server (Port 5000)...
start "LMS Backend" cmd /k "npm start"
timeout /t 5 /nobreak >nul
echo.
cd ..\frontend
echo Starting Frontend Server (Port 3000)...
start "LMS Frontend" cmd /k "npm start"
echo.
echo ========================================================
echo SUCCESS! Servers are starting...
echo ========================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Default Login Credentials:
echo   Teacher: teacher@example.com / password123
echo   Student: student@example.com / password123
echo.
echo The application will open in your browser shortly...
echo.
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
