// /assets/js/modules/animations.js

export function setupWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (!welcomeScreen) return;

    const welcomeMessage = document.getElementById('welcome-message');
    const skipButton = document.getElementById('skip-button');
    const messages = ["Sistemler insanlar tarafından yapılır ve insanlar kusurludur."];
    let rafId = null;
    let startTime = null;
    let charIndex = 0;
    let currentText = '';

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const msPerChar = 65; // hız; küçük ise daha hızlı

    function typeWriterEffect(el, text, onComplete) {
        if (!el) {
            if (onComplete) onComplete();
            return;
        }
        el.textContent = '';
        currentText = text;
        charIndex = 0;
        startTime = null;

        if (prefersReduced) {
            el.textContent = text;
            if (onComplete) onComplete();
            return;
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const shouldShow = Math.min(text.length, Math.floor(elapsed / msPerChar));
            if (shouldShow > charIndex) {
                charIndex = shouldShow;
                el.textContent = text.slice(0, charIndex);
            }
            if (charIndex < text.length) {
                rafId = requestAnimationFrame(step);
            } else {
                rafId = null;
                if (onComplete) onComplete();
            }
        }
        rafId = requestAnimationFrame(step);
    }

    function cancelTyping() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        if (welcomeMessage && currentText) {
            welcomeMessage.textContent = currentText;
        }
    }

    function showWelcome() {
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.classList.add('visible');
        document.documentElement.setAttribute('data-page-state', 'welcome');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            if (welcomeMessage) {
                typeWriterEffect(welcomeMessage, messages[0], () => {
                    if (skipButton) skipButton.classList.add('visible');
                });
            }
        }, 220);
    }

    function enterBlog() {
        cancelTyping();
        sessionStorage.setItem('hasVisited', 'true');
        welcomeScreen.classList.remove('visible');
        welcomeScreen.classList.add('hidden');
        document.documentElement.removeAttribute('data-page-state');
        document.body.style.overflow = '';
        const mainLayout = document.querySelector('.main-layout');
        if (mainLayout) mainLayout.classList.remove('hidden');
    }

    if (skipButton) {
        skipButton.addEventListener('click', enterBlog);
        // Klavye ile erişilebilirlik
        skipButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                enterBlog();
            }
        });
    }

    // Escape tuşu ile atla
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && welcomeScreen.classList.contains('visible')) {
            enterBlog();
        }
    });

    // Başlatma: ziyaret edilmişse pas geç, değilse göster
    if (!sessionStorage.getItem('hasVisited')) {
        // küçük gecikme ile göster
        setTimeout(showWelcome, 300);
    } else {
        const mainLayout = document.querySelector('.main-layout');
        if (mainLayout) mainLayout.classList.remove('hidden');
    }
}

export function skipWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainLayout = document.querySelector('.main-layout');
    if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
        welcomeScreen.classList.remove('visible');
        welcomeScreen.addEventListener('transitionend', () => {
            // tamamen gizlendiğinde overflow'u temizle
            document.body.style.overflow = '';
        }, { once: true });
    } else {
        document.body.style.overflow = '';
    }
    if (mainLayout) {
        mainLayout.classList.remove('hidden');
    }
}