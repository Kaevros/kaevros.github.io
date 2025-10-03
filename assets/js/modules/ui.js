// /assets/js/modules/ui.js

export function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sloganEn = document.querySelector('.sidebar-slogan .slogan-en');
    const sloganTr = document.querySelector('.sidebar-slogan .slogan-tr');

    if (!sidebar) return;

    // Start collapsed on desktop
    function setCollapsed(val) {
        if (val) sidebar.classList.add('collapsed'); else sidebar.classList.remove('collapsed');
    }

    // initialize: collapsed on desktop, open on mobile
    if (window.innerWidth > 768) setCollapsed(true); else setCollapsed(false);

    let sloganInterval = null;
    function startSloganAnimation() {
        if (!sloganEn || !sloganTr) return;
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
        if (sloganInterval) clearInterval(sloganInterval);
        if (sloganEn) sloganEn.classList.remove('active');
        if (sloganTr) sloganTr.classList.remove('active');
        sloganInterval = null;
    }

    // Desktop hover behavior: expand/collapse
    sidebar.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            setCollapsed(false);
            startSloganAnimation();
        }
    });
    sidebar.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
            setCollapsed(true);
            stopSloganAnimation();
        }
    });

    // Mobile toggle behavior
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            document.body.classList.toggle('sidebar-open');
            // ensure collapsed removed when opened via mobile
            setCollapsed(false);
            startSloganAnimation();
        });
    }

    const closeMenu = () => {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
        // collapse on close if desktop
        if (window.innerWidth > 768) setCollapsed(true);
        stopSloganAnimation();
    };

    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMenu);

    document.addEventListener('click', (event) => {
        const clickedOutside = sidebar.classList.contains('open') && !sidebar.contains(event.target) && !(mobileMenuToggle && mobileMenuToggle.contains(event.target));
        if (clickedOutside) closeMenu();
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu(); });
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
        setTimeout(() => { if (searchModalInput) searchModalInput.focus(); }, 300);
    };

    const closeSearch = () => {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
        if (searchModalInput) searchModalInput.value = '';
        if (resultsList) resultsList.innerHTML = '';
    };

    if (searchTrigger) searchTrigger.addEventListener('click', (e) => { e.preventDefault(); openSearch(); });
    if (searchModalClose) searchModalClose.addEventListener('click', closeSearch);
    if (searchModal) searchModal.addEventListener('click', (e) => { if (e.target === searchModal) closeSearch(); });
    document.addEventListener('keydown', (e) => { if (e.key === "Escape" && searchModal && searchModal.classList.contains('active')) closeSearch(); });

    function renderResults(results) {
        if (!resultsList) return;
        resultsList.innerHTML = '';
        if (!results || results.length === 0) {
            resultsList.innerHTML = '<div class="no-results">Sonuç bulunamadı.</div>';
            return;
        }
        results.forEach(r => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.tabIndex = 0;

            const title = document.createElement('div');
            title.className = 'search-result-title';
            title.textContent = (searchDocs && searchDocs[r.ref] && searchDocs[r.ref].title) ? searchDocs[r.ref].title : 'Başlık yok';

            const summary = document.createElement('div');
            summary.className = 'search-result-summary';
            summary.textContent = (searchDocs && searchDocs[r.ref] && searchDocs[r.ref].description) ? searchDocs[r.ref].description : '';

            item.appendChild(title);
            item.appendChild(summary);

            item.addEventListener('click', () => {
                window.location.href = '/' + r.ref;
            });
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = '/' + r.ref;
                }
            });

            resultsList.appendChild(item);
        });
    }

    if (searchModalInput) {
        searchModalInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length < 2 || !idx) {
                if (resultsList) resultsList.innerHTML = '';
                return;
            }
            const results = idx.search(query + '*');
            renderResults(results);
        });
    }
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