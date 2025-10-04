const fs = require('fs-extra');
const path = require('path');

const siteBaseUrl = 'https://kaevros.github.io';

async function createSitemap(outputDir) {
  const pages = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.isFile() && e.name.endsWith('.html')) {
        const rel = path.relative(outputDir, full).replace(/\\/g, '/');
        pages.push(`/${rel}`);
      }
    }
  }
  await walk(outputDir);

  const urls = pages
    .filter(p => !p.includes('/assets/') && !p.includes('/tags/') || p.includes('/tags/'))
    .map(p => `<url><loc>${siteBaseUrl}${p}</loc></url>`)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  await fs.writeFile(path.join(outputDir, 'sitemap.xml'), xml);
  console.log('--- sitemap.xml oluşturuldu.');
}

module.exports = createSitemap;
