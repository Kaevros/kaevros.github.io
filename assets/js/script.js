// /assets/js/script.js - AŞAMA 1 GÜNCELLEMESİ (TAM SÜRÜM)

document.addEventListener('DOMContentLoaded', () => {
    if (document.documentElement.getAttribute('data-theme') === null) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    setupThemeToggle();

    if (document.body.classList.contains('home')) {
        if (!localStorage.getItem('hasVisited')) {
            setupWelcomeScreen();
        } else {
            skipWelcomeScreen();
        }
    }
    setupSidebar();
    enhanceCodeBlocks();
    setActiveSidebarLink();
    setupReplayButton();
    setupReadingProgressBar();
    setupSearch();
    setupBackToTopButton();
    setupLightbox();

    if (typeof AOS !== 'undefined') { AOS.init({ duration: 800, once: true, offset: 50 }); }
});

function setupWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (!welcomeScreen) return;
    welcomeScreen.style.display = 'flex';
    const welcomeMessage = document.getElementById('welcome-message');
    const skipButton = document.getElementById('skip-button');
    const messages = ["Sistemler insanlar tarafından yapılır ve insanlar kusurludur.", "Kontrol bir yanılsamadır.", "Sıfırlar ve birler... Dünyayı yöneten ikili."];
    let typingInterval;
    function typeWriterEffect(element, text, onComplete) { if (!element) return; element.textContent = ''; let i = 0; typingInterval = setInterval(() => { if (i < text.length) { element.textContent += text.charAt(i); i++; } else { clearInterval(typingInterval); if (onComplete) onComplete(); } }, 85); }
    function startMessageCycle() { if (!welcomeMessage) return; welcomeMessage.style.opacity = '1'; typeWriterEffect(welcomeMessage, messages[0], () => { setTimeout(enterBlog, 3000); }); if (skipButton) skipButton.classList.add('visible'); }
    function enterBlog() { if (typingInterval) clearInterval(typingInterval); localStorage.setItem('hasVisited', 'true'); skipWelcomeScreen(); }
    if (skipButton) { skipButton.addEventListener('click', enterBlog); }
    setTimeout(startMessageCycle, 1500);
}

function skipWelcomeScreen() { const welcomeScreen = document.getElementById('welcome-screen'); const mainLayout = document.querySelector('.main-layout'); if (welcomeScreen) { welcomeScreen.classList.add('hidden'); setTimeout(() => { welcomeScreen.style.display = 'none'; }, 1000); } if (mainLayout) { mainLayout.classList.remove('hidden'); } }

function setupSidebar() { const sidebar = document.getElementById('sidebar'); const mobileMenuToggle = document.getElementById('mobile-menu-toggle'); const closeSidebarBtn = document.getElementById('close-sidebar-btn'); if (!sidebar || !mobileMenuToggle || !closeSidebarBtn) return; mobileMenuToggle.addEventListener('click', (e) => { e.stopPropagation(); sidebar.classList.add('open'); }); closeSidebarBtn.addEventListener('click', () => { sidebar.classList.remove('open'); }); document.addEventListener('click', (event) => { if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) { sidebar.classList.remove('open'); } }); }

function enhanceCodeBlocks() { if (typeof hljs === 'undefined') { return; } document.querySelectorAll('pre code').forEach((block) => { hljs.highlightElement(block); }); document.querySelectorAll('pre').forEach(block => { const codeElement = block.querySelector('code'); if (!codeElement) return; const copyButton = document.createElement('button'); copyButton.className = 'copy-code-button'; copyButton.textContent = 'Kopyala'; block.appendChild(copyButton); copyButton.addEventListener('click', () => { navigator.clipboard.writeText(codeElement.innerText).then(() => { copyButton.textContent = 'Kopyalandı!'; copyButton.style.backgroundColor = 'var(--accent-color-primary)'; setTimeout(() => { copyButton.textContent = 'Kopyala'; copyButton.style.backgroundColor = ''; }, 2000); }); }); }); }

function setActiveSidebarLink() { const currentPath = window.location.pathname; document.querySelectorAll('.sidebar-nav a').forEach(link => { const linkHref = link.getAttribute('href'); if (linkHref === currentPath || (currentPath === '/' && linkHref === '/index.html')) { link.classList.add('active'); } }); }

