@echo off
color 0A
echo.
echo ================================================================
echo    LMS - Learning Management System
echo    Complete Setup and Startup Script
echo ================================================================
echo.
echo This script will:
echo   1. Configure MySQL connection
echo   2. Setup the database
echo   3. Start backend server (port 5000)
echo   4. Start frontend server (port 3000)
echo   5. Open the application in your browser
echo.
echo ================================================================
echo.

:PASSWORD_PROMPT
echo STEP 1: MySQL Configuration
echo ----------------------------------------------------------------
echo.
echo Please enter your MySQL root password:
echo (If you have NO password, just press Enter)
echo.
set /p MYSQL_PASSWORD="MySQL Password: "
echo.

echo Updating backend\.env configuration...
cd /d "%~dp0backend"
powershell -Command "(Get-Content .env) -replace 'DB_PASSWORD=.*', 'DB_PASSWORD=%MYSQL_PASSWORD%' | Set-Content .env"
echo   [OK] Configuration file updated
echo.

echo ================================================================
echo STEP 2: Database Setup
echo ----------------------------------------------------------------
echo.
echo Testing MySQL connection and creating database...
node setup-database.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Database setup failed!
    echo.
    echo Possible reasons:
    echo   - MySQL is not running
    echo   - Incorrect password
    echo   - MySQL not installed
    echo.
    choice /C YN /M "Would you like to try a different password"
    if errorlevel 2 goto END
    if errorlevel 1 goto PASSWORD_PROMPT
)

echo   [OK] Database ready!
echo.

echo ================================================================
echo STEP 3: Starting Backend Server
echo ----------------------------------------------------------------
echo.
echo Starting backend on http://localhost:5000
start "LMS Backend Server" cmd /k "cd /d "%~dp0backend" && echo Starting Backend Server... && npm start"
echo   [OK] Backend server starting...
echo   Waiting for server to initialize...
timeout /t 8 /nobreak >nul
echo.

echo ================================================================
echo STEP 4: Starting Frontend Server
echo ----------------------------------------------------------------
echo.
echo Starting frontend on http://localhost:3000
cd /d "%~dp0frontend"
start "LMS Frontend Server" cmd /k "cd /d "%~dp0frontend" && echo Starting Frontend Server... && npm start"
echo   [OK] Frontend server starting...
echo   Waiting for server to initialize...
timeout /t 10 /nobreak >nul
echo.

echo ================================================================
echo          APPLICATION READY!
echo ================================================================
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo   Default Login Credentials:
echo   ---------------------------
echo   Teacher Account:
echo     Email:    teacher@example.com
echo     Password: password123
echo.
echo   Student Account:
echo     Email:    student@example.com
echo     Password: password123
echo.
echo ================================================================
echo.
echo Opening application in your default browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo.
echo ================================================================
echo   SERVERS ARE RUNNING
echo ================================================================
echo.
echo The application is now running!
echo.
echo Features Available:
echo   - Assignment Submission (with file upload support)
echo   - Real-time grading
echo   - Student enrollment
echo   - Course management
echo.
echo To stop the servers, close the Backend and Frontend windows.
echo.
echo ================================================================
echo.

:END
echo Press any key to close this window...
pause >nul
