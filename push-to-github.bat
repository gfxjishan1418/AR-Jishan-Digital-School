@echo off
setlocal
title Push AR Jishan Digital School to GitHub
echo ===================================================
echo   Pushing AR Jishan Digital School to GitHub
echo ===================================================
echo.
cd /d "%~dp0"

set "PATH=C:\Users\Ele paid batch\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"

echo Target Repository: https://github.com/gfxjishan1418/AR-Jishan-Digital-School-.git
echo.
echo Pushing main branch to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ===================================================
    echo   SUCCESS! Code pushed to GitHub successfully!
    echo ===================================================
) else (
    echo.
    echo Note: If GitHub prompted you, please sign in via browser or Personal Access Token.
)

echo.
pause
