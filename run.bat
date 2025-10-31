@echo off
echo ==========================================
echo GES Restaurant Stock Management System
echo ==========================================
echo.

REM Check if Maven is installed
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Maven not found. Please install Maven first.
    pause
    exit /b 1
)

echo [OK] Maven found
echo.

REM Ask which database to use
echo Select database to use:
echo   1) H2 (in-memory, no setup required) [Recommended]
echo   2) MySQL (requires MySQL server running)
set /p db_choice="Enter choice [1-2]: "

set DB_PROFILE=h2
if "%db_choice%"=="2" (
    set DB_PROFILE=default
    echo.
    echo Using MySQL database profile
    echo Make sure MySQL is running and database 'ges' exists
) else (
    echo.
    echo Using H2 in-memory database
)

echo.
echo Checking frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call pnpm install
) else (
    echo [OK] Frontend dependencies already installed
)
cd ..

echo.
echo ==========================================
echo Starting services...
echo ==========================================
echo.

REM Start backend in new window
echo Starting backend server...
start "GES Backend" cmd /k "cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=%DB_PROFILE%"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo Starting frontend server...
start "GES Frontend" cmd /k "cd frontend && pnpm dev"

echo.
echo ==========================================
echo [SUCCESS] Application started!
echo ==========================================
echo.
echo Backend API:  http://localhost:8080/api
echo Swagger UI:   http://localhost:8080/swagger-ui
if "%DB_PROFILE%"=="h2" (
    echo H2 Console:   http://localhost:8080/h2-console
    echo               JDBC URL: jdbc:h2:mem:gesdb
    echo               User: sa  Password: ^(empty^)
)
echo Frontend:     http://localhost:3000
echo.
echo Default Login:
echo   Email: admin@ges.com
echo   Password: admin123
echo.
echo Close the backend/frontend windows to stop the servers.
echo ==========================================
pause
