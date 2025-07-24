// /assets/js/script.js - NİHAİ, ONARILMIŞ VE TAM SÜRÜM

document.addEventListener('DOMContentLoaded', () => {
    // Önce temayı belirle, sonra diğer her şeyi yap
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Ana sayfa ise intro mantığını çalıştır
    if (document.body.classList.contains('home')) {
        if (!localStorage.getItem('hasVisited')) {
            setupWelcomeScreen(showMainContent);
        } else {
            showMainContent();
        }
    } else {
        const mainLayout = document.querySelector('.main-layout');
        if (mainLayout) {
            mainLayout.classList.remove('hidden');
        }
    }

    setupSidebar();
    enhanceCodeBlocks();
    setActiveSidebarLink();
    setupReplayButton();
    setupReadingProgressBar();
    setupSearch();
    setupThemeToggle();
    setupBackToTopButton();
    setupLightbox();

    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 50 });
    }
});

function showMainContent() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainLayout = document.querySelector('.main-layout');
    
    if (welcomeScreen && welcomeScreen.style.display !== 'none') {
        welcomeScreen.classList.add('hidden');
        welcomeScreen.addEventListener('transitionend', () => {
            welcomeScreen.style.display = 'none';
        }, { once: true });
    }
    
    if (mainLayout) {
        mainLayout.classList.remove('hidden');
    }
}

function setupWelcomeScreen(onComplete) {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (!welcomeScreen) {
        if (onComplete) onComplete();
        return;
    }

    welcomeScreen.style.display = 'flex';
    const welcomeMessage = document.getElementById('welcome-message');
    const skipButton = document.getElementById('skip-button');
    const messages = ["Sistemler insanlar tarafından yapılır ve insanlar kusurludur.", "Kontrol bir yanılsamadır."];
    let typingInterval;

    function typeWriterEffect(element, text, callback) {
        if (!element) return;
        element.textContent = '';
        let i = 0;
        typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                if (callback) callback();
            }
        }, 85);
    }

    function startAnimation() {
        if (!welcomeMessage) return;
        welcomeMessage.style.opacity = '1';
        typeWriterEffect(welcomeMessage, messages[0], () => {
            setTimeout(finishIntro, 2500);
        });
        if (skipButton) skipButton.classList.add('visible');
    }

    function finishIntro() {
        if (typingInterval) clearInterval(typingInterval);
        localStorage.setItem('hasVisited', 'true');
        if (onComplete) onComplete();
    }

    if (skipButton) {
        skipButton.addEventListener('click', finishIntro);
    }

    setTimeout(startAnimation, 1500);
}

function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    
    if (mobileMenuToggle && closeSidebarBtn) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.add('open');
        });
        closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));
        document.addEventListener('click', (event) => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    const handleMouseEnter = () => sidebar.classList.add('sidebar-expanded');
    const handleMouseLeave = () => sidebar.classList.remove('sidebar-expanded');
    const setupDesktopHover = () => {
        if (window.innerWidth > 768) {
            sidebar.addEventListener('mouseenter', handleMouseEnter);
            sidebar.addEventListener('mouseleave', handleMouseLeave);
        } else {
            sidebar.removeEventListener('mouseenter', handleMouseEnter);
            sidebar.removeEventListener('mouseleave', handleMouseLeave);
        }
    };
    
    setupDesktopHover();
    window.addEventListener('resize', setupDesktopHover);
}

