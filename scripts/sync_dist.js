import fs from 'fs';
import path from 'path';

console.log('Synchronizing dist to root and docs...');

// 1. Salin keseluruhan dist/ ke docs/ untuk sokongan GitHub Pages /docs folder
fs.cpSync('dist', 'docs', { recursive: true });

// 2. Salin aset dan fail teras ke root untuk sokongan GitHub Pages root folder
if (fs.existsSync('dist/assets')) {
  fs.cpSync('dist/assets', 'assets', { recursive: true });
}

if (fs.existsSync('dist/icons')) {
  fs.cpSync('dist/icons', 'icons', { recursive: true });
}

const rootFiles = ['manifest.json', 'sw.js', 'favicon.svg', 'index.html'];
for (const file of rootFiles) {
  const srcPath = path.join('dist', file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, file);
    console.log(`Copied ${srcPath} -> ${file}`);
  }
}

console.log('Build synchronization completed successfully!');
