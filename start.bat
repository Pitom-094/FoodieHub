@echo off
echo Installing dependencies...
call npm install concurrently nodemon --save-dev
echo.
echo Starting FoodieHub...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:5173
echo.
call npx concurrently "cd server && nodemon index.js" "npm run dev --prefix client"
