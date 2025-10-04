// build.js - Modüler Orkestratör Betiği

const fs = require('fs-extra');
const path = require('path');
const createPageTemplate = require('./build_modules/template');
const processPosts = require('./build_modules/process-posts');
const processPages = require('./build_modules/process-pages');
const createSearchIndex = require('./build_modules/search');
const createRssFeed = require('./build_modules/rss');
const createSitemap = require('./build_modules/sitemap');
const createRobots = require('./build_modules/robots');
const createServiceWorker = require('./build_modules/pwa');
const processImages = require('./build_modules/images');
const minifyOutputHtml = require('./build_modules/minify');

const outputDir = path.join(__dirname, '_site');

/* Build sürecinde lazy loading ve RSS feed optimizasyonu */
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
  // Process images first so manifest is ready
  const imagesManifest = await processImages(outputDir);
  const allPosts = await processPosts(outputDir, imagesManifest);
    await processPages(outputDir);

  // Lazy loading ve RSS feed optimizasyonu
  await createSearchIndex(outputDir, allPosts);
  await createRssFeed(outputDir, allPosts);
  await createSitemap(outputDir);
  await createRobots(outputDir);
  await createServiceWorker(outputDir);
    console.log('--- Lazy loading ve RSS feed tamamlandı.');

    // Ana ve diğer temel sayfaları oluştur
    const createPostCard = (post, index) => `
      <div class="post-card fancy-card" data-aos="fade-up" data-aos-delay="${index * 60}">
        <a href="/${post.path}" class="post-card-link">
          <div class="post-card-content">
            <h3 class="fancy-title">${post.title}</h3>
            <p class="post-card-meta">${post.date.toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' })} • ${post.readingTime}</p>
            <p class="post-card-description">${post.description || ''}</p>
          </div>
          <div class="post-card-footer"><span class="read-more">Devamını Oku <i class="fas fa-arrow-right"></i></span></div>
        </a>
      </div>`;

    const indexContent = `
      <section class="hero-section" data-aos="fade-in">
        <div class="hero-bg-animated">
          <svg class="hero-svg-bg" viewBox="0 0 1440 320"><defs><linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F14D1F"/><stop offset="100%" stop-color="#ff9d40"/></linearGradient></defs><path fill="url(#heroGrad)" fill-opacity="0.18" d="M0,160L60,154.7C120,149,240,139,360,154.7C480,171,600,213,720,197.3C840,181,960,107,1080,101.3C1200,96,1320,160,1380,192L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
        </div>
        <h1 class="hero-main-title animated-gradient-text">Dijital Dünyanın Kodları Arasında <span class="highlight">Güvenliği</span> İnşa Et.</h1>
        <p class="hero-subtitle">Siber güvenlik, network ve teknolojiye dair en güncel içerikler, rehberler ve analizler burada.</p>
      </section>
      <section class="latest-posts-section">
        <div class="styled-header"><h2 class="section-title">Son Keşifler</h2></div>
        <div class="posts-grid">${allPosts.slice(0, 3).map((post, i) => createPostCard(post, i)).join('')}</div>
      </section>
      <section class="cta-section" data-aos="fade-up">
        <div class="cta-content">
          <h3>Daha Derine İnmeye Hazır Mısın?</h3>
          <p>Teknoloji ve siber güvenlik dünyasındaki tüm yazılarıma göz atın.</p>
          <a href="/posts.html" class="cta-button cta-animated">Tüm Yazıları Gör</a>
        </div>
      </section>
    `;
    await fs.writeFile(path.join(outputDir, 'index.html'), createPageTemplate({ title: 'Ana Sayfa', url: '/index.html' }, indexContent, 'home'));

    const postsPageContent = `<section class="content-page"><div class="styled-header"><h2 data-aos="fade-down" class="animated-gradient-text orange-heavy">Tüm Yazılar</h2></div><div class="posts-grid">${allPosts.map((post, i) => createPostCard(post, i)).join('')}</div></section>`;
    await fs.writeFile(path.join(outputDir, 'posts.html'), createPageTemplate({ title: 'Tüm Yazılar', url: '/posts.html' }, postsPageContent));
    
    const recentPostsFor404 = allPosts.slice(0, 3).map(post => `<li><a href="/${post.path}">${post.title}</a></li>`).join('');
    const notFoundContent = `<div class="error-page-container"><h1 class="error-code animated-gradient-text">404</h1><h2 class="error-title">SAYFA BULUNAMADI</h2><p class="error-message">Aradığın sayfa ya hiç var olmadı ya da bir bit-flip kurbanı oldu. Endişelenme, en iyi sistemlerde bile olur.</p><div class="error-actions"><a href="/index.html" class="cta-button">Ana Sayfaya Dön</a></div><div class="error-recent-posts"><h3>Belki bunlardan birini arıyordun?</h3><ul>${recentPostsFor404}</ul></div></div>`;
    await fs.writeFile(path.join(outputDir, '404.html'), createPageTemplate({ title: '404 - Sayfa Bulunamadı', url: '/404.html' }, notFoundContent, 'error-page'));
    
  // Minify HTML at the very end
  await minifyOutputHtml(outputDir);
  console.log('>>> Build süreci başarıyla tamamlandı!');
}

buildSite().catch(err => {
    console.error("Build sırasında kritik hata:", err);
    process.exit(1);
});