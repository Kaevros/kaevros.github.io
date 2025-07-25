// build_modules/template.js

const siteBaseUrl = 'https://kaevros.github.io';

function createPageTemplate(meta, mainContent, bodyClass = '') {
    const pageTitle = meta.title ? `${meta.title} - Kaevros` : 'Kaevros - Kişisel Blog';
    const pageDescription = meta.description || 'Siber güvenlik, network, yazılım ve teknoloji üzerine kişisel notlar ve teknik yazılar.';
    const pageImage = meta.image ? `${siteBaseUrl}${meta.image}` : `${siteBaseUrl}/assets/images/logo.svg`;
    const pageUrl = `${siteBaseUrl}${meta.url || ''}`;
    const pageKeywords = meta.keywords || 'siber güvenlik, blog, kaevros, teknoloji, network, yazılım';
    
    const metaTagsHTML = `<meta name="description" content="${pageDescription}"><meta name="keywords" content="${pageKeywords}"><meta name="author" content="Kaevros"><meta property="og:type" content="website"><meta property="og:title" content="${meta.title || 'Kaevros - Kişisel Blog'}"><meta property="og:description" content="${pageDescription}"><meta property="og:image" content="${pageImage}"><meta property="og:url" content="${pageUrl}"><meta property="og:site_name" content="Kaevros - Kişisel Blog"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${meta.title || 'Kaevros - Kişisel Blog'}"><meta name="twitter:description" content="${pageDescription}"><meta name="twitter:image" content="${pageImage}">`;
    const rssLinkHTML = `<link rel="alternate" type="application/rss+xml" title="Kaevros - Kişisel Blog RSS Feed" href="/feed.xml">`;
    const faviconHTML = `<link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png"><link rel="manifest" href="/assets/icons/site.webmanifest"><link rel="shortcut icon" href="/favicon.ico">`;
    
    const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <a href="/index.html" aria-label="Ana Sayfa" id="logo-link" class="logo-container">
                <img src="/assets/images/logo.svg" alt="Kaevros Logo" class="sidebar-logo">
            </a>
            <button class="close-sidebar-btn" id="close-sidebar-btn" aria-label="Menüyü kapat"><i class="fas fa-times"></i></button>
        </div>
        <div class="sidebar-content">
            <div class="sidebar-slogan">
                <span class="slogan-en">Control is an illusion.</span>
                <span class="slogan-tr">Kontrol bir illüzyondur.</span>
            </div>
            <div class="search-container" id="search-trigger">
                <i class="fas fa-search"></i>
                <input type="text" id="search-input" placeholder="Nereye baktın en son?" readonly>
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
        <div class="sidebar-footer">
            <div class="sidebar-bottom-actions">
                <button class="replay-animation-btn" id="replay-animation-btn" title="Giriş animasyonunu tekrar oynat"><i class="fas fa-power-off"></i></button>
                <button class="theme-toggle-btn" id="theme-toggle-btn" title="Temayı değiştir"><i class="fas fa-sun"></i><i class="fas fa-moon"></i></button>
            </div>
            <p class="copyright">&copy; ${new Date().getFullYear()} Kaevros</p>
        </div>
    </aside>`;
    
    const searchModalHTML = `<div id="search-modal" class="search-modal-overlay"><div class="search-modal-content"><div class="search-modal-header"><input type="text" id="search-modal-input" placeholder="Aranacak kelimeyi yazın..."><button id="search-modal-close" class="search-modal-close-btn">&times;</button></div><ul id="search-results-list"></ul></div></div>`;
    const animatedTitleHTML = 'Kaevros'.split('').map((char, index) => `<span style="--char-index: ${index};">${char}</span>`).join('');
    const welcomeScreenHTML = bodyClass.includes('home') ? `<div class="welcome-screen" id="welcome-screen"><div class="welcome-content"><h1 class="animated-title" id="blog-title">${animatedTitleHTML}</h1><p class="welcome-message" id="welcome-message"></p><button class="skip-button" id="skip-button" aria-label="Girişi geç"><i class="fas fa-chevron-right"></i></button></div></div>` : '';
    const mainLayoutClass = bodyClass.includes('home') ? 'main-layout hidden' : 'main-layout';
    const backToTopButtonHTML = `<button id="back-to-top" class="back-to-top-btn" title="Yukarı dön"><i class="fas fa-arrow-up"></i></button>`;
    const progressBarHTML = `<div class="progress-bar" id="progress-bar"></div>`;

    return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title>${metaTagsHTML}${rssLinkHTML}${faviconHTML}<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"><link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" /><link rel="stylesheet" href="/assets/css/style.css"></head><body class="${bodyClass}">${progressBarHTML}${welcomeScreenHTML}<div class="${mainLayoutClass}">${sidebarHTML}<div class="mobile-menu-toggle" id="mobile-menu-toggle"><i class="fas fa-bars"></i><div class="logo-container mobile-logo-container"><a href="/index.html" id="mobile-logo-link"><img src="/assets/images/logo.svg" alt="Kaevros Logo" class="sidebar-logo mobile-logo"></a></div></div><div class="content-wrapper"><main id="main-content">${mainContent}</main></div></div>${searchModalHTML}${backToTopButtonHTML}<script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.9/lunr.min.js"></script><script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script><script src="/assets/js/script.js" type="module"></script></body></html>`;
}

module.exports = createPageTemplate;