@echo off
setlocal
echo ===================================================
echo   Deploy AR Jishan Digital School & College to Vercel
echo ===================================================
echo.
cd /d "%~dp0"

echo Running production build test...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please fix errors before deploying.
    pause
    exit /b
)

echo.
echo Launching Vercel deployment...
call npx vercel --prod

echo.
echo ===================================================
echo Done!
echo ===================================================
pause
