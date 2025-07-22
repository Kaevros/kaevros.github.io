// /assets/js/script.js - NİHAİ VERSİYON
document.addEventListener('DOMContentLoaded', () => {
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
    function typeWriterEffect(element, text, onComplete) {
        if (!element) return;
        element.textContent = ''; let i = 0;
        typingInterval = setInterval(() => {
            if (i < text.length) { element.textContent += text.charAt(i); i++; } 
            else { clearInterval(typingInterval); if (onComplete) onComplete(); }
        }, 85);
    }
    function startMessageCycle() {
        if (!welcomeMessage || messages.length === 0) return;
        welcomeMessage.style.opacity = '1';
        typeWriterEffect(welcomeMessage, messages[0], () => { setTimeout(enterBlog, 3000); });
        if (skipButton) skipButton.classList.add('visible');
    }
    function enterBlog() {
        if (typingInterval) clearInterval(typingInterval);
        localStorage.setItem('hasVisited', 'true');
        skipWelcomeScreen();
    }
    if (skipButton) { skipButton.addEventListener('click', enterBlog); }
    setTimeout(startMessageCycle, 1500);
}
function skipWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainLayout = document.querySelector('.main-layout');
    if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
        setTimeout(() => { welcomeScreen.style.display = 'none'; }, 1000);
    }
    if (mainLayout) { mainLayout.classList.remove('hidden'); }
}
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    if (!sidebar || !mobileMenuToggle || !closeSidebarBtn) return;
    mobileMenuToggle.addEventListener('click', (e) => { e.stopPropagation(); sidebar.classList.add('open'); });
    closeSidebarBtn.addEventListener('click', () => { sidebar.classList.remove('open'); });
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}
function enhanceCodeBlocks() {
    if (typeof hljs === 'undefined') { return; }
    document.querySelectorAll('pre code').forEach((block) => { hljs.highlightElement(block); });
    document.querySelectorAll('pre').forEach(block => {
        const codeElement = block.querySelector('code'); if (!codeElement) return;
        const copyButton = document.createElement('button'); copyButton.className = 'copy-code-button'; copyButton.textContent = 'Kopyala';
        block.appendChild(copyButton);
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(codeElement.innerText).then(() => {
                copyButton.textContent = 'Kopyalandı!'; copyButton.style.backgroundColor = 'var(--accent-color-primary)';
                setTimeout(() => { copyButton.textContent = 'Kopyala'; copyButton.style.backgroundColor = ''; }, 2000);
            });
        });
    });
}
function setActiveSidebarLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
            link.classList.add('active');
        }
    });
}
function setupReplayButton() {
    const replayButton = document.getElementById('replay-animation-btn');
    if (replayButton) {
        replayButton.addEventListener('click', () => {
            localStorage.removeItem('hasVisited');
            window.location.href = '/index.html';
        });
    }
}
