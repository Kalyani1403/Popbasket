const fs = require('fs');
const path = require('path');

const originals = [
  'Acoustic Bliss Headphones.jpg',
  'Ergo-Comfort Office Chair.webp',
  'Gourmet Coffee Beans.jpg',
  'Modernist Coffee Table.jpg',
  'Organic Green Tea.webp',
  'Quantum Core Laptop.webp',
  'Smart Home Hub.jpg',
  "The Alchemist's Secret.jpg",
];

function removeIfExists(dir, name) {
  const p = path.join(dir, name);
  if (fs.existsSync(p)) {
    try {
      fs.unlinkSync(p);
      console.log(`Deleted: ${p}`);
    } catch (err) {
      console.error(`Failed to delete ${p}: ${err}`);
    }
  } else {
    // console.log(`Not found (skip): ${p}`);
  }
}

const repoRoot = path.resolve(__dirname, '..');
const dirs = [path.join(repoRoot, 'img'), path.join(repoRoot, 'public', 'img')];

for (const dir of dirs) {
  for (const name of originals) {
    removeIfExists(dir, name);
  }
}

console.log('Removal script completed.');