function replayIntro() { localStorage.removeItem('hasVisited'); window.location.href = '/index.html'; }

function setupReplayButton() { const replayButton = document.getElementById('replay-animation-btn'); const logoLink = document.getElementById('logo-link'); const mobileLogoLink = document.getElementById('mobile-logo-link'); if (replayButton) { replayButton.addEventListener('click', replayIntro); } if (logoLink) { logoLink.addEventListener('click', (e) => { e.preventDefault(); replayIntro(); }); } if (mobileLogoLink) { mobileLogoLink.addEventListener('click', (e) => { e.preventDefault(); replayIntro(); }); } }

function setupReadingProgressBar() { const progressBar = document.getElementById('progress-bar'); if (!progressBar) return; window.addEventListener('scroll', () => { const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight; const scrollPercent = (scrollTop / scrollHeight) * 100; progressBar.style.width = scrollPercent + '%'; }); }

function setupSearch() {
    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const searchModalInput = document.getElementById('search-modal-input');
    const searchModalClose = document.getElementById('search-modal-close');
    const resultsList = document.getElementById('search-results-list');
    if (!searchTrigger || !searchModal) return;
    let idx, searchDocs; let dataFetched = false;
    async function initializeSearch() { if (dataFetched) return; try { const [idxResponse, docsResponse] = await Promise.all([fetch('/search-index.json'), fetch('/search-docs.json')]); const serializedIdx = await idxResponse.json(); searchDocs = await docsResponse.json(); idx = lunr.Index.load(serializedIdx); dataFetched = true; } catch (error) { console.error("Arama verileri yüklenemedi:", error); } }
    function openSearch() { initializeSearch(); searchModal.classList.add('active'); document.body.style.overflow = 'hidden'; setTimeout(() => searchModalInput.focus(), 300); }
    function closeSearch() { searchModal.classList.remove('active'); document.body.style.overflow = ''; searchModalInput.value = ''; resultsList.innerHTML = ''; }
    searchTrigger.addEventListener('click', (e) => { e.preventDefault(); openSearch(); });
    searchModalClose.addEventListener('click', closeSearch);
    searchModal.addEventListener('click', (e) => { if (e.target === searchModal) { closeSearch(); } });
    document.addEventListener('keydown', (e) => { if (e.key === "Escape" && searchModal.classList.contains('active')) { closeSearch(); } });
    searchModalInput.addEventListener('input', (e) => { const query = e.target.value; if (query.length < 2 || !idx) { resultsList.innerHTML = ''; return; } const results = idx.search(query + '*'); displayResults(results); });
    function displayResults(results) { let resultsHTML = ''; if (results.length > 0) { results.forEach(result => { const doc = searchDocs[result.ref]; resultsHTML += `<li><a href="/${result.ref}"><h3>${doc.title}</h3><p>${doc.description || ''}</p></a></li>`; }); } else { resultsHTML = '<li class="no-results">Sonuç bulunamadı.</li>'; } resultsList.innerHTML = resultsHTML; }
}

// YENİ: Tema Değiştirme Fonksiyonu
function setupThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    if (!themeToggleButton) return;

    // Sayfa yüklenir yüklenmez doğru temayı uygula
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggleButton.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            theme = 'light';
        } else {
            theme = 'dark';
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

// YENİ: Yukarı Dön Butonu Fonksiyonu
function setupBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// YENİ: Lightbox Fonksiyonu
function setupLightbox() {
    // Yazı içindeki resimleri lightbox'a uygun hale getir
    const postImages = document.querySelectorAll('.post-content img');
    postImages.forEach(img => {
        // Resmin bir link içinde olup olmadığını ve zaten bir glightbox linki olmadığını kontrol et
        if (img.parentElement.tagName !== 'A' || !img.parentElement.classList.contains('glightbox')) {
            const link = document.createElement('a');
            link.href = img.src;
            link.classList.add('glightbox');
            // Resmin bir başlığı varsa altyazı olarak ekle
            if (img.title) {
                link.setAttribute('data-title', img.title);
            }
            img.parentNode.insertBefore(link, img);
            link.appendChild(img);
        }
    });
    
    // GLightbox'ı başlat
    if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            zoomable: true,
        });
    }
}