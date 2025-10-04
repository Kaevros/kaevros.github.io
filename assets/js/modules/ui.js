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
            // visually hide scrollbar while expanded to avoid showing the bar
            document.body.classList.add('hide-scrollbar');
        }
    });
    sidebar.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
            setCollapsed(true);
            stopSloganAnimation();
            document.body.classList.remove('hide-scrollbar');
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
            // do not hide scrollbar on mobile; overlay menu covers content
        });
    }

    const closeMenu = () => {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
        // collapse on close if desktop
        if (window.innerWidth > 768) setCollapsed(true);
        stopSloganAnimation();
    document.body.classList.remove('hide-scrollbar');
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
    const sidebarSearch = document.getElementById('sidebar-search');
    // if there's no dedicated trigger in the markup, allow the sidebar search input to open the modal
    if (!searchTrigger && !sidebarSearch) return;
    if (!searchModal) return;

    let idx, searchDocs;
    let dataFetched = false;
    let lastFocused = null;
    let trapHandlersBound = false;

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
        // prevent body scroll while modal is open
        document.body.style.overflow = 'hidden';
        // focus modal input after the modal animation completes
        lastFocused = document.activeElement;
        // Focus trap bindings
        if (!trapHandlersBound) {
            trapHandlersBound = true;
            searchModal.addEventListener('keydown', onTrapKeydown);
        }
        setTimeout(() => { if (searchModalInput) searchModalInput.focus(); }, 320);
    };

    const closeSearch = () => {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
        if (searchModalInput) searchModalInput.value = '';
        if (resultsList) resultsList.innerHTML = '';
        // release focus trap and restore focus
        if (trapHandlersBound) {
            searchModal.removeEventListener('keydown', onTrapKeydown);
            trapHandlersBound = false;
        }
        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    };

    if (searchTrigger) searchTrigger.addEventListener('click', (e) => { e.preventDefault(); openSearch(); });
    // support sidebar search input as a trigger
    if (sidebarSearch) {
        sidebarSearch.addEventListener('click', (e) => { e.preventDefault(); openSearch(); });
        sidebarSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); openSearch();
            }
        });
    }
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
            item.setAttribute('role','option');
            item.setAttribute('aria-selected','false');
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
            item.addEventListener('mouseenter', () => {
                [...resultsList.querySelectorAll('.search-result-item')].forEach(el=>{ el.classList.remove('active'); el.setAttribute('aria-selected','false'); });
                item.classList.add('active'); item.setAttribute('aria-selected','true');
            });
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = '/' + r.ref;
                }
            });

            resultsList.appendChild(item);
        });
    // set first active by default
    const items = [...resultsList.querySelectorAll('.search-result-item')];
    if (items.length) { items[0].classList.add('active'); items[0].setAttribute('aria-selected','true'); }
    }

    // Debounced input
    function debounce(fn, wait=150) { let t; return (...args) => { clearTimeout(t); t=setTimeout(()=>fn(...args), wait); }; }
    const onInput = debounce((e) => {
        const query = e.target.value;
        if (query.length < 2 || !idx) {
            if (resultsList) resultsList.innerHTML = '';
            return;
        }
        const results = idx.search(query + '*');
        renderResults(results);
    }, 180);
    if (searchModalInput) {
        searchModalInput.addEventListener('input', onInput);
        searchModalInput.addEventListener('keydown', (e) => {
            const items = [...(resultsList ? resultsList.querySelectorAll('.search-result-item') : [])];
            if (!items.length) return;
            const idxActive = items.findIndex(el => el.classList.contains('active'));
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = idxActive < items.length - 1 ? idxActive + 1 : 0;
                items.forEach(el => { el.classList.remove('active'); el.setAttribute('aria-selected','false'); });
                items[next].classList.add('active'); items[next].setAttribute('aria-selected','true');
                items[next].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = idxActive > 0 ? idxActive - 1 : items.length - 1;
                items.forEach(el => { el.classList.remove('active'); el.setAttribute('aria-selected','false'); });
                items[prev].classList.add('active'); items[prev].setAttribute('aria-selected','true');
                items[prev].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const current = idxActive >= 0 ? items[idxActive] : items[0];
                if (current) current.click();
            }
        });
    }

    // Prefetch index on idle
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initializeSearch());
    } else {
        setTimeout(() => initializeSearch(), 800);
    }

    function onTrapKeydown(e) {
        if (e.key !== 'Tab') return;
        const focusable = searchModal.querySelectorAll('input, button, [href], [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
        }
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

    // Use rAF-based throttling to avoid layout thrash on scroll
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    // passive listener for better scroll performance on touch devices
    window.addEventListener('scroll', onScroll, { passive: true });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}