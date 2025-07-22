// build.js - ARAMA, ETİKETLER, OKUMA SÜRESİ GİBİ TÜM YENİ ÖZELLİKLERİ İÇEREN NİHAİ VERSİYON
const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');
const lunr = require('lunr');
const readingTime = require('reading-time');

const outputDir = path.join(__dirname, '_site');

function createPageTemplate(pageTitle, mainContent, bodyClass = '') {
    const faviconHTML = `<link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png"><link rel="manifest" href="/assets/icons/site.webmanifest">`;
    const sidebarHTML = `<div class="progress-bar" id="progress-bar"></div><aside class="sidebar" id="sidebar"><div class="sidebar-header"><div class="logo-container"><a href="/index.html" aria-label="Ana Sayfa"><img src="/assets/images/logo.svg" alt="Mustafa Günay Logo" class="sidebar-logo"></a></div><button class="close-sidebar-btn" id="close-sidebar-btn" aria-label="Menüyü kapat"><i class="fas fa-times"></i></button></div><div class="search-container"><input type="text" id="search-input" placeholder="Blogda Ara..."><i class="fas fa-search"></i></div><nav class="sidebar-nav"><ul><li class="nav-item"><a href="/index.html"><span class="icon"><i class="fas fa-home-alt"></i></span><span class="nav-text">Ana Sayfa</span></a></li><li class="nav-item"><a href="/about.html"><span class="icon"><i class="fas fa-user-secret"></i></span><span class="nav-text">Hakkında</span></a></li><li class="nav-item"><a href="/posts.html"><span class="icon"><i class="fas fa-file-alt"></i></span><span class="nav-text">Yazılar</span></a></li><li class="nav-item"><a href="/hizmetler.html"><span class="icon"><i class="fas fa-briefcase"></i></span><span class="nav-text">Hizmetler</span></a></li><li class="nav-item"><a href="/contact.html"><span class="icon"><i class="fas fa-paper-plane"></i></span><span class="nav-text">İletişim</span></a></li></ul></nav><button class="replay-animation-btn" id="replay-animation-btn" title="Giriş animasyonunu tekrar oynat"><i class="fas fa-power-off"></i></button><div class="sidebar-footer"><p>&copy; ${new Date().getFullYear()} Mustafa Günay</p></div></aside>`;
    const welcomeScreenHTML = bodyClass.includes('home') ? `<div class="welcome-screen" id="welcome-screen"><h1 class="animated-title" id="blog-title">Mustafa Günay</h1><p class="welcome-message" id="welcome-message"></p><button class="skip-button" id="skip-button" aria-label="Girişi geç"><i class="fas fa-play"></i></button></div>` : '';
    const mainLayoutClass = bodyClass.includes('home') ? 'main-layout hidden' : 'main-layout';
    return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle} - Mustafa Günay</title>${faviconHTML}<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"><link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"><link rel="stylesheet" href="/assets/css/style.css"></head><body class="${bodyClass}">${welcomeScreenHTML}<div class="${mainLayoutClass}">${sidebarHTML}<div class="mobile-menu-toggle" id="mobile-menu-toggle"><i class="fas fa-bars"></i><div class="logo-container mobile-logo-container"><a href="/index.html" aria-label="Ana Sayfa"><img src="/assets/images/logo.svg" alt="Mustafa Günay Logo" class="sidebar-logo mobile-logo"></a></div></div><div class="content-wrapper"><div id="search-results-container"></div><main id="main-content">${mainContent}</main></div></div><script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.9/lunr.min.js"></script><script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script><script src="/assets/js/script.js"></script></body></html>`;
}
async function buildSite() {
    await fs.emptyDir(outputDir);
    await fs.copy(path.join(__dirname, 'assets'), path.join(outputDir, 'assets'));
    const staticPagesDir = path.join(__dirname, '_pages');
    if(await fs.pathExists(staticPagesDir)){ for (const pageFile of await fs.readdir(staticPagesDir)) { const fileContent = await fs.readFile(path.join(staticPagesDir, pageFile), 'utf8'); const pageTitle = pageFile.charAt(0).toUpperCase() + pageFile.slice(1, pageFile.indexOf('.')); await fs.writeFile(path.join(outputDir, pageFile), createPageTemplate(pageTitle, fileContent)); } }
    
    await fs.ensureDir(path.join(outputDir, 'posts'));
    await fs.ensureDir(path.join(outputDir, 'tags'));
    const postsDir = path.join(__dirname, '_posts');
    const postFiles = await fs.readdir(postsDir);
    let allPosts = [];
    const tagsMap = {};
    
    for (const postFile of postFiles) {
        if (path.extname(postFile) !== '.md') continue;
        const fileContent = await fs.readFile(path.join(postsDir, postFile), 'utf8');
        const { data, content } = matter(fileContent);
        if (!data.title) { data.title = "Başlık Eksik"; }
        if (!data.date) { data.date = new Date().toISOString(); }
        const stats = readingTime(content);
        const postData = { ...data, date: new Date(data.date), path: `posts/${path.basename(postFile, '.md')}.html`, content: content, htmlContent: marked(content), readingTime: stats.text };
        allPosts.push(postData);
        if (data.tags && Array.isArray(data.tags)) {
            data.tags.forEach(tag => {
                if (!tagsMap[tag]) tagsMap[tag] = [];
                tagsMap[tag].push(postData);
            });
        }
    }
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Arama indeksi oluştur
    const searchIndex = lunr(function () { this.ref('path'); this.field('title'); this.field('content'); this.field('tags'); allPosts.forEach(doc => { this.add(doc); }); });
    await fs.writeFile(path.join(outputDir, 'search-index.json'), JSON.stringify(searchIndex));
    const searchDocs = allPosts.reduce((acc, doc) => { acc[doc.path] = { title: doc.title, description: doc.description }; return acc; }, {});
    await fs.writeFile(path.join(outputDir, 'search-docs.json'), JSON.stringify(searchDocs));

    const createPostCard = (post, index) => `<div class="post-card" data-aos="fade-up" data-aos-delay="${index * 100}"><div class="post-card-content"><h3>${post.title}</h3><p class="post-card-meta">${post.date.toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' })} • ${post.readingTime}</p><p class="post-card-description">${post.description || ''}</p></div><a href="/${post.path}" class="read-more">Devamını Oku &rarr;</a></div>`;
    
    for (const post of allPosts) {
        const tagLinks = (post.tags || []).map(tag => `<a href="/tags/${tag.toLowerCase().replace(/ /g, '-')}.html" class="tag">${tag}</a>`).join('');
        const shareLinks = `<div class="share-buttons"><a href="https://twitter.com/intent/tweet?url=https://kaevros.github.io/${post.path}&text=${encodeURIComponent(post.title)}" target="_blank">Twitter</a><a href="https://www.linkedin.com/shareArticle?mini=true&url=https://kaevros.github.io/${post.path}" target="_blank">LinkedIn</a></div>`;
        const postPageContent = `<article class="post-detail"><header class="post-header"><h1>${post.title}</h1><div class="post-meta"><span>${post.date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span> • <span><i class="fas fa-clock"></i> ${post.readingTime}</span></div><div class="tag-list">${tagLinks}</div></header><section class="post-content">${post.htmlContent}</section><footer>${shareLinks}</footer></article>`;
        await fs.writeFile(path.join(outputDir, post.path), createPageTemplate(post.title, postPageContent));
    }

    for (const tag in tagsMap) {
        const tagName = tag.toLowerCase().replace(/ /g, '-');
        const tagPageContent = `<section class="content-page"><h2 data-aos="fade-down">'${tag}' Etiketli Yazılar</h2><div class="posts-grid">${tagsMap[tag].map((post, i) => createPostCard(post, i)).join('')}</div></section>`;
        await fs.writeFile(path.join(outputDir, 'tags', `${tagName}.html`), createPageTemplate(`${tag} Yazıları`, tagPageContent));
    }
    
    const indexContent = `<section class="hero-section" data-aos="fade-in"><h1 class="hero-title">Mustafa Günay</h1><p class="hero-subtitle">Teknoloji ve Güvenlik Araştırmacısı</p></section><section class="latest-posts-section"><h2 class="section-title" data-aos="fade-right">Son Keşifler</h2><div class="posts-grid">${allPosts.slice(0, 3).map((post, i) => createPostCard(post, i)).join('')}</div></section><section class="cta-section" data-aos="fade-up"><p>Daha derine inmeye hazır mısın?</p><div class="cta-buttons"><a href="/posts.html" class="cta-button">Tüm Yazıları Gör</a></div></section>`;
    await fs.writeFile(path.join(outputDir, 'index.html'), createPageTemplate('Ana Sayfa', indexContent, 'home'));
    
    const postsPageContent = `<section class="content-page"><h2 data-aos="fade-down">Tüm Yazılar</h2><div class="posts-grid">${allPosts.map((post, i) => createPostCard(post, i)).join('')}</div></section>`;
    await fs.writeFile(path.join(outputDir, 'posts.html'), createPageTemplate('Yazılar', postsPageContent));

    console.log('Site başarıyla ve hatasız oluşturuldu!');
}
buildSite();