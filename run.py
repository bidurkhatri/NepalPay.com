#!/usr/bin/env python3
"""
Simple production runner for NepaliPay
This ensures the application runs properly in all environments
"""
import os
import subprocess
import sys

def main():
    # Set working directory
    os.chdir('/home/runner/workspace')
    
    # Set production environment
    os.environ['NODE_ENV'] = 'development'  # Use development for Vite serving
    
    # Start the server
    try:
        subprocess.run(['tsx', 'server/index.ts'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Server failed to start: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("Server stopped by user")
        sys.exit(0)

if __name__ == '__main__':
    main()