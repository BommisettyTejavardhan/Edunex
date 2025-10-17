@echo off
echo ========================================
echo    MySQL Password Configuration Tool
echo ========================================
echo.
echo This script will help you configure your MySQL connection.
echo.

set /p MYSQL_PASSWORD="Enter your MySQL root password (press Enter if no password): "

echo.
echo Updating .env file...

(
echo NODE_ENV=development
echo PORT=5000
echo.
echo # MongoDB Configuration (not used^)
echo MONGO_URI=mongodb://localhost:27017/lms
echo.
echo # MySQL Configuration
echo DB_TYPE=mysql
echo DB_HOST=localhost
echo DB_PORT=3306
echo DB_NAME=lms_db
echo DB_USER=root
echo DB_PASSWORD=%MYSQL_PASSWORD%
echo.
echo # JWT Secret
echo JWT_SECRET=lmssecretkey
) > .env

echo.
echo ========================================
echo Configuration saved to .env file!
echo ========================================
echo.
echo Next steps:
echo 1. Run: node setup-database.js
echo 2. Run: npm start
echo.
pause
