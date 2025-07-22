// /assets/js/script.js - ARAMA, İLERLEME ÇUBUĞU VE DİĞER TÜM ÖZELLİKLER
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('home')) { setupWelcomeScreen(); }
    setupSidebar();
    enhanceCodeBlocks();
    setActiveSidebarLink();
    setupReplayButton();
    setupReadingProgressBar();
    setupSearch();
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
    function enterBlog() { if (typingInterval) clearInterval(typingInterval); const welcomeScreen = document.getElementById('welcome-screen'); const mainLayout = document.querySelector('.main-layout'); if (welcomeScreen) { welcomeScreen.classList.add('hidden'); setTimeout(() => { welcomeScreen.style.display = 'none'; }, 1000); } if (mainLayout) { mainLayout.classList.remove('hidden'); } }
    if (skipButton) { skipButton.addEventListener('click', enterBlog); }
    setTimeout(startMessageCycle, 1500);
}
function setupSidebar() { const sidebar = document.getElementById('sidebar'); const mobileMenuToggle = document.getElementById('mobile-menu-toggle'); const closeSidebarBtn = document.getElementById('close-sidebar-btn'); if (!sidebar || !mobileMenuToggle || !closeSidebarBtn) return; mobileMenuToggle.addEventListener('click', (e) => { e.stopPropagation(); sidebar.classList.add('open'); }); closeSidebarBtn.addEventListener('click', () => { sidebar.classList.remove('open'); }); document.addEventListener('click', (event) => { if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) { sidebar.classList.remove('open'); } }); }
function enhanceCodeBlocks() { if (typeof hljs === 'undefined') { return; } document.querySelectorAll('pre code').forEach((block) => { hljs.highlightElement(block); }); document.querySelectorAll('pre').forEach(block => { const codeElement = block.querySelector('code'); if (!codeElement) return; const copyButton = document.createElement('button'); copyButton.className = 'copy-code-button'; copyButton.textContent = 'Kopyala'; block.appendChild(copyButton); copyButton.addEventListener('click', () => { navigator.clipboard.writeText(codeElement.innerText).then(() => { copyButton.textContent = 'Kopyalandı!'; copyButton.style.backgroundColor = 'var(--accent-color-primary)'; setTimeout(() => { copyButton.textContent = 'Kopyala'; copyButton.style.backgroundColor = ''; }, 2000); }); }); }); }
function setActiveSidebarLink() { const currentPath = window.location.pathname; document.querySelectorAll('.sidebar-nav a').forEach(link => { const linkHref = link.getAttribute('href'); if (linkHref === currentPath || (currentPath === '/' && linkHref === '/index.html')) { link.classList.add('active'); } }); }
function setupReplayButton() { const replayButton = document.getElementById('replay-animation-btn'); if (replayButton) { replayButton.addEventListener('click', () => { window.location.href = '/index.html'; }); } }

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
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results-container');
    const mainContent = document.getElementById('main-content');
    if (!searchInput || !resultsContainer || !mainContent) return;

    let idx, searchDocs;
    let dataFetched = false;

    async function initializeSearch() {
        try {
            const [idxResponse, docsResponse] = await Promise.all([
                fetch('/search-index.json'),
                fetch('/search-docs.json')
            ]);
            const serializedIdx = await idxResponse.json();
            searchDocs = await docsResponse.json();
            idx = lunr.Index.load(serializedIdx);
            dataFetched = true;
        } catch (error) {
            console.error("Arama verileri yüklenemedi:", error);
        }
    }

    searchInput.addEventListener('focus', () => {
        if (!dataFetched) initializeSearch();
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            mainContent.style.display = 'block';
            return;
        }
        if (!idx) return;

        const results = idx.search(query + '*');
        displayResults(results);
    });

    function displayResults(results) {
        if (results.length > 0) {
            mainContent.style.display = 'none';
            resultsContainer.style.display = 'block';
            let resultsHTML = '<ul>';
            results.forEach(result => {
                const doc = searchDocs[result.ref];
                resultsHTML += `<li><a href="/${result.ref}"><h3>${doc.title}</h3><p>${doc.description || ''}</p></a></li>`;
            });
            resultsHTML += '</ul>';
            resultsContainer.innerHTML = resultsHTML;
        } else {
            mainContent.style.display = 'none';
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = '<p class="no-results">Sonuç bulunamadı.</p>';
        }
    }
}