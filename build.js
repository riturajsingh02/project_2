import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Extensions to copy from root into public
const allowedExtensions = new Set([
  '.html',
  '.htm',
  '.css',
  '.js',
  '.json',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.svg',
  '.ico',
  '.txt',
  '.xml',
  '.mp4',
  '.webm'
]);

// Excluded files that should not be in public root
const excludedFiles = new Set([
  'package.json',
  'package-lock.json',
  'bun.lock',
  'server.js',
  'build.js',
  'vercel.json',
  'metadata.json'
]);

const files = fs.readdirSync(__dirname);

let copiedCount = 0;
for (const file of files) {
  const fullPath = path.join(__dirname, file);
  const stat = fs.statSync(fullPath);

  if (stat.isFile()) {
    const ext = path.extname(file).toLowerCase();
    if (allowedExtensions.has(ext) && !excludedFiles.has(file)) {
      const destPath = path.join(publicDir, file);
      fs.copyFileSync(fullPath, destPath);
      copiedCount++;
    }
  }
}

// Recursively copy images subdirectory to public/images
const imagesSrcDir = path.join(__dirname, 'images');
const imagesDestDir = path.join(publicDir, 'images');

if (fs.existsSync(imagesSrcDir)) {
  if (!fs.existsSync(imagesDestDir)) {
    fs.mkdirSync(imagesDestDir, { recursive: true });
  }
  const imageFiles = fs.readdirSync(imagesSrcDir);
  for (const imgFile of imageFiles) {
    const src = path.join(imagesSrcDir, imgFile);
    const dest = path.join(imagesDestDir, imgFile);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      // Also copy to root images alias if helpful
      const rootAlias = path.join(__dirname, imgFile);
      if (!fs.existsSync(rootAlias)) {
        try { fs.copyFileSync(src, rootAlias); } catch (e) {}
      }
      const publicRootAlias = path.join(publicDir, imgFile);
      if (!fs.existsSync(publicRootAlias)) {
        try { fs.copyFileSync(src, publicRootAlias); } catch (e) {}
      }
      copiedCount++;
    }
  }
}

// Create clean alias copies in public if needed
const aliases = [
  ['4 suta.jpeg', '4_suta.jpeg'],
  ['4 suta.jpeg', '4suta.jpeg'],
  ['6+.jpeg', '6_plus.jpeg'],
  ['6+.jpeg', '6plus.jpeg'],
  ['WhatsApp Image 2026-09-24 at 8.30.26 AM.jpeg', 'whatsapp_makhana_1.jpeg'],
  ['WhatsApp Image 2026-09-24 at 8.30.27 AM.jpeg', 'whatsapp_makhana_2.jpeg'],
  ['mobile hero.jpeg', 'mobile-hero.jpeg'],
  ['ceo_makhana.jpg', 'ceo_makhana.jpeg'],
  ['images/mk.mp4', 'mk.mp4']
];

for (const [src, dest] of aliases) {
  const srcPath = path.join(__dirname, src);
  const destPath = path.join(publicDir, dest);
  if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
}

console.log(`[Build] Successfully copied ${copiedCount} static assets, images, and video to /public for Vercel deployment.`);
process.exit(0);
