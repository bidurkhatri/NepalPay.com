#!/bin/bash

# Run the prebuild script to set up development files
echo "Running prebuild process to prepare development files..."
node prebuild.js

echo "Development files prepared. Ready to start application."
echo "Please restart the workflow 'Start application' to apply changes."

