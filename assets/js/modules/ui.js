// /assets/js/modules/ui.js

export function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sloganEn = document.querySelector('.sidebar-slogan .slogan-en');
    const sloganTr = document.querySelector('.sidebar-slogan .slogan-tr');

    if (!sidebar || !mobileMenuToggle || !closeSidebarBtn || !sloganEn || !sloganTr) return;

    let sloganInterval = null;
    function startSloganAnimation() {
        let showEn = true;
        sloganEn.classList.add('active');
        sloganTr.classList.remove('active');
        sloganInterval = setInterval(() => {
            if (showEn) {
                sloganEn.classList.remove('active');
                sloganTr.classList.add('active');
            } else {
                sloganTr.classList.remove('active');
                sloganEn.classList.add('active');
            }
            showEn = !showEn;
        }, 3500);
    }
    function stopSloganAnimation() {
        clearInterval(sloganInterval);
        sloganEn.classList.remove('active');
        sloganTr.classList.remove('active');
    }

    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open');
        startSloganAnimation();
    });

    const closeMenu = () => {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
        stopSloganAnimation();
    };

    closeSidebarBtn.addEventListener('click', closeMenu);

    document.addEventListener('click', (event) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    // Masaüstü için hover ile açıldığında da animasyon başlasın
    sidebar.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) startSloganAnimation();
    });
    sidebar.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) stopSloganAnimation();
    });
}

export function enhanceCodeBlocks() {
    document.querySelectorAll('pre code').forEach((block) => {
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(block);
        }
    });
}

export function setupSearch() {
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

export function setupThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    if (!themeToggleButton) return;
    themeToggleButton.addEventListener('click', () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

export function setupBackToTopButton() {
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