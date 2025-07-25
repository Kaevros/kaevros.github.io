// build_modules/process-pages.js

const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const createPageTemplate = require('./template');

async function processPages(outputDir) {
    const staticPagesDir = path.join(__dirname, '..', '_pages');
    if (await fs.pathExists(staticPagesDir)) {
        const pageFiles = await fs.readdir(staticPagesDir);
        for (const pageFile of pageFiles) {
            const fileContent = await fs.readFile(path.join(staticPagesDir, pageFile), 'utf8');
            const { data: meta, content: mainContent } = matter(fileContent);
            if (!meta.url) meta.url = `/${pageFile}`;
            const bodyClass = pageFile.includes('index.html') ? 'home' : '';
            await fs.writeFile(path.join(outputDir, pageFile), createPageTemplate(meta, mainContent, bodyClass));
        }
        console.log(`--- ${pageFiles.length} adet statik sayfa oluşturuldu.`);
    }
}

module.exports = processPages;