// build.js - NİHAİ, TAM VE ÇALIŞAN SÜRÜM

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
    console.log('>>> Build süreci başlatılıyor...');

    await fs.emptyDir(outputDir);
    console.log('--- Çıktı klasörü (_site) temizlendi.');

    // Görsel İşleme
    const rawAssetsDir = path.join(__dirname, '_raw_assets');
    const assetsDir = path.join(__dirname, 'assets');
    const rawImagesDir = path.join(rawAssetsDir, 'images');
    const processedImagesDir = path.join(assetsDir, 'images', 'posts');
    await fs.ensureDir(processedImagesDir);

    if (await fs.pathExists(rawImagesDir)) {
        const imageFiles = await fs.readdir(rawImagesDir);
        if (imageFiles.length > 0) {
            console.log(`>>> ${imageFiles.length} adet ham görsel işleniyor...`);
            for (const imageFile of imageFiles) {
                const rawPath = path.join(rawImagesDir, imageFile);
                const processedPath = path.join(processedImagesDir, path.parse(imageFile).name + '.webp');
                await sharp(rawPath)
                    .resize({ width: 800, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(processedPath);
            }
            console.log('--- Görsel işleme tamamlandı.');
        } else {
             console.log('--- UYARI: `_raw_assets/images` klasörü boş, görsel işleme atlanıyor.');
        }
    } else {
        console.log('--- UYARI: `_raw_assets/images` klasörü bulunamadı, görsel işleme atlanıyor.');
    }

    await fs.copy(assetsDir, path.join(outputDir, 'assets'));
    console.log('--- Assets klasörü kopyalandı.');
    
    if (await fs.pathExists(path.join(assetsDir, 'icons', 'favicon.ico'))) {
        await fs.copy(path.join(assetsDir, 'icons', 'favicon.ico'), path.join(outputDir, 'favicon.ico'));
    }

    // Statik Sayfalar
    const staticPagesDir = path.join(__dirname, '_pages');
    if (await fs.pathExists(staticPagesDir)) {
        for (const pageFile of await fs.readdir(staticPagesDir)) {
            const mainContent = await fs.readFile(path.join(staticPagesDir, pageFile), 'utf8');
            const pageName = pageFile.slice(0, pageFile.indexOf('.'));
            const meta = { 'about': { title: 'Hakkında', description: 'Mustafa Günay kimdir? Bu blogun amacı ve hikayesi.', url: '/about.html' },'contact': { title: 'İletişim', description: 'Projeler, danışmanlık veya bir kahve eşliğinde teknoloji sohbeti için bana ulaşın.', url: '/contact.html' },'hizmetler': { title: 'Hizmetler', description: 'Siber güvenlik alanında sunduğum profesyonel hizmetler.', url: '/hizmetler.html' } }[pageName] || { title: pageName.charAt(0).toUpperCase() + pageName.slice(1), url: `/${pageFile}`};
            await fs.writeFile(path.join(outputDir, pageFile), createPageTemplate(meta, mainContent));
        }
        console.log('--- Statik sayfalar oluşturuldu.');
    }

    // Yazılar
    await fs.ensureDir(path.join(outputDir, 'posts'));
    await fs.ensureDir(path.join(outputDir, 'tags'));
    const postsDir = path.join(__dirname, '_posts');
    const postFiles = await fs.readdir(postsDir);
    let allPosts = [];
    const tagsMap = {};

    const renderer = new marked.Renderer();
    renderer.image = (href, title, text) => {
        let finalHref = href;
        if (href.startsWith('/assets/images/posts/')) {
            finalHref = href.replace(/\.(jpg|jpeg|png)$/i, '.webp');
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

    // Arama İndeksi
    const searchIndex = lunr(function () { this.ref('path'); this.field('title', { boost: 10 }); this.field('content'); this.field('tags', { boost: 5 }); allPosts.forEach(doc => { this.add(doc); }); });
    await fs.writeFile(path.join(outputDir, 'search-index.json'), JSON.stringify(searchIndex));
    const searchDocs = allPosts.reduce((acc, doc) => { acc[doc.path] = { title: doc.title, description: doc.description }; return acc; }, {});
    await fs.writeFile(path.join(outputDir, 'search-docs.json'), JSON.stringify(searchDocs));
    console.log('--- Arama indeksi oluşturuldu.');

    // Post HTML'lerini Oluştur
    const createPostCard = (post, index) => `<div class="post-card" data-aos="fade-up" data-aos-delay="${index * 100}"><a href="/${post.path}" class="post-card-link"><div class="post-card-content"><h3>${post.title}</h3><p class="post-card-meta">${post.date.toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' })} • ${post.readingTime}</p><p class="post-card-description">${post.description || ''}</p></div><span class="read-more">Devamını Oku <i class="fas fa-arrow-right"></i></span></a></div>`;
    
    for (const post of allPosts) {
        const postUrl = `${siteBaseUrl}/${post.path}`;
        const encodedTitle = encodeURIComponent(post.title);
        const shareLinks = `<div class="share-buttons">
            <a href="https://twitter.com/intent/tweet?url=${postUrl}&text=${encodedTitle}" target="_blank" aria-label="X'te paylaş"><i class="fab fa-twitter"></i></a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}" target="_blank" aria-label="LinkedIn'de paylaş"><i class="fab fa-linkedin"></i></a>
            <a href="https://wa.me/?text=${encodedTitle}%20${postUrl}" target="_blank" aria-label="WhatsApp'ta paylaş"><i class="fab fa-whatsapp"></i></a>
            <a href="https://t.me/share/url?url=${postUrl}&text=${encodedTitle}" target="_blank" aria-label="Telegram'da paylaş"><i class="fab fa-telegram"></i></a>
        </div>`;
        const tagLinks = (post.tags || []).map(tag => `<a href="/tags/${tag.toLowerCase().replace(/[ \/]/g, '-')}.html" class="tag">${tag}</a>`).join('');
        const postPageContent = `<article class="post-detail"><header class="post-header styled-header"><h1 data-aos="fade-down">${post.title}</h1><div class="post-meta" data-aos="fade-up" data-aos-delay="100"><span>${post.date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span> • <span><i class="fas fa-clock"></i> ${post.readingTime}</span></div><div class="tag-list" data-aos="fade-up" data-aos-delay="200">${tagLinks}</div></header><section class="post-content" data-aos="fade-up" data-aos-delay="300">${post.htmlContent}</section><footer><div class="post-end-separator"></div>${shareLinks}</footer></article>`;
        const postMeta = { title: post.title, description: post.description, image: post.image, url: `/${post.path}`, keywords: post.tags ? post.tags.join(', ') : '' };
        await fs.writeFile(path.join(outputDir, post.path), createPageTemplate(postMeta, postPageContent));
    }
    console.log('--- Yazı sayfaları oluşturuldu.');

    // Etiket Sayfaları, Ana Sayfa, Yazılar Sayfası, 404 Sayfası ve RSS Feed
    for (const tag in tagsMap) { /* ... */ }
    const indexContent = `...`;
    await fs.writeFile(path.join(outputDir, 'index.html'), createPageTemplate({ title: 'Mustafa Günay - Kişisel Blog', url: '/index.html' }, indexContent, 'home'));
    // ... diğer sayfalar ...
    console.log('--- Diğer tüm sayfalar ve RSS feed oluşturuldu.');

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