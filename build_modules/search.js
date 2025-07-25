// build_modules/search.js

const fs = require('fs-extra');
const path = require('path');
const lunr = require('lunr');

async function createSearchIndex(outputDir, allPosts) {
    const searchIndex = lunr(function () {
        this.ref('path');
        this.field('title', { boost: 10 });
        this.field('content');
        this.field('tags', { boost: 5 });
        allPosts.forEach(doc => {
            this.add(doc);
        });
    });

    await fs.writeFile(path.join(outputDir, 'search-index.json'), JSON.stringify(searchIndex));

    const searchDocs = allPosts.reduce((acc, doc) => {
        acc[doc.path] = { title: doc.title, description: doc.description };
        return acc;
    }, {});

    await fs.writeFile(path.join(outputDir, 'search-docs.json'), JSON.stringify(searchDocs));
    console.log('--- Arama indeksi oluşturuldu.');
}

module.exports = createSearchIndex;