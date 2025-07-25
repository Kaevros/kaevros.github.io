// build_modules/rss.js

const fs = require('fs-extra');
const path = require('path');
const RSS = require('rss');

const siteBaseUrl = 'https://kaevros.github.io';

async function createRssFeed(outputDir, allPosts) {
    const feed = new RSS({
        title: 'Kaevros - Kişisel Blog',
        description: 'Siber güvenlik ve teknoloji üzerine yazılar.',
        feed_url: `${siteBaseUrl}/feed.xml`,
        site_url: siteBaseUrl,
        image_url: `${siteBaseUrl}/assets/images/logo.svg`,
        language: 'tr',
        pubDate: new Date(),
        copyright: `${new Date().getFullYear()} Kaevros`,
    });

    for (const post of allPosts) {
        feed.item({
            title: post.title,
            description: post.description,
            url: `${siteBaseUrl}/${post.path}`,
            guid: `${siteBaseUrl}/${post.path}`,
            author: 'Kaevros',
            date: post.date,
        });
    }

    await fs.writeFile(path.join(outputDir, 'feed.xml'), feed.xml({ indent: true }));
    console.log('--- RSS akışı oluşturuldu.');
}

module.exports = createRssFeed;