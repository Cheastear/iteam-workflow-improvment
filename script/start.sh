#!/bin/bash

# Exit on error
set -e

DEST_DIR="iteam-workflow-improvment"

if [ -d "$DEST_DIR" ]; then
    cd "$DEST_DIR"
fi

if [ -f package.json ]; then
    echo "Installing dependencies..."
    npm install

    if ! command -v nodemon &> /dev/null; then
        echo "Installing nodemon globally..."
        npm install -g nodemon
    else
        echo "nodemon is already installed."
    fi

    echo "Starting project in dev mode..."
    nohup npm run dev > project.log 2>&1 &
    echo "Project started!"
else
    echo "No package.json found in. Exiting."
    exit 1
fi
