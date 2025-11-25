@echo off
echo [INFO] Installing Backend Dependencies...
cd backend
call npm install
echo.
echo [INFO] Starting Backend Server...
echo [INFO] Once started, open http://localhost:3000 in your browser.
npm start
pause
