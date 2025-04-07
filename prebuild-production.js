/**
 * This script prepares the repository for production build
 * It creates necessary directories and copies files
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
}

async function copyDir(src, dest) {
  ensureDirectoryExists(dest);
  
  try {
    await execAsync(`cp -r ${src}/* ${dest}/`);
    console.log(`Successfully copied ${src} to ${dest}`);
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error.message);
  }
}

async function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`Successfully copied ${src} to ${dest}`);
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error.message);
  }
}

async function main() {
  console.log('Starting production prebuild process...');

  // Ensure src directory exists (needed for build)
  ensureDirectoryExists('src');

  // Copy all files from client/src to src
  await copyDir('client/src', 'src');
  
  // Copy index.html to root (if it exists in client directory)
  if (fs.existsSync('client/index.html')) {
    copyFile('client/index.html', 'index.html');
  }

  // Create a production-ready vite.config.js in the root directory
  const viteConfigContent = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@shared": path.resolve(import.meta.dirname, "./shared"),
      "@assets": path.resolve(import.meta.dirname, "./attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});`;

  // Create a temporary vite config file for production
  fs.writeFileSync('vite.config.production.js', viteConfigContent);
  console.log('Created production Vite configuration');

  console.log('Production prebuild process completed successfully');
}

main().catch(error => {
  console.error('Error in prebuild process:', error);
  process.exit(1);
});