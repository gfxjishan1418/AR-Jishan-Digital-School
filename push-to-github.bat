@echo off
setlocal
echo ===================================================
echo   Push Digital AI School to GitHub
echo ===================================================
echo.
cd /d "%~dp0"

set "PATH=C:\Users\Ele paid batch\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/digital-ai-school.git): "

if "%REPO_URL%"=="" (
    echo Error: No repository URL entered.
    pause
    exit /b
)

echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo Pushing main branch to GitHub...
git push -u origin main

echo.
echo ===================================================
echo Done!
echo ===================================================
pause
