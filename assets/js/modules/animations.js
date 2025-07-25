// /assets/js/modules/animations.js

export function setupWelcomeScreen() {
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

    setTimeout(startMessageCycle, 2000);
}

export function skipWelcomeScreen() {
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