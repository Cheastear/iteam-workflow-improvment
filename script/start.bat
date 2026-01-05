@echo off
setlocal

set DEST_DIR=iteam-workflow-improvment

if exist "%DEST_DIR%" (
    cd "%DEST_DIR%"
)

if exist package.json (
    echo Installing dependencies...
    npm install

    where nodemon >nul 2>&1
    if %errorlevel% neq 0 (
        echo Installing nodemon globally...
        npm install -g nodemon
    ) else (
        echo nodemon already installed.
    )

    echo Starting project in dev mode...
    start cmd /k npm run dev
) else (
    echo No package.json found. Exiting.
    exit /b 1
)

pause