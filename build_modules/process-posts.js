// build_modules/process-posts.js

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');
const readingTime = require('reading-time');
const createPageTemplate = require('./template');

const siteBaseUrl = 'https://kaevros.github.io';

async function processPosts(outputDir) {
    await fs.ensureDir(path.join(outputDir, 'posts'));
    await fs.ensureDir(path.join(outputDir, 'tags'));
    
    const postsDir = path.join(__dirname, '..', '_posts');
    const postFiles = await fs.readdir(postsDir);
    let allPosts = [];
    const tagsMap = {};

    for (const postFile of postFiles) {
        if (path.extname(postFile) !== '.md') continue;
        const fileContent = await fs.readFile(path.join(postsDir, postFile), 'utf8');
        const { data, content } = matter(fileContent);
        
        data.title = data.title || "Başlık Eksik";
        data.date = data.date || new Date().toISOString();
        
        const stats = readingTime(content);
        const postPath = `posts/${path.basename(postFile, '.md')}.html`;
        
        const postData = { ...data, date: new Date(data.date), path: postPath, content: content, htmlContent: marked(content), readingTime: stats.text };
        allPosts.push(postData);

        if (data.tags && Array.isArray(data.tags)) {
            data.tags.forEach(tag => {
                if (!tagsMap[tag]) tagsMap[tag] = [];
                tagsMap[tag].push(postData);
            });
        }
    }

    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    for (const post of allPosts) {
        const postMeta = { title: post.title, description: post.description, image: post.image, url: `/${post.path}`, keywords: post.tags ? post.tags.join(', ') : '' };
        const shareLinks = `<div class="share-buttons"><a href="https://twitter.com/intent/tweet?url=${siteBaseUrl}/${post.path}&text=${encodeURIComponent(post.title)}" target="_blank" aria-label="X'te paylaş"><i class="fab fa-twitter"></i></a><a href="https://www.linkedin.com/shareArticle?mini=true&url=${siteBaseUrl}/${post.path}" target="_blank" aria-label="LinkedIn'de paylaş"><i class="fab fa-linkedin"></i></a><a href="https://wa.me/?text=${encodeURIComponent(post.title)}%20${siteBaseUrl}/${post.path}" target="_blank" aria-label="WhatsApp'ta paylaş"><i class="fab fa-whatsapp"></i></a><a href="https://t.me/share/url?url=${siteBaseUrl}/${post.path}&text=${encodeURIComponent(post.title)}" target="_blank" aria-label="Telegram'da paylaş"><i class="fab fa-telegram"></i></a></div>`;
        const tagLinks = (post.tags || []).map(tag => `<a href="/tags/${tag.toLowerCase().replace(/[ \/]/g, '-')}.html" class="tag">${tag}</a>`).join('');
        const postPageContent = `<article class="post-detail"><header class="post-header styled-header"><h1 data-aos="fade-down" class="animated-gradient-text">${post.title}</h1><div class="post-meta" data-aos="fade-up" data-aos-delay="100"><span>${post.date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span> • <span><i class="fas fa-clock"></i> ${post.readingTime}</span></div><div class="tag-list" data-aos="fade-up" data-aos-delay="200">${tagLinks}</div></header><section class="post-content" data-aos="fade-up" data-aos-delay="300">${post.htmlContent}</section><footer><div class="post-end-separator"></div>${shareLinks}</footer></article>`;
        await fs.writeFile(path.join(outputDir, post.path), createPageTemplate(postMeta, postPageContent));
    }
    
    console.log(`--- ${allPosts.length} adet yazı işlendi.`);
    
    const createPostCard = (post, index) => `<div class="post-card" data-aos="fade-up" data-aos-delay="${index * 50}"><a href="/${post.path}" class="post-card-link"><div class="post-card-content"><h3>${post.title}</h3><p class="post-card-meta">${post.date.toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' })} • ${post.readingTime}</p><p class="post-card-description">${post.description || ''}</p></div><div class="post-card-footer"><span class="read-more">Devamını Oku <i class="fas fa-arrow-right"></i></span></div></a></div>`;
    for (const tag in tagsMap) {
        const tagName = tag.toLowerCase().replace(/[ \/]/g, '-');
        const tagPageContent = `<section class="content-page"><div class="styled-header"><h2 data-aos="fade-down" class="animated-gradient-text orange-heavy">'${tag}' Etiketli Yazılar</h2></div><div class="posts-grid">${tagsMap[tag].map((post, i) => createPostCard(post, i)).join('')}</div></section>`;
        const tagMeta = { title: `'${tag}' Etiketli Yazılar`, description: `'${tag}' etiketiyle ilgili tüm yazılar.`, url: `/tags/${tagName}.html` };
        await fs.writeFile(path.join(outputDir, 'tags', `${tagName}.html`), createPageTemplate(tagMeta, tagPageContent));
    }
    console.log(`--- Etiket sayfaları oluşturuldu.`);

    return allPosts;
}

module.exports = processPosts;