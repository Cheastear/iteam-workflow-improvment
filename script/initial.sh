#!/bin/bash

# Exit on error
set -e

# --- Check Node.js ---
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing..."
    # macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install node
    # Linux (Debian/Ubuntu)
    elif [[ -f /etc/debian_version ]]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
else
    echo "Node.js is installed: $(node -v)"
fi

# --- Check Git ---
if ! command -v git &> /dev/null; then
    echo "Git not found. Installing..."
    # macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install git
    # Linux (Debian/Ubuntu)
    elif [[ -f /etc/debian_version ]]; then
        sudo apt-get update
        sudo apt-get install -y git
    fi
else
    echo "Git is installed: $(git --version)"
fi

# --- Clone repo ---
REPO_URL="https://github.com/Cheastear/iteam-workflow-improvment"
DEST_DIR="iteam-workflow-improvment"

if [ ! -d "$DEST_DIR" ]; then
    echo "Cloning repository..."
    git clone "$REPO_URL" "$DEST_DIR"
else
    echo "Repository already exists. Pulling latest changes..."
    cd "$DEST_DIR"
    git pull
    cd ..
fi

# --- Run project ---
cd "$DEST_DIR"
if [ -f package.json ]; then
    echo "Installing dependencies..."
    npm install

    echo "Starting project in background..."
    nohup npm start > ../project.log 2>&1 &
    echo "Project started!"
else
    echo "No package.json found. Exiting."
fi