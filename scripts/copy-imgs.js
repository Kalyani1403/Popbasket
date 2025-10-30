const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'img');
const destDir = path.resolve(__dirname, '..', 'public', 'img');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(srcDir)) {
  console.error(`Source img directory not found: ${srcDir}`);
  process.exit(1);
}

copyRecursive(srcDir, destDir);
console.log(`Copied images from ${srcDir} to ${destDir}`);
