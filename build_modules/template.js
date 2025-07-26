// build_modules/template.js - HTML parçalarını birleştiren modüler yapı

const fs = require('fs-extra');
const path = require('path');

const siteBaseUrl = 'https://kaevros.github.io';

const includesDir = path.join(__dirname, '..', '_includes');
const headTemplate = fs.readFileSync(path.join(includesDir, 'head.html'), 'utf8');
const sidebarTemplate = fs.readFileSync(path.join(includesDir, 'sidebar.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(includesDir, 'footer.html'), 'utf8');

function createPageTemplate(meta, mainContent, bodyClass = '') {
    const pageTitle = meta.title ? `${meta.title} - Kaevros` : 'Kaevros - Kişisel Blog';
    const pageDescription = meta.description || 'Siber güvenlik, network, yazılım ve teknoloji üzerine kişisel notlar ve teknik yazılar.';
    const pageImage = meta.image ? `${siteBaseUrl}${meta.image}` : `${siteBaseUrl}/assets/images/logo.svg`;
    const pageUrl = `${siteBaseUrl}${meta.url || ''}`;
    const pageKeywords = meta.keywords || 'siber güvenlik, blog, kaevros, teknoloji, network, yazılım';
    
    const metaTagsHTML = `<meta name="description" content="${pageDescription}"><meta name="keywords" content="${pageKeywords}"><meta name="author" content="Kaevros"><meta property="og:type" content="website"><meta property="og:title" content="${meta.title || 'Kaevros - Kişisel Blog'}"><meta property="og:description" content="${pageDescription}"><meta property="og:image" content="${pageImage}"><meta property="og:url" content="${pageUrl}"><meta property="og:site_name" content="Kaevros - Kişisel Blog"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${meta.title || 'Kaevros - Kişisel Blog'}"><meta name="twitter:description" content="${pageDescription}"><meta name="twitter:image" content="${pageImage}">`;
    const rssLinkHTML = `<link rel="alternate" type="application/rss+xml" title="Kaevros - Kişisel Blog RSS Feed" href="/feed.xml">`;
    const faviconHTML = `<link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png"><link rel="manifest" href="/assets/icons/site.webmanifest"><link rel="shortcut icon" href="/favicon.ico">`;
    
    const head = headTemplate
        .replace('{{PAGE_TITLE}}', pageTitle)
        .replace('{{META_TAGS}}', metaTagsHTML)
        .replace('{{RSS_LINK_TAG}}', rssLinkHTML)
        .replace('{{FAVICON_TAGS}}', faviconHTML);
        
    const sidebar = sidebarTemplate.replace('{{CURRENT_YEAR}}', new Date().getFullYear());
    
    const progressBarHTML = `<div class="progress-bar" id="progress-bar"></div>`;
    const animatedTitleHTML = 'Kaevros'.split('').map((char, index) => `<span style="--char-index: ${index};">${char}</span>`).join('');
    const welcomeScreenHTML = bodyClass.includes('home') ? `<div class="welcome-screen" id="welcome-screen"><div class="welcome-content"><h1 class="animated-title" id="blog-title">${animatedTitleHTML}</h1><p class="welcome-message" id="welcome-message"></p><button class="skip-button" id="skip-button" aria-label="Girişi geç"><i class="fas fa-chevron-right"></i></button></div></div>` : '';
    const mainLayoutClass = bodyClass.includes('home') ? 'main-layout hidden' : 'main-layout';

    return `
        <!DOCTYPE html>
        <html lang="tr">
            ${head}
            <body class="${bodyClass}">
                ${progressBarHTML}
                ${welcomeScreenHTML}
                <div class="${mainLayoutClass}">
                    ${sidebar}
                    <div class="mobile-menu-toggle" id="mobile-menu-toggle">
                        <i class="fas fa-bars"></i>
                        <div class="logo-container mobile-logo-container">
                            <a href="/index.html" id="mobile-logo-link">
                                <img src="/assets/images/logo.svg" alt="Kaevros Logo" class="sidebar-logo mobile-logo">
                            </a>
                        </div>
                    </div>
                    <div class="content-wrapper">
                        <main id="main-content">${mainContent}</main>
                    </div>
                </div>
                ${footerTemplate}
            </body>
        </html>
    `;
}

module.exports = createPageTemplate;