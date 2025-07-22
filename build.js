// build.js - Geliştirilmiş ve Sitenize Özel Versiyon

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const outputDir = path.join(__dirname, '_site');

// Ana HTML şablonumuz. Tüm sayfalar bu iskeleti kullanacak.
// Orijinal sitenizdeki tüm <head> ve temel yapı buraya eklendi.
function createPageTemplate(pageTitle, content) {
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
        <body>
            <div class="main-layout">
                ${sidebarHTML}
                <div class="mobile-menu-toggle" id="mobile-menu-toggle"><i class="fas fa-bars"></i></div>
                <div class="content-wrapper">
                    <main id="main-content">
                        ${content}
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
    
    // 1. Çıktı klasörünü temizle ve statik dosyaları kopyala
    await fs.emptyDir(outputDir);
    await fs.copy(path.join(__dirname, 'assets'), path.join(outputDir, 'assets'));
    
    // 2. Statik sayfaları (Hakkında, Hizmetler vb.) kopyala
    const staticPages = ['about.html', 'hizmetler.html', 'contact.html'];
    for (const page of staticPages) {
        if (await fs.exists(path.join(__dirname, page))) {
            await fs.copy(path.join(__dirname, page), path.join(outputDir, page));
        }
    }

    // 3. Yazıları işle ve HTML'e çevir
    const postsDir = path.join(__dirname, '_posts');
    const postFiles = await fs.readdir(postsDir);
    const allPosts = [];

    for (const postFile of postFiles) {
        if (path.extname(postFile) !== '.md') continue;
        
        const fileContent = await fs.readFile(path.join(postsDir, postFile), 'utf8');
        const { data, content } = matter(fileContent); // Markdown ön bilgisini (title, date vs) ve içeriği ayır
        const htmlContent = marked(content); // Markdown'ı HTML'e çevir
        
        const postData = {
            title: data.title,
            date: new Date(data.date),
            image: data.image || null,
            content: htmlContent,
            path: `${path.basename(postFile, '.md')}.html`
        };
        allPosts.push(postData);

        // Her yazı için ayrı bir HTML sayfası oluştur
        const postPageContent = `
            <article class="post-detail" data-aos="fade-in">
                <header class="post-header">
                    <h1>${postData.title}</h1>
                    <div class="post-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${postData.date.toLocaleDateString('tr-TR')}</span>
                    </div>
                </header>
                ${postData.image ? `<img src="${postData.image}" alt="${postData.title}" style="width:100%; border-radius:8px; margin-bottom:20px;">` : ''}
                <section class="post-content">${postData.content}</section>
            </article>
        `;
        const fullPageHtml = createPageTemplate(postData.title, postPageContent);
        await fs.writeFile(path.join(outputDir, 'posts', postData.path), fullPageHtml);
    }
    
    // posts klasörünü oluştur
    await fs.ensureDir(path.join(outputDir, 'posts'));

    // 4. Ana sayfa ve Yazılar sayfasını oluştur
    allPosts.sort((a, b) => b.date - a.date); // En yeni yazı en üstte

    const createPostCard = (post) => `
        <div class="post-card" data-aos="fade-up">
            <div class="post-card-content">
                <h3>${post.title}</h3>
                <p>Yayın Tarihi: ${post.date.toLocaleDateString('tr-TR')}</p>
            </div>
            <a href="/posts/${post.path}" class="read-more">İncelemeye Başla &rarr;</a>
        </div>
    `;

    const postsGrid = `<div class="posts-grid">${allPosts.map(createPostCard).join('')}</div>`;
    
    // Ana sayfa içeriği
    const indexContent = `
        <section class="hero-section" data-aos="fade-in">
            <h1 class="hero-title">Mustafa Günay</h1>
            <p class="hero-subtitle">Teknoloji ve Güvenlik Araştırmacısı</p>
        </section>
        <section class="latest-posts-section">
            <h2 class="section-title" data-aos="fade-right">Son Keşifler</h2>
            ${postsGrid}
        </section>
    `;
    const indexPage = createPageTemplate('Ana Sayfa', indexContent);
    await fs.writeFile(path.join(outputDir, 'index.html'), indexPage);
    
    // Tüm yazılar sayfası içeriği
    const postsPageContent = `<section class="content-page"><h2 data-aos="fade-down">Tüm Yazılar</h2>${postsGrid}</section>`;
    const postsPage = createPageTemplate('Yazılar', postsPageContent);
    await fs.writeFile(path.join(outputDir, 'posts.html'), postsPage);

    console.log('Site başarıyla oluşturuldu! Çıktılar `_site` klasöründe.');
}

buildSite();