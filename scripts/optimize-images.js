const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '..', 'public', 'images');

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.png')) {
      const isRef = entry.name.includes('_program-reference');
      const maxW = isRef ? 1200 : 720;
      const webpPath = fullPath.replace(/\.png$/, '.webp');

      const originalSize = fs.statSync(fullPath).size;

      // 1. Generate WebP
      await sharp(fullPath)
        .resize(maxW, null, { withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(webpPath);

      const webpSize = fs.statSync(webpPath).size;

      // 2. Overwrite PNG with compressed version
      const compressedPngBuf = await sharp(fullPath)
        .resize(maxW, null, { withoutEnlargement: true })
        .png({ compressionLevel: 9, quality: 80 })
        .toBuffer();

      fs.writeFileSync(fullPath, compressedPngBuf);
      const newPngSize = fs.statSync(fullPath).size;

      console.log(`[Optimized] ${entry.name}:`);
      console.log(`  Original PNG: ${(originalSize / 1024).toFixed(1)} KB`);
      console.log(`  New PNG:      ${(newPngSize / 1024).toFixed(1)} KB`);
      console.log(`  New WebP:     ${(webpSize / 1024).toFixed(1)} KB`);
    }
  }
}

(async () => {
  console.log('Starting image optimization...');
  await processDirectory(imagesDir);
  console.log('All images optimized successfully!');
})();
