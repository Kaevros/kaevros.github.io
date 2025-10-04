const fs = require('fs-extra');
const path = require('path');

const siteBaseUrl = 'https://kaevros.github.io';

async function createRobots(outputDir) {
  const robots = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${siteBaseUrl}/sitemap.xml`
  ].join('\n');
  await fs.writeFile(path.join(outputDir, 'robots.txt'), robots);
  console.log('--- robots.txt oluşturuldu.');
}

module.exports = createRobots;
