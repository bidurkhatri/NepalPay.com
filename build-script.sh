#!/bin/bash

# Create src directory and copy all files from client/src
echo "Copying client files to src directory for build..."
mkdir -p src
cp -r client/src/* src/ 2>/dev/null || true

# Ensure the client/index.html is properly referencing main.tsx
echo "Building project..."
npm run build
