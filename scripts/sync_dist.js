import fs from 'fs';
import path from 'path';

console.log('--- Post-Build PWA & Asset Synchronization ---');

// Jika input ialah index.dev.html, namakan semula kepada dist/index.html
if (fs.existsSync('dist/index.dev.html')) {
  if (fs.existsSync('dist/index.html')) {
    fs.unlinkSync('dist/index.html');
  }
  fs.renameSync('dist/index.dev.html', 'dist/index.html');
}

const distHtmlPath = 'dist/index.html';
if (fs.existsSync(distHtmlPath)) {
  let html = fs.readFileSync(distHtmlPath, 'utf8');

  // 1. Pastikan manifest.json TIDAK dihalakan ke dalam assets/
  html = html.replace(/href="[^"]*manifest-[^"]*\.json"/g, 'href="./manifest.json"');
  
  // 2. Pastikan favicon dihalakan ke ./favicon.svg
  html = html.replace(/href="[^"]*favicon-[^"]*\.svg"/g, 'href="./favicon.svg"');

  // 3. Pastikan apple-touch-icon sentiasa menggunakan PNG sebenar untuk iOS Safari
  const appleIcons = [
    '<link rel="apple-touch-icon" href="./icons/icon-192.png" />',
    '<link rel="apple-touch-icon" sizes="180x180" href="./icons/icon-192.png" />',
    '<link rel="apple-touch-icon" sizes="192x192" href="./icons/icon-192.png" />',
    '<link rel="apple-touch-icon" sizes="512x512" href="./icons/icon-512.png" />'
  ].join('\n  ');
  html = html.replace(/(<link rel="apple-touch-icon"[^>]*>\s*)+/g, appleIcons + '\n');

  fs.writeFileSync(distHtmlPath, html, 'utf8');
  console.log('Fixed PWA manifest and apple-touch-icon references in dist/index.html');
}

// 4. Padam sebarang manifest bertindih di dalam dist/assets/
if (fs.existsSync('dist/assets')) {
  const assetFiles = fs.readdirSync('dist/assets');
  for (const f of assetFiles) {
    if (f.startsWith('manifest-') && f.endsWith('.json')) {
      fs.unlinkSync(path.join('dist/assets', f));
      console.log(`Removed unwanted hashed manifest from assets: ${f}`);
    }
  }
}

// 5. Pastikan fail PWA teras disalin dari public/ ke dist/
fs.copyFileSync('public/manifest.json', 'dist/manifest.json');
fs.copyFileSync('public/sw.js', 'dist/sw.js');
fs.copyFileSync('public/favicon.svg', 'dist/favicon.svg');

if (fs.existsSync('public/icons')) {
  fs.cpSync('public/icons', 'dist/icons', { recursive: true });
}

if (fs.existsSync('public/three.core.js')) {
  fs.copyFileSync('public/three.core.js', 'dist/three.core.js');
}
if (fs.existsSync('public/three.module.js')) {
  fs.copyFileSync('public/three.module.js', 'dist/three.module.js');
}

// 6. Sinkronisasi dist/ ke docs/ untuk sokongan penuh GitHub Pages
fs.cpSync('dist', 'docs', { recursive: true });
console.log('Synced dist/ to docs/');

// 7. Salin aset ke root untuk sokongan pelayan statik root (GitHub Pages /)
if (fs.existsSync('dist/assets')) {
  fs.cpSync('dist/assets', 'assets', { recursive: true });
}
if (fs.existsSync('dist/icons')) {
  fs.cpSync('dist/icons', 'icons', { recursive: true });
}
fs.copyFileSync('dist/index.html', 'index.html');
fs.copyFileSync('public/manifest.json', 'manifest.json');
fs.copyFileSync('public/sw.js', 'sw.js');
fs.copyFileSync('public/favicon.svg', 'favicon.svg');

// 8. Cipta .nojekyll untuk elak GitHub Pages mengabaikan sebarang aset
fs.writeFileSync('.nojekyll', '', 'utf8');
fs.writeFileSync('docs/.nojekyll', '', 'utf8');
fs.writeFileSync('dist/.nojekyll', '', 'utf8');

console.log('PWA synchronization & root production bundle completed successfully!');
