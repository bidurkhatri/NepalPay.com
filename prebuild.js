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

  // No need to copy files since Vite is configured to look for files in client/src
  // The issue was we were copying files to src/ but Vite config has root set to client/
  
  // Make sure client/index.html refers to the correct main.tsx path
  if (fs.existsSync('client/index.html')) {
    const content = fs.readFileSync('client/index.html', 'utf8');
    // Make sure the script tag points to ./src/main.tsx relative to client directory
    const updatedContent = content.replace(
      '<script type="module" src="/src/main.tsx"></script>',
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
