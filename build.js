// build.js - HTML YAPI HATASI DÜZELTİLMİŞ FİNAL VERSİYON

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const outputDir = path.join(__dirname, '_site');

// ANA HTML ŞABLONU: Tüm sayfalar bu iskeleti kullanacak.
// İçine sadece o sayfaya özel ana içerik (`mainContent`) gelecek.
function createPageTemplate(pageTitle, mainContent, bodyClass = '') {
    const sidebarHTML = `
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header"><h2 id="sidebar-blog-title">Mustafa Günay</h2><button class="close-sidebar-btn" id="close-sidebar-btn" aria-label="Menüyü kapat"><i class="fas fa-times"></i></button></div>
            <nav class="sidebar-nav">
                <ul>
                    <li class="nav-item"><a href="/index.html"><span class="icon"><i class="fas fa-home-alt"></i></span><span class="nav-text">Ana Sayfa</span></a></li>
                    <li class="nav-item"><a href="/about.html"><span class="icon"><i class="fas fa-user-secret"></i></span><span class="nav-text">Hakkında</span></a></li>
                    <li class="nav-item"><a href="/posts.html"><span class="icon"><i class="fas fa-file-alt"></i></span><span class="nav-text">Yazılar</span></a></li>
                    <li class="nav-item"><a href="/hizmetler.html"><span class="icon"><i class="fas fa-briefcase"></i></span><span class="nav-text">Hizmetler</span></a></li>
                    <li class="nav-item"><a href="/contact.html"><span class="icon"><i class="fas fa-paper-plane"></i></span><span class="nav-text">İletişim</span></a></li>
                </ul>
            </nav>
            <div class="sidebar-footer"><p>&copy; 2025 Mustafa Günay</p></div>
        </aside>
    `;

    // Ana sayfa ise karşılama ekranını ekle
    const welcomeScreenHTML = bodyClass.includes('home') ? `
        <div class="welcome-screen" id="welcome-screen">
            <h1 class="animated-title" id="blog-title">Mustafa Günay</h1>
            <p class="welcome-message" id="welcome-message"></p>
            <button class="skip-button" id="skip-button" aria-label="Girişi geç"><i class="fas fa-play"></i></button>
        </div>
    ` : '';
    
    // Ana sayfa ise 'hidden' class'ı ekle
    const mainLayoutClass = bodyClass.includes('home') ? 'main-layout hidden' : 'main-layout';

    return `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${pageTitle} - Mustafa Günay</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
            <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
            <link rel="stylesheet" href="/assets/css/style.css">
        </head>
        <body class="${bodyClass}">
            ${welcomeScreenHTML}
            <div class="${mainLayoutClass}">
                ${sidebarHTML}
                <div class="mobile-menu-toggle" id="mobile-menu-toggle"><i class="fas fa-bars"></i></div>
                <div class="content-wrapper">
                    <main id="main-content">
                        ${mainContent}
                    </main>
                </div>
            </div>
            <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
            <script src="/assets/js/script.js"></script>
        </body>
        </html>
    `;
}

async function buildSite() {
    console.log('Site oluşturma işlemi başlıyor...');
    
    await fs.emptyDir(outputDir);
    await fs.copy(path.join(__dirname, 'assets'), path.join(outputDir, 'assets'));
    
    // Statik sayfaları işle (about.html, etc.)
    const staticPages = ['about.html', 'hizmetler.html', 'contact.html'];
    for (const page of staticPages) {
        if (await fs.pathExists(path.join(__dirname, page))) {
            const fileContent = await fs.readFile(path.join(__dirname, page), 'utf8');
            const mainContent = fileContent.match(/<main id="main-content">([\s\S]*)<\/main>/)[1];
            const pageTitle = page.charAt(0).toUpperCase() + page.slice(1, page.indexOf('.'));
            const fullPage = createPageTemplate(pageTitle, mainContent);
            await fs.writeFile(path.join(outputDir, page), fullPage);
        }
    }

    await fs.ensureDir(path.join(outputDir, 'posts'));
    const postsDir = path.join(__dirname, '_posts');
    const postFiles = await fs.readdir(postsDir);
    let allPosts = [];

    for (const postFile of postFiles) {
        if (path.extname(postFile) !== '.md') continue;
        
        const fileContent = await fs.readFile(path.join(postsDir, postFile), 'utf8');
        const { data, content } = matter(fileContent);
        const htmlContent = marked(content);
        
        const postData = {
            title: data.title,
            date: new Date(data.date),
            path: `posts/${path.basename(postFile, '.md')}.html`,
            content: htmlContent
        };
        allPosts.push(postData);

        // Tekil yazı sayfası için içerik
        const postPageContent = `
            <article class="post-detail">
                <header class="post-header"><h1>${postData.title}</h1></header>
                <section class="post-content">${postData.content}</section>
            </article>
        `;
        const fullPageHtml = createPageTemplate(postData.title, postPageContent);
        await fs.writeFile(path.join(outputDir, postData.path), fullPageHtml);