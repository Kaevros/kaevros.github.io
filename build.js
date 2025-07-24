// build.js - NİHAİ SIDEBAR DÜZELTMELİ TAM SÜRÜM

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');
const lunr = require('lunr');
const readingTime = require('reading-time');
const RSS = require('rss');
const sharp = require('sharp');

const outputDir = path.join(__dirname, '_site');
const siteBaseUrl = 'https://kaevros.github.io';

function createPageTemplate(meta, mainContent, bodyClass = '') {
    const pageTitle = meta.title ? `${meta.title} - Mustafa Günay` : 'Mustafa Günay - Kişisel Blog';
    const pageDescription = meta.description || 'Siber güvenlik, network, yazılım ve teknoloji üzerine kişisel notlar ve teknik yazılar.';
    const pageImage = meta.image ? `${siteBaseUrl}${meta.image}` : `${siteBaseUrl}/assets/images/logo.svg`;
    const pageUrl = `${siteBaseUrl}${meta.url || ''}`;
    const pageKeywords = meta.keywords || 'siber güvenlik, blog, mustafa günay, kaevros, teknoloji, network, yazılım';

    const metaTagsHTML = `
        <meta name="description" content="${pageDescription}">
        <meta name="keywords" content="${pageKeywords}">
        <meta name="author" content="Mustafa Günay">
        <meta property="og:type" content="website">
        <meta property="og:title" content="${meta.title || 'Mustafa Günay - Kişisel Blog'}">
        <meta property="og:description" content="${pageDescription}">
        <meta property="og:image" content="${pageImage}">
        <meta property="og:url" content="${pageUrl}">
        <meta property="og:site_name" content="Mustafa Günay - Kişisel Blog">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${meta.title || 'Mustafa Günay - Kişisel Blog'}">
        <meta name="twitter:description" content="${pageDescription}">
        <meta name="twitter:image" content="${pageImage}">
    `;

    const rssLinkHTML = `<link rel="alternate" type="application/rss+xml" title="Mustafa Günay - Kişisel Blog RSS Feed" href="/feed.xml">`;
    const faviconHTML = `<link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png"><link rel="manifest" href="/assets/icons/site.webmanifest"><link rel="shortcut icon" href="/favicon.ico">`;
    const searchModalHTML = `<div id="search-modal" class="search-modal-overlay"><div class="search-modal-content"><div class="search-modal-header"><input type="text" id="search-modal-input" placeholder="Aranacak kelimeyi yazın..."><button id="search-modal-close" class="search-modal-close-btn">&times;</button></div><ul id="search-results-list"></ul></div></div>`;
    
    // NİHAİ DÜZELTME: Sidebar HTML yapısı daha sağlam hale getirildi.
    const sidebarHTML = `<div class="progress-bar" id="progress-bar"></div>
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-main">
                <div class="sidebar-header">
                    <div class="logo-container">
                        <a href="/index.html" aria-label="Ana Sayfa" id="logo-link"><img src="/assets/images/logo.svg" alt="Mustafa Günay Logo" class="sidebar-logo"></a>
                    </div>
                    <div class="sidebar-slogan">
                        <span class="slogan-en">Control is an illusion.</span>
                        <span class="slogan-tr">Kontrol bir illüzyondur.</span>
                    </div>
                    <button class="close-sidebar-btn" id="close-sidebar-btn" aria-label="Menüyü kapat"><i class="fas fa-times"></i></button>
                </div>
                <div class="search-container" id="search-trigger">
                    <i class="fas fa-search"></i>
                    <input type="text" id="search-input" placeholder="Blogda Ara..." readonly>
                </div>
                <nav class="sidebar-nav">
                    <ul>
                        <li class="nav-item"><a href="/index.html"><span class="icon"><i class="fas fa-home-alt"></i></span><span class="nav-text">Ana Sayfa</span></a></li>
                        <li class="nav-item"><a href="/about.html"><span class="icon"><i class="fas fa-user-secret"></i></span><span class="nav-text">Hakkında</span></a></li>
                        <li class="nav-item"><a href="/posts.html"><span class="icon"><i class="fas fa-file-alt"></i></span><span class="nav-text">Yazılar</span></a></li>
                        <li class="nav-item"><a href="/hizmetler.html"><span class="icon"><i class="fas fa-briefcase"></i></span><span class="nav-text">Hizmetler</span></a></li>
                        <li class="nav-item"><a href="/contact.html"><span class="icon"><i class="fas fa-paper-plane"></i></span><span class="nav-text">İletişim</span></a></li>
                    </ul>
                </nav>
            </div>
            <div class="sidebar-bottom">
                <button class="replay-animation-btn" id="replay-animation-btn" title="Giriş animasyonunu tekrar oynat"><i class="fas fa-power-off"></i></button>
                <button class="theme-toggle-btn" id="theme-toggle-btn" title="Temayı değiştir"><i class="fas fa-sun"></i><i class="fas fa-moon"></i></button>
                <div class="sidebar-footer">
                    <p>&copy; ${new Date().getFullYear()} Mustafa Günay</p>
                </div>
            </div>
        </aside>`;
    
    const welcomeScreenHTML = bodyClass.includes('home') ? `<div class="welcome-screen" id="welcome-screen"><h1 class="animated-title" id="blog-title">Mustafa Günay</h1><p class="welcome-message" id="welcome-message"></p><button class="skip-button" id="skip-button" aria-label="Girişi geç"><i class="fas fa-play"></i></button></div>` : '';
    const mainLayoutClass = bodyClass.includes('home') ? 'main-layout hidden' : 'main-layout';
    const backToTopButton = `<button id="back-to-top" class="back-to-top-btn" title="Yukarı dön"><i class="fas fa-arrow-up"></i></button>`;

    return `<!DOCTYPE html><html lang="tr" data-theme="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title>${metaTagsHTML}${rssLinkHTML}${faviconHTML}<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"><link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" /><link rel="stylesheet" href="/assets/css/style.css"></head><body class="${bodyClass}">${welcomeScreenHTML}<div class="${mainLayoutClass}">${sidebarHTML}<div class="mobile-menu-toggle" id="mobile-menu-toggle"><i class="fas fa-bars"></i><div class="logo-container mobile-logo-container"><a href="/index.html" id="mobile-logo-link"><img src="/assets/images/logo.svg" alt="Mustafa Günay Logo" class="sidebar-logo mobile-logo"></a></div></div><div class="content-wrapper"><main id="main-content">${mainContent}</main></div></div>${searchModalHTML}${backToTopButton}<script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.9/lunr.min.js"></script><script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script><script src="/assets/js/script.js"></script></body></html>`;
}

