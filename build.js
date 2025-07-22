// build.js - YAZILAR SAYFASI VE ANİMASYON İYİLEŞTİRMELERİ İÇEREN NİHAİ VERSİYON

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const outputDir = path.join(__dirname, '_site');

function createPageTemplate(pageTitle, mainContent, bodyClass = '') {
    const sidebarHTML = `<aside class="sidebar" id="sidebar"><div class="sidebar-header"><div class="logo-container"><a href="/index.html" aria-label="Ana Sayfa"><img src="/assets/images/logo.svg" alt="Mustafa Günay Logo" class="sidebar-logo"></a></div><button class="close-sidebar-btn" id="close-sidebar-btn" aria-label="Menüyü kapat"><i class="fas fa-times"></i></button></div><nav class="sidebar-nav"><ul><li class="nav-item"><a href="/index.html"><span class="icon"><i class="fas fa-home-alt"></i></span><span class="nav-text">Ana Sayfa</span></a></li><li class="nav-item"><a href="/about.html"><span class="icon"><i class="fas fa-user-secret"></i></span><span class="nav-text">Hakkında</span></a></li><li class="nav-item"><a href="/posts.html"><span class="icon"><i class="fas fa-file-alt"></i></span><span class="nav-text">Yazılar</span></a></li><li class="nav-item"><a href="/hizmetler.html"><span class="icon"><i class="fas fa-briefcase"></i></span><span class="nav-text">Hizmetler</span></a></li><li class="nav-item"><a href="/contact.html"><span class="icon"><i class="fas fa-paper-plane"></i></span><span class="nav-text">İletişim</span></a></li></ul></nav><button class="replay-animation-btn" id="replay-animation-btn" title="Giriş animasyonunu tekrar oynat"><i class="fas fa-power-off"></i></button><div class="sidebar-footer"><p>&copy; ${new Date().getFullYear()} Mustafa Günay</p></div></aside>`;
    const welcomeScreenHTML = bodyClass.includes('home') ? `<div class="welcome-screen" id="welcome-screen"><h1 class="animated-title" id="blog-title">Mustafa Günay</h1><p class="welcome-message" id="welcome-message"></p><button class="skip-button" id="skip-button" aria-label="Girişi geç"><i class="fas fa-play"></i></button></div>` : '';
    const mainLayoutClass = bodyClass.includes('home') ? 'main-layout hidden' : 'main-layout';
    return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle} - Mustafa Günay</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"><link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"><link rel="stylesheet" href="/assets/css/style.css"></head><body class="${bodyClass}">${welcomeScreenHTML}<div class="${mainLayoutClass}">${sidebarHTML}<div class="mobile-menu-toggle" id="mobile-menu-toggle"><i class="fas fa-bars"></i><div class="logo-container"><a href="/index.html" aria-label="Ana Sayfa"><img src="/assets/images/logo.svg" alt="Mustafa Günay Logo" class="sidebar-logo mobile-logo"></a></div></div><div class="content-wrapper"><main id="main-content">${mainContent}</main></div></div><script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script><script src="/assets/js/script.js"></script></body></html>`;
}
async function buildSite() {
    await fs.emptyDir(outputDir);
    await fs.copy(path.join(__dirname, 'assets'), path.join(outputDir, 'assets'));
    const staticPagesDir = path.join(__dirname, '_pages');
    if (await fs.pathExists(staticPagesDir)) {
        const staticPageFiles = await fs.readdir(staticPagesDir);
        for (const pageFile of staticPageFiles) {
            const fileContent = await fs.readFile(path.join(staticPagesDir, pageFile), 'utf8');
            const pageTitle = pageFile.charAt(0).toUpperCase() + pageFile.slice(1, pageFile.indexOf('.'));
            await fs.writeFile(path.join(outputDir, pageFile), createPageTemplate(pageTitle, fileContent));
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
        if (!data.title) { console.warn(`UYARI: '${postFile}' dosyasında başlık (title) eksik.`); data.title = "Başlık Eksik"; }
        if (!data.date) { console.warn(`UYARI: '${postFile}' dosyasında tarih (date) eksik.`); data.date = new Date().toISOString(); }
        const postData = { ...data, date: new Date(data.date), path: `posts/${path.basename(postFile, '.md')}.html`, content: marked(content) };
        allPosts.push(postData);
        const postPageContent = `<article class="post-detail"><header class="post-header"><h1>${postData.title}</h1></header><section class="post-content">${postData.content}</section></article>`;
        await fs.writeFile(path.join(outputDir, postData.path), createPageTemplate(postData.title, postPageContent));
    }
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const createPostCard = (post, index) => `<div class="post-card" data-aos="fade-up" data-aos-delay="${index * 100}"><div class="post-card-content"><h3>${post.title}</h3><p>Yayın Tarihi: ${post.date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div><a href="/${post.path}" class="read-more">İncelemeye Başla &rarr;</a></div>`;
    const indexContent = `<section class="hero-section" data-aos="fade-in"><h1 class="hero-title">Mustafa Günay</h1><p class="hero-subtitle">Teknoloji ve Güvenlik Araştırmacısı</p><p class="hero-description">"Kontrol bir yanılsamadır." Bu blog, dijital dünyanın karmaşasında kontrolü anlamak ve güvende kalmak üzerine bir yolculuktur.</p></section><section class="latest-posts-section"><h2 class="section-title" data-aos="fade-right">Son Keşifler</h2><div class="posts-grid">${allPosts.slice(0, 3).map((post, i) => createPostCard(post, i)).join('')}</div></section><section class="cta-section" data-aos="fade-up" data-aos-delay="400"><p>Daha derine inmeye hazır mısın?</p><div class="cta-buttons"><a href="/posts.html" class="cta-button">Tüm Yazıları Gör</a><a href="/hizmetler.html" class="cta-button secondary">Sunduğum Hizmetler</a></div></section>`;
    await fs.writeFile(path.join(outputDir, 'index.html'), createPageTemplate('Ana Sayfa', indexContent, 'home'));
    const postsPageContent = `<section class="content-page"><h2 data-aos="fade-down">Tüm Yazılar</h2><div class="posts-grid">${allPosts.map((post, i) => createPostCard(post, i)).join('')}</div></section>`;
    await fs.writeFile(path.join(outputDir, 'posts.html'), createPageTemplate('Yazılar', postsPageContent));
    console.log('Site başarıyla ve hatasız oluşturuldu!');
}
buildSite();