const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// The exact SVG path for Darna Tunisian Arch & Olive Sprig Emblem
function getEmblemSvg(color = '#713B48', width = 200, height = 200) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${width}" height="${height}" fill="none">
    <!-- Outer Moorish Pointed Arch -->
    <path d="M 22 84
             L 22 56
             C 22 36, 34 20, 50 12
             C 66 20, 78 36, 78 56
             L 78 84
             L 70 84
             L 70 56
             C 70 39, 60 26, 50 20
             C 40 26, 30 39, 30 56
             L 30 84
             Z"
          fill="${color}" />

    <!-- Inner Portal / Pillar (Left Door Silhouette) -->
    <path d="M 36 84
             L 36 52
             C 36 45, 41 40, 47 40
             C 47.5 40, 48 40.5, 48 41
             L 48 84
             Z"
          fill="${color}" />

    <!-- Organic Olive / Jasmine Branch & Leaves (Right Silhouette) -->
    <!-- Stem -->
    <path d="M 48 70
             Q 52 58, 62 48"
          stroke="${color}"
          stroke-width="2.5"
          stroke-linecap="round" />

    <!-- Leaf 1 (Top right pointing leaf) -->
    <path d="M 58 46
             C 60 38, 68 36, 72 38
             C 70 45, 63 48, 58 46 Z"
          fill="${color}" />

    <!-- Leaf 2 (Middle leaf) -->
    <path d="M 52 56
             C 56 50, 64 51, 67 54
             C 64 60, 57 60, 52 56 Z"
          fill="${color}" />

    <!-- Leaf 3 (Lower leaf) -->
    <path d="M 48 66
             C 52 62, 59 63, 62 67
             C 58 72, 52 71, 48 66 Z"
          fill="${color}" />
  </svg>`;
}

// App Icon with rounded corners and burgundy background
function getAppIconSvg(size = 512) {
  const r = size * 0.22; // smooth squircle radius
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
    <rect width="512" height="512" rx="112" fill="#713B48"/>
    <!-- Outer Moorish Pointed Arch -->
    <path d="M 124 416
             L 124 286
             C 124 196, 180 120, 256 84
             C 332 120, 388 196, 388 286
             L 388 416
             L 350 416
             L 350 286
             C 350 208, 304 148, 256 122
             C 208 148, 162 208, 162 286
             L 162 416
             Z"
          fill="#FFFFFF" />

    <!-- Inner Portal / Pillar -->
    <path d="M 190 416
             L 190 268
             C 190 236, 214 212, 246 212
             L 248 212
             L 248 416
             Z"
          fill="#FFFFFF" />

    <!-- Olive branch stem -->
    <path d="M 248 350
             Q 268 290, 314 246"
          stroke="#FFFFFF"
          stroke-width="12"
          stroke-linecap="round" />

    <!-- Leaf 1 (Top right) -->
    <path d="M 296 238
             C 304 200, 342 190, 362 200
             C 352 232, 318 248, 296 238 Z"
          fill="#FFFFFF" />

    <!-- Leaf 2 (Middle) -->
    <path d="M 268 284
             C 288 256, 326 260, 342 276
             C 326 304, 292 304, 268 284 Z"
          fill="#FFFFFF" />

    <!-- Leaf 3 (Lower) -->
    <path d="M 248 332
             C 268 312, 302 318, 316 338
             C 298 360, 268 356, 248 332 Z"
          fill="#FFFFFF" />
  </svg>`;
}

fs.writeFileSync(path.join(__dirname, '../public/assets/darna-emblem.svg'), getEmblemSvg('#713B48', 120, 120));
fs.writeFileSync(path.join(__dirname, '../public/assets/darna-emblem-white.svg'), getEmblemSvg('#FFFFFF', 120, 120));
fs.writeFileSync(path.join(__dirname, '../public/icons/icon-app.svg'), getAppIconSvg(512));

console.log('SVGs generated successfully!');
