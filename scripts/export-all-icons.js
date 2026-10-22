const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const htmlFile = 'file:///' + path.resolve(__dirname, 'icon-render.html').replace(/\\/g, '/');
const outputDir = path.resolve(__dirname, '../public/icons');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  const outPath = path.join(outputDir, `icon-${size}x${size}.png`);
  console.log(`Generating icon-${size}x${size}.png...`);
  const cmd = `"${chromePath}" --headless --disable-gpu --force-device-scale-factor=1 --window-size=${size},${size} --screenshot="${outPath}" "${htmlFile}"`;
  execSync(cmd, { stdio: 'inherit' });
}

// Copy 192 to apple-touch-icon
fs.copyFileSync(path.join(outputDir, 'icon-192x192.png'), path.join(__dirname, '../public/apple-touch-icon.png'));
// Also generate favicon
const faviconPng = path.join(__dirname, '../public/favicon.png');
execSync(`"${chromePath}" --headless --disable-gpu --force-device-scale-factor=1 --window-size=64,64 --screenshot="${faviconPng}" "${htmlFile}"`);

console.log('All icons generated successfully!');
