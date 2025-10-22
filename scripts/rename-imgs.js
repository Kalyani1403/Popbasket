const fs = require('fs');
const path = require('path');

const pairs = [
  ['Acoustic Bliss Headphones.jpg', 'acoustic-bliss-headphones.jpg'],
  ['Ergo-Comfort Office Chair.webp', 'ergo-comfort-office-chair.webp'],
  ['Gourmet Coffee Beans.jpg', 'gourmet-coffee-beans.jpg'],
  ['Modernist Coffee Table.jpg', 'modernist-coffee-table.jpg'],
  ['Organic Green Tea.webp', 'organic-green-tea.webp'],
  ['Quantum Core Laptop.webp', 'quantum-core-laptop.webp'],
  ['Smart Home Hub.jpg', 'smart-home-hub.jpg'],
  ['The Alchemist\'s Secret.jpg', 'the-alchemists-secret.jpg'],
  ['webimg.jpg', 'webimg.jpg']
];

function renameIfExists(baseDir, from, to) {
  const src = path.join(baseDir, from);
  const dest = path.join(baseDir, to);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} -> ${dest}`);
  } else {
    console.warn(`Not found: ${src}`);
  }
}

const repoRoot = path.resolve(__dirname, '..');
const imgDirs = [path.join(repoRoot, 'img'), path.join(repoRoot, 'public', 'img')];

for (const dir of imgDirs) {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    continue;
  }
  for (const [from, to] of pairs) {
    renameIfExists(dir, from, to);
  }
}

console.log('Rename script completed.');
