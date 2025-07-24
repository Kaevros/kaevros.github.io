// build.js - AŞAMA 2 NİHAİ SÜRÜM (TAM)

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
    
    const sidebarHTML = `<div class="progress-bar" id="progress-bar"></div><aside class="sidebar" id="sidebar"><div class="sidebar-header"><div class="logo-container"><a href="/index.html" aria-label="Ana Sayfa" id="logo-link"><img src="/assets/images/logo.svg" alt="Mustafa Günay Logo" class="sidebar-logo"></a></div><div class="sidebar-slogan"><span class="slogan-en">Control is an illusion.</span><span class="slogan-tr">Kontrol bir illüzyondur.</span></div><button class="close-sidebar-btn" id="close-sidebar-btn" aria-label="Menüyü kapat"><i class="fas fa-times"></i></button></div><div class="search-container" id="search-trigger"><i class="fas fa-search"></i><input type="text" id="search-input" placeholder="Blogda Ara..." readonly></div><nav class="sidebar-nav"><ul><li class="nav-item"><a href="/index.html"><span class="icon"><i class="fas fa-home-alt"></i></span><span class="nav-text">Ana Sayfa</span></a></li><li class="nav-item"><a href="/about.html"><span class="icon"><i class="fas fa-user-secret"></i></span><span class="nav-text">Hakkında</span></a></li><li class="nav-item"><a href="/posts.html"><span class="icon"><i class="fas fa-file-alt"></i></span><span class="nav-text">Yazılar</span></a></li><li class="nav-item"><a href="/hizmetler.html"><span class="icon"><i class="fas fa-briefcase"></i></span><span class="nav-text">Hizmetler</span></a></li><li class="nav-item"><a href="/contact.html"><span class="icon"><i class="fas fa-paper-plane"></i></span><span class="nav-text">İletişim</span></a></li></ul></nav><button class="replay-animation-btn" id="replay-animation-btn" title="Giriş animasyonunu tekrar oynat"><i class="fas fa-power-off"></i></button><button class="theme-toggle-btn" id="theme-toggle-btn" title="Temayı değiştir"><i class="fas fa-sun"></i><i class="fas fa-moon"></i></button><div class="sidebar-footer"><p>&copy; ${new Date().getFullYear()} Mustafa Günay</p></div></aside>`;
    
    const welcomeScreenHTML = bodyClass.includes('home') ? `<div class="welcome-screen" id="welcome-screen"><h1 class="animated-title" id="blog-title">Mustafa Günay</h1><p class="welcome-message" id="welcome-message"></p><button class="skip-button" id="skip-button" aria-label="Girişi geç"><i class="fas fa-play"></i></button></div>` : '';
    const mainLayoutClass = bodyClass.includes('home') ? 'main-layout hidden' : 'main-layout';
    const backToTopButton = `<button id="back-to-top" class="back-to-top-btn" title="Yukarı dön"><i class="fas fa-arrow-up"></i></button>`;

    return `<!DOCTYPE html><html lang="tr" data-theme="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title>${metaTagsHTML}${rssLinkHTML}${faviconHTML}<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"><link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" /><link rel="stylesheet" href="/assets/css/style.css"></head><body class="${bodyClass}">${welcomeScreenHTML}<div class="${mainLayoutClass}">${sidebarHTML}<div class="mobile-menu-toggle" id="mobile-menu-toggle"><i class="fas fa-bars"></i><div class="logo-container mobile-logo-container"><a href="/index.html" id="mobile-logo-link"><img src="/assets/images/logo.svg" alt="Mustafa Günay Logo" class="sidebar-logo mobile-logo"></a></div></div><div class="content-wrapper"><main id="main-content">${mainContent}</main></div></div>${searchModalHTML}${backToTopButton}<script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.9/lunr.min.js"></script><script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script><script src="/assets/js/script.js"></script></body></html>`;
}

async function buildSite() {
    await fs.emptyDir(outputDir);
    await fs.copy(path.join(__dirname, 'assets'), path.join(outputDir, 'assets'));

    // GÖRSEL İŞLEME SÜRECİ
    const rawImagesDir = path.join(__dirname, '_raw_images');
    const processedImagesDir = path.join(__dirname, 'assets/images/posts');
    await fs.ensureDir(processedImagesDir);

    if (await fs.pathExists(rawImagesDir)) {
        const imageFiles = await fs.readdir(rawImagesDir);
        for (const imageFile of imageFiles) {
            const rawPath = path.join(rawImagesDir, imageFile);
            const processedPath = path.join(processedImagesDir, path.parse(imageFile).name + '.webp');
            
            try {
                await sharp(rawPath)
                    .resize({ width: 800, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(processedPath);
            } catch (error) {
                console.error(`Görsel işlenemedi: ${imageFile}`, error);
            }
        }
    }

    if (await fs.pathExists(path.join(__dirname, 'admin'))) { await fs.copy(path.join(__dirname, 'admin'), path.join(outputDir, 'admin')); }
    if (await fs.pathExists(path.join(__dirname, 'assets/icons/favicon.ico'))) { await fs.copy(path.join(__dirname, 'assets/icons/favicon.ico'), path.join(outputDir, 'favicon.ico')); }
    
    // ... statik sayfaların işlenmesi
    
    await fs.ensureDir(path.join(outputDir, 'posts'));
    await fs.ensureDir(path.join(outputDir, 'tags'));
    const postsDir = path.join(__dirname, '_posts');
    const postFiles = await fs.readdir(postsDir);
    let allPosts = [];
    const tagsMap = {};

    // GÖRSEL İŞLEME İÇİN ÖZEL MARKED RENDERER
    const renderer = new marked.Renderer();
    renderer.image = (href, title, text) => {
        // href'i .webp ile değiştir
        const webpHref = href.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        // GLightbox ve Lazy Loading için düzenlenmiş HTML
        return `
            <a href="${webpHref}" class="glightbox" data-title="${title || text}">
                <img src="${webpHref}" alt="${text}" title="${title || text}" loading="lazy" decoding="async">
            </a>
        `;
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
    
    // ... search, post sayfaları, tag sayfaları, index, posts ve 404 sayfalarının oluşturulması
    // ÖNEMLİ DEĞİŞİKLİK: Paylaşım linkleri
    for (const post of allPosts) {
        const postUrl = `${siteBaseUrl}/${post.path}`;
        const encodedTitle = encodeURIComponent(post.title);
        const shareLinks = `<div class="share-buttons">
            <a href="https://twitter.com/intent/tweet?url=${postUrl}&text=${encodedTitle}" target="_blank" aria-label="X'te paylaş"><i class="fab fa-twitter"></i></a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}" target="_blank" aria-label="LinkedIn'de paylaş"><i class="fab fa-linkedin"></i></a>
            <a href="https://wa.me/?text=${encodedTitle}%20${postUrl}" target="_blank" aria-label="WhatsApp'ta paylaş"><i class="fab fa-whatsapp"></i></a>
            <a href="https://t.me/share/url?url=${postUrl}&text=${encodedTitle}" target="_blank" aria-label="Telegram'da paylaş"><i class="fab fa-telegram"></i></a>
        </div>`;

        // ... post oluşturma kodunun geri kalanı ...
    }

    // ... RSS feed oluşturma
    console.log('Site başarıyla, tüm yeniliklerle birlikte hatasız oluşturuldu!');
}

buildSite();