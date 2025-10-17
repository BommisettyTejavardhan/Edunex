# LMS3 Setup and Run Script
# This script will help you configure and start the application

Write-Host "LMS Assignment Submission Feature - Setup and Run" -ForegroundColor Cyan
Write-Host "============================================================"
Write-Host ""

# Check if MySQL is running
Write-Host "Checking MySQL service..." -ForegroundColor Yellow
$mysqlService = Get-Service | Where-Object {$_.Name -like '*mysql*'}

if ($mysqlService) {
    if ($mysqlService.Status -eq 'Running') {
        Write-Host "[OK] MySQL service is running: $($mysqlService.Name)" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] MySQL service exists but is not running" -ForegroundColor Yellow
        Write-Host "Attempting to start..." -ForegroundColor Yellow
        Start-Service $mysqlService.Name -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
} else {
    Write-Host "[ERROR] MySQL service not found!" -ForegroundColor Red
    Write-Host "Please install MySQL first" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "MySQL Password Configuration" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------"
Write-Host ""
Write-Host "Please enter your MySQL root password:"
Write-Host "(If you don't have a password, just press Enter)" -ForegroundColor Gray
Write-Host ""

$password = Read-Host "MySQL Password" -AsSecureString
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow

# Update .env file
$envPath = ".\backend\.env"
$envContent = Get-Content $envPath
$newContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$plainPassword"
$newContent | Set-Content $envPath

Write-Host "[OK] .env file updated" -ForegroundColor Green
Write-Host ""

# Setup database
Write-Host "Setting up database..." -ForegroundColor Yellow
Set-Location .\backend
$setupResult = node setup-database.js 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Database setup complete!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Database setup failed!" -ForegroundColor Red
    Write-Host $setupResult
    Write-Host ""
    Write-Host "Possible solutions:" -ForegroundColor Yellow
    Write-Host "1. Check if the password you entered is correct" -ForegroundColor Gray
    Write-Host "2. Try running this script again" -ForegroundColor Gray
    Write-Host "3. Manually edit backend\.env and set DB_PASSWORD" -ForegroundColor Gray
    Set-Location ..
    exit 1
}

Set-Location ..
Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host "------------------------------------------------------------"
Write-Host ""

# Start backend in background
Write-Host "Starting backend server (port 5000)..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    npm start
}

Start-Sleep -Seconds 3

# Check if backend started successfully
$backendOutput = Receive-Job -Job $backendJob -Keep
if ($backendOutput -match "Server running") {
    Write-Host "[OK] Backend server started successfully!" -ForegroundColor Green
} else {
    Write-Host "[INFO] Backend server starting..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting frontend server (port 3000)..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\frontend
    npm start
}

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "============================================================"
Write-Host "Setup Complete!" -ForegroundColor Green -BackgroundColor Black
Write-Host "============================================================"
Write-Host ""
Write-Host "Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:   http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Default Accounts:" -ForegroundColor Cyan
Write-Host "   Teacher:   teacher@example.com / password123" -ForegroundColor White
Write-Host "   Student:   student@example.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "   - IMPLEMENTATION_COMPLETE.md  (Technical details)" -ForegroundColor Gray
Write-Host "   - TESTING_GUIDE.md           (Testing procedures)" -ForegroundColor Gray
Write-Host "   - README_ASSIGNMENT_FEATURE.md (Overview)" -ForegroundColor Gray
Write-Host ""
Write-Host "To run automated tests:" -ForegroundColor Cyan
Write-Host "   node test-assignment-submission.js" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Monitor jobs
try {
    while ($true) {
        Start-Sleep -Seconds 2
        
        # Check if jobs are still running
        if ($backendJob.State -ne 'Running' -or $frontendJob.State -ne 'Running') {
            Write-Host ""
            Write-Host "[WARNING] One or more servers stopped" -ForegroundColor Yellow
            
            if ($backendJob.State -ne 'Running') {
                Write-Host "Backend job state: $($backendJob.State)" -ForegroundColor Red
                Receive-Job -Job $backendJob
            }
            
            if ($frontendJob.State -ne 'Running') {
                Write-Host "Frontend job state: $($frontendJob.State)" -ForegroundColor Red
                Receive-Job -Job $frontendJob
            }
            
            break
        }
    }
} finally {
    # Cleanup jobs
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob, $frontendJob -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Servers stopped" -ForegroundColor Green
}
