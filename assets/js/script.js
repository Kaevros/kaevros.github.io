// /assets/js/script.js - NİHAİ, STABİL VE HATASIZ SÜRÜM

document.addEventListener('DOMContentLoaded', () => {
    // Önce temayı belirle, sonra diğer her şeyi yap
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (document.body.classList.contains('home')) {
        // hasVisited kontrolü, daha önce ziyaret edilip edilmediğini kontrol eder
        if (!sessionStorage.getItem('hasVisited')) {
            setupWelcomeScreen();
        } else {
            skipWelcomeScreen();
        }
    } else {
        skipWelcomeScreen(); // Diğer sayfalarda intro'yu direkt geç
    }

    setupSidebar();
    enhanceCodeBlocks();
    setActiveSidebarLink();
    setupReplayButton();
    setupReadingProgressBar();
    setupSearch();
    setupThemeToggle(); // Tema butonu fonksiyonu
    setupBackToTopButton(); // Yukarı çık butonu
    
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
        typeWriterEffect(welcomeMessage, messages[0], () => {
            setTimeout(enterBlog, 2500); // Mesaj bittikten sonra bekle ve gir
        });
        if (skipButton) skipButton.classList.add('visible');
    }

    function enterBlog() {
        if (typingInterval) clearInterval(typingInterval);
        sessionStorage.setItem('hasVisited', 'true'); // Sayfa yenilenince tekrar çıkmasın diye sessionStorage
        skipWelcomeScreen();
    }

    if (skipButton) {
        skipButton.addEventListener('click', enterBlog);
    }

    setTimeout(startMessageCycle, 1500); // Başlangıç gecikmesi
}

function skipWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainLayout = document.querySelector('.main-layout');
    if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
        // DOM'dan kaldırmak için transition bitimini bekle
        welcomeScreen.addEventListener('transitionend', () => {
            welcomeScreen.style.display = 'none';
        }, { once: true });
    }
    if (mainLayout) {
        mainLayout.classList.remove('hidden');
    }
}

// SADECE MOBİL İÇİN ÇALIŞAN, STABİL SIDEBAR KONTROLÜ
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    if (!sidebar || !mobileMenuToggle || !closeSidebarBtn) return;

    // Mobil menü açma butonu
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open'); // Arka plan kaymasını engelle
    });

    // Sidebar içindeki kapatma butonu
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
    });
}

function enhanceCodeBlocks() {
    if (typeof hljs === 'undefined') return;
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
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
    const currentPath = window.location.pathname.endsWith('/') ? '/index.html' : window.location.pathname;
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else if (currentPath.startsWith('/posts') && link.getAttribute('href') === '/posts.html') {
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
}

function setupReadingProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
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
        } catch (error) {
            console.error("Arama verileri yüklenemedi:", error);
        }
    }

    function openSearch() {
        initializeSearch();
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchModalInput.focus(), 300);
    }

    function closeSearch() {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
        searchModalInput.value = '';
        resultsList.innerHTML = '';
    }

    searchTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
    });
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
        displayResults(results);
    });

    function displayResults(results) {
        resultsList.innerHTML = results.length > 0 ?
            results.map(result => `<li><a href="/${result.ref}"><h3>${searchDocs[result.ref].title}</h3><p>${searchDocs[result.ref].description || ''}</p></a></li>`).join('') :
            '<li class="no-results">Sonuç bulunamadı.</li>';
    }
}

function setupThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    if (!themeToggleButton) return;
    
    // Sayfa yüklenirken temayı uygula
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggleButton.addEventListener('click', () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function setupBackToTopButton() {
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.className = 'back-to-top-btn';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.title = "Yukarı dön";
    document.body.appendChild(backToTopButton);

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