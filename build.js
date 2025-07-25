// build.js - Modüler Orkestratör Betiği

const fs = require('fs-extra');
const path = require('path');
const createPageTemplate = require('./build_modules/template');
const processPosts = require('./build_modules/process-posts');
const processPages = require('./build_modules/process-pages');
const createSearchIndex = require('./build_modules/search');
const createRssFeed = require('./build_modules/rss');

const outputDir = path.join(__dirname, '_site');

async function buildSite() {
    console.log('>>> Build süreci başlatılıyor...');
    await fs.emptyDir(outputDir);
    console.log('--- Çıktı klasörü (_site) temizlendi.');

    // Statik varlıkları kopyala
    await fs.copy(path.join(__dirname, 'assets'), path.join(outputDir, 'assets'));
    await fs.copy(path.join(path.join(__dirname, 'assets'), 'icons', 'favicon.ico'), path.join(outputDir, 'favicon.ico'));
    if (await fs.pathExists(path.join(__dirname, 'admin'))) {
        await fs.copy(path.join(__dirname, 'admin'), path.join(outputDir, 'admin'));
    }
    console.log('--- Assets klasörü kopyalandı.');

    // İçerik işleme
    const allPosts = await processPosts(outputDir);
    await processPages(outputDir);

    // Yardımcı dosyaları oluşturma
    await createSearchIndex(outputDir, allPosts);
    await createRssFeed(outputDir, allPosts);

    // Ana ve diğer temel sayfaları oluştur
    const createPostCard = (post, index) => `<div class="post-card" data-aos="fade-up" data-aos-delay="${index * 50}"><a href="/${post.path}" class="post-card-link"><div class="post-card-content"><h3>${post.title}</h3><p class="post-card-meta">${post.date.toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' })} • ${post.readingTime}</p><p class="post-card-description">${post.description || ''}</p></div><div class="post-card-footer"><span class="read-more">Devamını Oku <i class="fas fa-arrow-right"></i></span></div></a></div>`;
    
    const indexContent = `<section class="hero-section" data-aos="fade-in"><p class="hero-subtitle animated-gradient-text">Dijital Dünyanın Kodları Arasında Güvenliği İnşa Etmek.</p></section><section class="latest-posts-section"><div class="styled-header"><h2 class="section-title">Son Keşifler</h2></div><div class="posts-grid">${allPosts.slice(0, 3).map((post, i) => createPostCard(post, i)).join('')}</div></section><section class="cta-section" data-aos="fade-up"><div class="cta-content"><h3>Daha Derine İnmeye Hazır Mısın?</h3><p>Teknoloji ve siber güvenlik dünyasındaki tüm yazılarıma göz atın.</p><a href="/posts.html" class="cta-button">Tüm Yazıları Gör</a></div></section>`;
    await fs.writeFile(path.join(outputDir, 'index.html'), createPageTemplate({ title: 'Ana Sayfa', url: '/index.html' }, indexContent, 'home'));

    const postsPageContent = `<section class="content-page"><div class="styled-header"><h2 data-aos="fade-down" class="animated-gradient-text orange-heavy">Tüm Yazılar</h2></div><div class="posts-grid">${allPosts.map((post, i) => createPostCard(post, i)).join('')}</div></section>`;
    await fs.writeFile(path.join(outputDir, 'posts.html'), createPageTemplate({ title: 'Tüm Yazılar', url: '/posts.html' }, postsPageContent));
    
    const recentPostsFor404 = allPosts.slice(0, 3).map(post => `<li><a href="/${post.path}">${post.title}</a></li>`).join('');
    const notFoundContent = `<div class="error-page-container"><h1 class="error-code animated-gradient-text">404</h1><h2 class="error-title">SAYFA BULUNAMADI</h2><p class="error-message">Aradığın sayfa ya hiç var olmadı ya da bir bit-flip kurbanı oldu. Endişelenme, en iyi sistemlerde bile olur.</p><div class="error-actions"><a href="/index.html" class="cta-button">Ana Sayfaya Dön</a></div><div class="error-recent-posts"><h3>Belki bunlardan birini arıyordun?</h3><ul>${recentPostsFor404}</ul></div></div>`;
    await fs.writeFile(path.join(outputDir, '404.html'), createPageTemplate({ title: '404 - Sayfa Bulunamadı', url: '/404.html' }, notFoundContent, 'error-page'));
    
    console.log('>>> Build süreci başarıyla tamamlandı!');
}

buildSite().catch(err => {
    console.error("Build sırasında kritik hata:", err);
    process.exit(1);
});