// buildSite() fonksiyonunun geri kalanını (image processing, post generation etc.) tam haliyle alttaki gibi ekliyorum.
async function buildSite() {
    console.log('>>> Build süreci başlatılıyor...');
    await fs.emptyDir(outputDir);
    console.log('--- Çıktı klasörü (_site) temizlendi.');
    const rawAssetsDir = path.join(__dirname, '_raw_assets');
    const assetsDir = path.join(__dirname, 'assets');
    const rawImagesDir = path.join(rawAssetsDir, 'images');
    const processedImagesDir = path.join(assetsDir, 'images', 'posts');
    await fs.ensureDir(processedImagesDir);
    if (await fs.pathExists(rawImagesDir)) {
        const imageFiles = await fs.readdir(rawImagesDir);
        if (imageFiles.length > 0) {
            console.log(`>>> ${imageFiles.length} adet ham görsel işleniyor...`);
            const supportedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.tiff', '.webp'];
            for (const imageFile of imageFiles) {
                const extension = path.extname(imageFile).toLowerCase();
                if (!supportedExtensions.includes(extension)) {
                    console.log(`--- UYARI: Desteklenmeyen dosya formatı atlanıyor: ${imageFile}`);
                    continue;
                }
                const rawPath = path.join(rawImagesDir, imageFile);
                const processedPath = path.join(processedImagesDir, path.parse(imageFile).name + '.webp');
                await sharp(rawPath).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(processedPath);
            }
            console.log('--- Görsel işleme tamamlandı.');
        } else {
             console.log('--- BİLGİ: `_raw_assets/images` klasörü boş, görsel işleme atlanıyor.');
        }
    } else {
        console.log('--- UYARI: `_raw_assets/images` klasörü bulunamadı, oluşturuluyor...');
        await fs.ensureDir(rawImagesDir);
    }
    await fs.copy(assetsDir, path.join(outputDir, 'assets'));
    console.log('--- Assets klasörü kopyalandı.');
    if (await fs.pathExists(path.join(assetsDir, 'icons', 'favicon.ico'))) {
        await fs.copy(path.join(assetsDir, 'icons', 'favicon.ico'), path.join(outputDir, 'favicon.ico'));
    }
    const staticPagesDir = path.join(__dirname, '_pages');
    if (await fs.pathExists(staticPagesDir)) {
        const staticPageFiles = await fs.readdir(staticPagesDir);
        for (const pageFile of staticPageFiles) {
            const mainContent = await fs.readFile(path.join(staticPagesDir, pageFile), 'utf8');
            const pageName = pageFile.slice(0, pageFile.indexOf('.'));
            const meta = { 'about': { title: 'Hakkında', description: 'Mustafa Günay kimdir?', url: '/about.html' },'contact': { title: 'İletişim', description: 'Bana ulaşın.', url: '/contact.html' },'hizmetler': { title: 'Hizmetler', description: 'Sunduğum hizmetler.', url: '/hizmetler.html' } }[pageName] || { title: pageName.charAt(0).toUpperCase() + pageName.slice(1), url: `/${pageFile}`};
            await fs.writeFile(path.join(outputDir, pageFile), createPageTemplate(meta, mainContent));
        }
        console.log(`--- ${staticPageFiles.length} adet statik sayfa oluşturuldu.`);
    }
    await fs.ensureDir(path.join(outputDir, 'posts'));
    await fs.ensureDir(path.join(outputDir, 'tags'));
    const postsDir = path.join(__dirname, '_posts');
    let allPosts = [];
    const tagsMap = {};
    if (await fs.pathExists(postsDir)) {
        const postFiles = await fs.readdir(postsDir);
        const renderer = new marked.Renderer();
        renderer.image = (href, title, text) => {
            let finalHref = href;
            if (href.startsWith('/assets/images/posts/')) {
                finalHref = href.replace(/\.(jpg|jpeg|png|gif|tiff)$/i, '.webp');
            }
            return `<a href="${finalHref}" class="glightbox" data-title="${title || text}"><img src="${finalHref}" alt="${text}" title="${title || text}" loading="lazy" decoding="async"></a>`;
        };
        marked.setOptions({ renderer });
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
            if (data.tags && Array.isArray(data.tags)) { data.tags.forEach(tag => { if (!tagsMap[tag]) tagsMap[tag] = []; tagsMap[tag].push(postData); }); }
        }
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log(`--- ${allPosts.length} adet yazı işlendi.`);
    } else {
        console.log('--- UYARI: `_posts` klasörü bulunamadı. Hiçbir yazı oluşturulmayacak.');
    }
    const searchIndex = lunr(function () { this.ref('path'); this.field('title', { boost: 10 }); this.field('content'); this.field('tags', { boost: 5 }); allPosts.forEach(doc => { this.add(doc); }); });
    await fs.writeFile(path.join(outputDir, 'search-index.json'), JSON.stringify(searchIndex));
    const searchDocs = allPosts.reduce((acc, doc) => { acc[doc.path] = { title: doc.title, description: doc.description }; return acc; }, {});
    await fs.writeFile(path.join(outputDir, 'search-docs.json'), JSON.stringify(searchDocs));
    console.log('--- Arama indeksi oluşturuldu.');
    const createPostCard = (post, index) => `<div class="post-card" data-aos="fade-up" data-aos-delay="${index * 100}"><a href="/${post.path}" class="post-card-link"><div class="post-card-content"><h3>${post.title}</h3><p class="post-card-meta">${post.date.toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' })} • ${post.readingTime}</p><p class="post-card-description">${post.description || ''}</p></div><span class="read-more">Devamını Oku <i class="fas fa-arrow-right"></i></span></a></div>`;
    for (const post of allPosts) {
        const postUrl = `${siteBaseUrl}/${post.path}`;
        const encodedTitle = encodeURIComponent(post.title);
        const shareLinks = `<div class="share-buttons"><a href="https://twitter.com/intent/tweet?url=${postUrl}&text=${encodedTitle}" target="_blank" aria-label="X'te paylaş"><i class="fab fa-twitter"></i></a><a href="https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}" target="_blank" aria-label="LinkedIn'de paylaş"><i class="fab fa-linkedin"></i></a><a href="https://wa.me/?text=${encodedTitle}%20${postUrl}" target="_blank" aria-label="WhatsApp'ta paylaş"><i class="fab fa-whatsapp"></i></a><a href="https://t.me/share/url?url=${postUrl}&text=${encodedTitle}" target="_blank" aria-label="Telegram'da paylaş"><i class="fab fa-telegram"></i></a></div>`;
        const tagLinks = (post.tags || []).map(tag => `<a href="/tags/${tag.toLowerCase().replace(/[ \/]/g, '-')}.html" class="tag">${tag}</a>`).join('');
        const postPageContent = `<article class="post-detail"><header class="post-header styled-header"><h1 data-aos="fade-down">${post.title}</h1><div class="post-meta" data-aos="fade-up" data-aos-delay="100"><span>${post.date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span> • <span><i class="fas fa-clock"></i> ${post.readingTime}</span></div><div class="tag-list" data-aos="fade-up" data-aos-delay="200">${tagLinks}</div></header><section class="post-content" data-aos="fade-up" data-aos-delay="300">${post.htmlContent}</section><footer><div class="post-end-separator"></div>${shareLinks}</footer></article>`;
        const postMeta = { title: post.title, description: post.description, image: post.image, url: `/${post.path}`, keywords: post.tags ? post.tags.join(', ') : '' };
        await fs.writeFile(path.join(outputDir, post.path), createPageTemplate(postMeta, postPageContent));
    }
    console.log('--- Yazı sayfaları oluşturuldu.');
    for (const tag in tagsMap) {
        const tagName = tag.toLowerCase().replace(/[ \/]/g, '-');
        const tagPageContent = `<section class="content-page"><div class="styled-header"><h2 data-aos="fade-down">'${tag}' Etiketli Yazılar</h2></div><div class="posts-grid">${tagsMap[tag].map((post, i) => createPostCard(post, i)).join('')}</div></section>`;
        const tagMeta = { title: `'${tag}' Etiketli Yazılar`, description: `'${tag}' etiketiyle ilgili tüm yazılar.`, url: `/tags/${tagName}.html` };
        await fs.writeFile(path.join(outputDir, 'tags', `${tagName}.html`), createPageTemplate(tagMeta, tagPageContent));
    }
    console.log('--- Etiket sayfaları oluşturuldu.');
    const indexContent = `<section class="hero-section" data-aos="fade-in"><p class="hero-subtitle">Teknolojiyi Anlamak, Güvenliği Sağlamak.</p></section><section class="latest-posts-section"><div class="styled-header"><h2 class="section-title" data-aos="fade-right">Son Keşifler</h2></div><div class="posts-grid">${allPosts.slice(0, 3).map((post, i) => createPostCard(post, i)).join('')}</div></section><section class="cta-section" data-aos="fade-up" data-aos-delay="200"><p>Daha derine inmeye hazır mısın?</p><div class="cta-buttons"><a href="/posts.html" class="cta-button">Tüm Yazıları Gör</a></div></section>`;
    await fs.writeFile(path.join(outputDir, 'index.html'), createPageTemplate({ title: 'Mustafa Günay - Kişisel Blog', url: '/index.html' }, indexContent, 'home'));
    const postsPageContent = `<section class="content-page"><div class="styled-header"><h2 data-aos="fade-down">Tüm Yazılar</h2></div><div class="posts-grid">${allPosts.map((post, i) => createPostCard(post, i)).join('')}</div></section>`;
    const postsMeta = { title: 'Tüm Yazılar', description: 'Tüm yazıların arşivi.', url: '/posts.html' };
    await fs.writeFile(path.join(outputDir, 'posts.html'), createPageTemplate(postsMeta, postsPageContent));
    console.log('--- Ana sayfa ve Yazılar sayfası oluşturuldu.');
    const recentPostsFor404 = allPosts.slice(0, 3).map(post => `<li><a href="/${post.path}">${post.title}</a></li>`).join('');
    const notFoundContent = `<div class="error-page-container"><h1 class="error-code animated-gradient-text">404</h1><h2 class="error-title">SAYFA BULUNAMADI</h2><p class="error-message">Aradığın sayfa ya hiç var olmadı ya da bir bit-flip kurbanı oldu. Endişelenme, en iyi sistemlerde bile olur.</p><div class="error-actions"><a href="/index.html" class="cta-button">Ana Sayfaya Dön</a></div><div class="error-recent-posts"><h3>Belki bunlardan birini arıyordun?</h3><ul>${recentPostsFor404}</ul></div></div>`;
    const notFoundMeta = { title: '404 - Sayfa Bulunamadı', url: '/404.html' };
    await fs.writeFile(path.join(outputDir, '404.html'), createPageTemplate(notFoundMeta, notFoundContent, 'error-page'));
    console.log('--- 404 sayfası oluşturuldu.');
    const feed = new RSS({ title: 'Mustafa Günay - Kişisel Blog', description: 'Siber güvenlik ve teknoloji üzerine yazılar.', feed_url: `${siteBaseUrl}/feed.xml`, site_url: siteBaseUrl, image_url: `${siteBaseUrl}/assets/images/logo.svg`, language: 'tr', pubDate: new Date(), copyright: `${new Date().getFullYear()} Mustafa Günay`, });
    for (const post of allPosts) {
        feed.item({ title: post.title, description: post.description, url: `${siteBaseUrl}/${post.path}`, guid: `${siteBaseUrl}/${post.path}`, author: 'Mustafa Günay', date: post.date, });
    }
    await fs.writeFile(path.join(outputDir, 'feed.xml'), feed.xml({ indent: true }));
    console.log('--- RSS feed oluşturuldu.');
    console.log('>>> Build süreci başarıyla tamamlandı!');
}

(async () => {
    try {
        await buildSite();
    } catch (error) {
        console.error("🔥🔥🔥 BUILD SÜRECİNDE KRİTİK BİR HATA OLUŞTU! 🔥🔥🔥");
        console.error(error);
        process.exit(1);
    }
})();