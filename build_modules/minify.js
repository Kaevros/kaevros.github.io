const fs = require('fs-extra');
const path = require('path');

function minifyHtml(html) {
  // Remove HTML comments
  let out = html.replace(/<!--([\s\S]*?)-->/g, '');
  // Collapse whitespace between tags
  out = out.replace(/>\s+</g, '><');
  // Trim leading/trailing whitespace
  out = out.trim();
  return out;
}

async function minifyOutputHtml(outputDir) {
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.isFile() && e.name.endsWith('.html')) {
        const content = await fs.readFile(full, 'utf8');
        const min = minifyHtml(content);
        await fs.writeFile(full, min);
      }
    }
  }
  await walk(outputDir);
  console.log('--- HTML minify işlemi tamamlandı.');
}

module.exports = minifyOutputHtml;
