// build.js - ANİMASYON VE STİL HATALARI DÜZELTİLMİŞ FİNAL VERSİYON

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const outputDir = path.join(__dirname, '_site');

// Ana HTML şablonumuz. Artık body için özel class alabiliyor.
function createPageTemplate(pageTitle, content, bodyClass = '') {
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

    // DÜZELTME: Ana sayfa ise body'e 'home' class'ı ekleniyor.
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
            ${content}
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
    
    // Statik sayfaları kopyala
    const staticPages = ['about.html', 'hizmetler.html', 'contact.html'];
    for (const page of staticPages) {
        if (await fs.pathExists(path.join(__dirname, page))) {
            const pageContent = await fs.readFile(path.join(__dirname, page), 'utf8');
            const fullPage = createPageTemplate(page.split('.')[0], pageContent); // Basit başlık
            await fs.writeFile(path.join(outputDir, page), fullPage);
        }
    }

    // Yazıları işle
    const postsDir = path.join(__dirname, '_posts');
    await fs.ensureDir(path.join(outputDir, 'posts')); // 'posts' klasörünün var olduğundan emin ol
    const postFiles = await fs.readdir(postsDir);
    const allPosts = [];

    for (const postFile of postFiles) {
        if (path.extname(postFile) !== '.md') continue;
        
        const fileContent = await fs.readFile(path.join(postsDir, postFile), 'utf8');
        const { data, content } = matter(fileContent);
        const htmlContent = marked(content);
        
        const postData = {
            title: data.title,
            date: new Date(data.date),
            path: `${path.basename(postFile, '.md')}.html`,
            content: `
                <div class="main-layout">
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
                    <div class="mobile-menu-toggle" id="mobile-menu-toggle"><i class="fas fa-bars"></i></div>
                    <div class="content-wrapper">
                        <main id="main-content">
                            <article class="post-detail">
                                <header class="post-header"><h1>${data.title}</h1></header>
                                <section class="post-content">${htmlContent}</section>
                            </article>
                        </main>
                    </div>
                </div>
            `
        };
        allPosts.push(postData);

        const fullPageHtml = createPageTemplate(postData.title, postData.content);
        await fs.writeFile(path.join(outputDir, 'posts', postData.path), fullPageHtml);
    }
    
    allPosts.sort((a, b) => b.date - a.date);

    const createPostCard = (post) => `
        <div class="post-card" data-aos="fade-up">
            <a href="/posts/${post.path}" class="post-card-link">
                <div class="post-card-content">
                    <h3>${post.title}</h3>
                    <p>Yayın Tarihi: ${post.date.toLocaleDateString('tr-TR')}</p>
                </div>
                <span class="read-more">İncelemeye Başla &rarr;</span>
            </a>
        </div>
    `;

    const postsGrid = `<div class="posts-grid">${allPosts.map(createPostCard).join('')}</div>`;
    
    // DÜZELTME: Ana sayfa için welcome-screen ve doğru yapı eklendi.
    const indexContent = `
        <div class="welcome-screen" id="welcome-screen">
            <h1 class="animated-title" id="blog-title">Mustafa Günay</h1>
            <p class="welcome-message" id="welcome-message"></p>
            <button class="skip-button" id="skip-button" aria-label="Girişi geç"><i class="fas fa-play"></i></button>
        </div>
        <div class="main-layout hidden">
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
            <div class="mobile-menu-toggle" id="mobile-menu-toggle"><i class="fas fa-bars"></i></div>
            <div class="content-wrapper">
                <main id="main-content">
                    <section class="hero-section" data-aos="fade-in">
                        <h1 class="hero-title">Mustafa Günay</h1>
                        <p class="hero-subtitle">Teknoloji ve Güvenlik Araştırmacısı</p>
                    </section>
                    <section class="latest-posts-section">
                        <h2 class="section-title" data-aos="fade-right">Son Keşifler</h2>
                        ${postsGrid}
                    </section>
                </main>
            </div>
        </div>
    `;
    const indexPage = createPageTemplate('Ana Sayfa', indexContent, 'home');
    await fs.writeFile(path.join(outputDir, 'index.html'), indexPage);
    
    // Tüm yazılar sayfası içeriği
    const postsPageContent = `
        <div class="main-layout">
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
            <div class="mobile-menu-toggle" id="mobile-menu-toggle"><i class="fas fa-bars"></i></div>
            <div class="content-wrapper">
                 <main id="main-content"><section class="content-page"><h2 data-aos="fade-down">Tüm Yazılar</h2>${postsGrid}</section></main>
            </div>
        </div>
    `;
    const postsPage = createPageTemplate('Yazılar', postsPageContent);
    await fs.writeFile(path.join(outputDir, 'posts.html'), postsPage);

    console.log('Site başarıyla oluşturuldu! Çıktılar `_site` klasöründe.');
}

buildSite();