function enhanceCodeBlocks() { if (typeof hljs === 'undefined') { return; } document.querySelectorAll('pre code').forEach((block) => { hljs.highlightElement(block); }); document.querySelectorAll('pre').forEach(block => { const codeElement = block.querySelector('code'); if (!codeElement) return; const copyButton = document.createElement('button'); copyButton.className = 'copy-code-button'; copyButton.textContent = 'Kopyala'; block.appendChild(copyButton); copyButton.addEventListener('click', () => { navigator.clipboard.writeText(codeElement.innerText).then(() => { copyButton.textContent = 'Kopyalandı!'; setTimeout(() => { copyButton.textContent = 'Kopyala'; }, 2000); }); }); }); }
function setActiveSidebarLink() { const currentPath = window.location.pathname; document.querySelectorAll('.sidebar-nav a').forEach(link => { const linkHref = link.getAttribute('href'); if (linkHref === currentPath || (currentPath === '/' && linkHref === '/index.html') || (currentPath.startsWith('/posts/') && linkHref === '/posts.html')) { link.classList.add('active'); } }); }
function replayIntro() { localStorage.removeItem('hasVisited'); window.location.href = '/index.html'; }
function setupReplayButton() { const replayButton = document.getElementById('replay-animation-btn'); const logoLink = document.getElementById('logo-link'); const mobileLogoLink = document.getElementById('mobile-logo-link'); if (replayButton) { replayButton.addEventListener('click', replayIntro); } if (logoLink) { logoLink.addEventListener('click', (e) => { e.preventDefault(); replayIntro(); }); } if (mobileLogoLink) { mobileLogoLink.addEventListener('click', (e) => { e.preventDefault(); replayIntro(); }); } }
function setupReadingProgressBar() { const progressBar = document.getElementById('progress-bar'); if (!progressBar) return; window.addEventListener('scroll', () => { const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight; const scrollPercent = (scrollTop / scrollHeight) * 100; progressBar.style.width = scrollPercent + '%'; }); }
function setupSearch() {
    const searchTrigger = document.getElementById('search-trigger'); const searchModal = document.getElementById('search-modal'); const searchModalInput = document.getElementById('search-modal-input'); const searchModalClose = document.getElementById('search-modal-close'); const resultsList = document.getElementById('search-results-list'); if (!searchTrigger || !searchModal) return;
    let idx, searchDocs; let dataFetched = false;
    async function initializeSearch() { if (dataFetched) return; try { const [idxResponse, docsResponse] = await Promise.all([fetch('/search-index.json'), fetch('/search-docs.json')]); const serializedIdx = await idxResponse.json(); searchDocs = await docsResponse.json(); idx = lunr.Index.load(serializedIdx); dataFetched = true; } catch (error) { console.error("Arama verileri yüklenemedi:", error); } }
    function openSearch() { initializeSearch(); searchModal.classList.add('active'); document.body.style.overflow = 'hidden'; setTimeout(() => searchModalInput.focus(), 300); }
    function closeSearch() { searchModal.classList.remove('active'); document.body.style.overflow = ''; searchModalInput.value = ''; resultsList.innerHTML = ''; }
    searchTrigger.addEventListener('click', (e) => { e.preventDefault(); openSearch(); }); searchModalClose.addEventListener('click', closeSearch); searchModal.addEventListener('click', (e) => { if (e.target === searchModal) { closeSearch(); } }); document.addEventListener('keydown', (e) => { if (e.key === "Escape" && searchModal.classList.contains('active')) { closeSearch(); } });
    searchModalInput.addEventListener('input', (e) => { const query = e.target.value; if (query.length < 2 || !idx) { resultsList.innerHTML = ''; return; } const results = idx.search(query + '*'); displayResults(results); });
    function displayResults(results) { let html = ''; if (results.length > 0) { results.forEach(result => { const doc = searchDocs[result.ref]; html += `<li><a href="/${result.ref}"><h3>${doc.title}</h3><p>${doc.description || ''}</p></a></li>`; }); } else { html = '<li class="no-results">Sonuç bulunamadı.</li>'; } resultsList.innerHTML = html; }
}
function setupThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    if (!themeToggleButton) return;
    themeToggleButton.addEventListener('click', () => {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}
function setupBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { backToTopButton.classList.add('visible'); } else { backToTopButton.classList.remove('visible'); }
    });
    backToTopButton.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}
function setupLightbox() { if (typeof GLightbox !== 'undefined') { const lightbox = GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true, zoomable: true, }); } }