@echo off
setlocal ENABLEDELAYEDEXPANSION

echo === Checking Node.js ===
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js not found. Installing...
    winget install -e --id OpenJS.NodeJS
) else (
    node -v
)

echo === Checking Git ===
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo Git not found. Installing...
    winget install -e --id Git.Git
) else (
    git --version
)

set REPO_URL=https://github.com/Cheastear/iteam-workflow-improvment
set DEST_DIR=iteam-workflow-improvment

if not exist "%DEST_DIR%" (
    echo Cloning repository...
    git clone "%REPO_URL%" "%DEST_DIR%"
) else (
    echo Repository already exists. Pulling latest changes...
    cd "%DEST_DIR%"
    git pull
    cd ..
)

call "%DEST_DIR%\script\start.bat"

echo === Done ===
pause