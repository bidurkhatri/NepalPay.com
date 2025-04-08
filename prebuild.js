/**
 * This script prepares the repository for development build
 * It creates symbolic links and copies necessary files
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
  console.log('Starting prebuild process...');

  // Ensure client/src directory exists
  ensureDirectoryExists('client/src');

  // Revert back to original approach - copy all files to src/
  // Ensure src directory exists (needed for build)
  ensureDirectoryExists('src');

  // Copy all files from client/src to src
  await copyDir('client/src', 'src');
  
  // Copy client/index.html to root for development
  if (fs.existsSync('client/index.html')) {
    copyFile('client/index.html', 'index.html');
  }

  // Make sure client/index.html has the correct path for development
  if (fs.existsSync('client/index.html')) {
    const content = fs.readFileSync('client/index.html', 'utf8');
    // Make sure the script tag points to ./src/main.tsx as specified in the vite config
    const updatedContent = content.replace(
      /<script type="module" src=".*\/main.tsx.*"><\/script>/,
      '<script type="module" src="./src/main.tsx"></script>'
    );
    fs.writeFileSync('client/index.html', updatedContent);
    console.log('Updated client/index.html with correct path to main.tsx');
  }

  console.log('Prebuild process completed successfully');
}

main().catch(error => {
  console.error('Error in prebuild process:', error);
  process.exit(1);
});
