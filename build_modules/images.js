const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.join(__dirname, '..', 'assets', 'images', 'posts');

const SIZES = [480, 768, 1200];
const FORMATS = ['avif', 'webp'];

function isRasterImage(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext);
}

async function ensureDir(p) {
  await fs.ensureDir(p);
}

async function processImages(outputDir) {
  const outDir = path.join(outputDir, 'assets', 'images', 'posts');
  await ensureDir(outDir);

  const manifest = {};
  if (!(await fs.pathExists(SRC_DIR))) {
    return manifest; // nothing to process
  }
  const files = await fs.readdir(SRC_DIR);
  for (const file of files) {
    if (!isRasterImage(file)) continue;
    const srcPath = path.join(SRC_DIR, file);
    const base = path.basename(file, path.extname(file));

    const image = sharp(srcPath);
    const meta = await image.metadata();

    const entryKey = `/assets/images/posts/${file}`; // original url
    manifest[entryKey] = {
      original: entryKey,
      width: meta.width || null,
      height: meta.height || null,
      formats: {}
    };

    for (const fmt of FORMATS) {
      const variants = [];
      for (const w of SIZES) {
        if (meta.width && w > meta.width) continue; // skip upscaling
        const outName = `${base}-${w}.${fmt}`;
        const outPath = path.join(outDir, outName);
        const pipeline = sharp(srcPath).resize({ width: w, withoutEnlargement: true, fit: 'inside' });
        if (fmt === 'webp') pipeline.webp({ quality: 82 });
        if (fmt === 'avif') pipeline.avif({ quality: 50 });
        await pipeline.toFile(outPath);
        variants.push({ w, url: `/assets/images/posts/${outName}` });
      }
      // Fallback: at least original-width variant if none produced
      if (variants.length === 0 && meta.width) {
        const w = meta.width;
        variants.push({ w, url: entryKey });
      }
      manifest[entryKey].formats[fmt] = variants;
    }
  }

  const manifestPath = path.join(outputDir, 'assets', 'images', 'images-manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('--- Görsel varyant manifesti oluşturuldu.');
  return manifest;
}

module.exports = processImages;
