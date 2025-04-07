#!/bin/bash

echo "Starting NepaliPay deployment process..."

# Run prebuild script to prepare file structure
echo "Running prebuild process..."
node prebuild-production.js

# Run the build
echo "Building the application..."
npm run build

echo "Deployment process completed successfully!"
echo "Your application is now ready to be deployed to production."
echo "For https://nepalipay.com, please follow these steps:"
echo "1. In the Replit dashboard, click on the 'Deploy' button"
echo "2. After deployment, verify the application is working correctly"
echo "3. If issues persist, check server logs and errors"

