// /assets/js/script.js - NİHAİ, TÜM FONKSİYONLARI İÇEREN SÜRÜM

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (document.body.classList.contains('home')) {
        if (!sessionStorage.getItem('hasVisited')) {
            setupWelcomeScreen();
        } else {
            skipWelcomeScreen();
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
    
    if (typeof GLightbox !== 'undefined') {
        GLightbox({ selector: '.glightbox' });
    }
    
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });
    }
});

function setupWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (!welcomeScreen) return;
    
    welcomeScreen.style.display = 'flex';
    const welcomeMessage = document.getElementById('welcome-message');
    const skipButton = document.getElementById('skip-button');
    const messages = ["Sistemler insanlar tarafından yapılır ve insanlar kusurludur."];
    let typingInterval;

    function typeWriterEffect(element, text, onComplete) {
        if (!element) return;
        element.textContent = '';
        let i = 0;
        typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                if (onComplete) onComplete();
            }
        }, 85);
    }

    function startMessageCycle() {
        if (!welcomeMessage) return;
        welcomeMessage.style.opacity = '1';
        // When the typewriter effect finishes, only show the skip button.
        // The automatic timeout to enter the blog is removed.
        typeWriterEffect(welcomeMessage, messages[0], () => {
             if (skipButton) skipButton.classList.add('visible');
        });
    }

    function enterBlog() {
        if (typingInterval) clearInterval(typingInterval);
        sessionStorage.setItem('hasVisited', 'true');
        skipWelcomeScreen();
    }

    if (skipButton) {
        skipButton.addEventListener('click', enterBlog);
    }

    setTimeout(startMessageCycle, 1500);
}

function skipWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainLayout = document.querySelector('.main-layout');
    if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
        welcomeScreen.addEventListener('transitionend', () => {
            welcomeScreen.style.display = 'none';
        }, { once: true });
    }
    if (mainLayout) {
        mainLayout.classList.remove('hidden');
    }
}

function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    if (!sidebar || !mobileMenuToggle || !closeSidebarBtn) return;

    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open');
    });

    const closeMenu = () => {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
    };

    closeSidebarBtn.addEventListener('click', closeMenu);

    document.addEventListener('click', (event) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            closeMenu();
        }
    });
}

function enhanceCodeBlocks() {
    document.querySelectorAll('pre code').forEach((block) => {
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(block);
        }
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.innerHTML = '<i class="far fa-copy"></i> Kopyala';
        block.parentElement.appendChild(copyButton);
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(block.innerText).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="far fa-copy"></i> Kopyala';
                }, 2000);
            });
        });
    });
}

function setActiveSidebarLink() {
    const currentPath = window.location.pathname.endsWith('/') || window.location.pathname === '' ? '/index.html' : window.location.pathname;
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        // Remove existing active class from all links first
        link.classList.remove('active');
        
        const linkHref = link.getAttribute('href');

        // Check for exact match or homepage case
        if (linkHref === currentPath) {
            link.classList.add('active');
        } 
        // Special case for posts page: if we are on a post detail, highlight "Yazılar"
        else if (currentPath.startsWith('/posts/') && linkHref === '/posts.html') {
            link.classList.add('active');
        }
    });
}

function replayIntro() {
    sessionStorage.removeItem('hasVisited');
    window.location.href = '/index.html';
}

function setupReplayButton() {
    const replayButton = document.getElementById('replay-animation-btn');
    if (replayButton) {
        replayButton.addEventListener('click', replayIntro);
    }
    const logoLink = document.getElementById('logo-link');
    const mobileLogoLink = document.getElementById('mobile-logo-link');
    if(logoLink) logoLink.addEventListener('click', (e) => { e.preventDefault(); replayIntro(); });
    if(mobileLogoLink) mobileLogoLink.addEventListener('click', (e) => { e.preventDefault(); replayIntro(); });
}

function setupReadingProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });
}

function setupSearch() {
    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const searchModalInput = document.getElementById('search-modal-input');
    const searchModalClose = document.getElementById('search-modal-close');
    const resultsList = document.getElementById('search-results-list');
    if (!searchTrigger || !searchModal) return;

    let idx, searchDocs;
    let dataFetched = false;

    async function initializeSearch() {
        if (dataFetched) return;
        try {
            const [idxResponse, docsResponse] = await Promise.all([fetch('/search-index.json'), fetch('/search-docs.json')]);
            const serializedIdx = await idxResponse.json();
            searchDocs = await docsResponse.json();
            idx = lunr.Index.load(serializedIdx);
            dataFetched = true;
        } catch (error) { console.error("Arama verileri yüklenemedi:", error); }
    }

    const openSearch = () => {
        initializeSearch();
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchModalInput.focus(), 300);
    };

    const closeSearch = () => {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
        searchModalInput.value = '';
        resultsList.innerHTML = '';
    };

    searchTrigger.addEventListener('click', (e) => { e.preventDefault(); openSearch(); });
    searchModalClose.addEventListener('click', closeSearch);
    searchModal.addEventListener('click', (e) => { if (e.target === searchModal) closeSearch(); });
    document.addEventListener('keydown', (e) => { if (e.key === "Escape" && searchModal.classList.contains('active')) closeSearch(); });

    searchModalInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length < 2 || !idx) {
            resultsList.innerHTML = '';
            return;
        }
        const results = idx.search(query + '*');
        resultsList.innerHTML = results.length > 0 ?
            results.map(result => `<li><a href="/${result.ref}"><h3>${searchDocs[result.ref].title}</h3><p>${searchDocs[result.ref].description || ''}</p></a></li>`).join('') :
            '<li class="no-results">Sonuç bulunamadı.</li>';
    });
}

function setupThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    if (!themeToggleButton) return;
    themeToggleButton.addEventListener('click', () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}