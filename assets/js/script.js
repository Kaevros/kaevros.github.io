// /assets/js/script.js - Modüler Başlatıcı

import { setupWelcomeScreen, skipWelcomeScreen } from './modules/animations.js';
import { setupSidebar, setupSearch, setupThemeToggle, setupBackToTopButton, enhanceCodeBlocks } from './modules/ui.js';
import { setActiveSidebarLink, replayIntro, setupReadingProgressBar, setupReplayButton } from './modules/utils.js';

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
    
    if (typeof GLightbox !== 'undefined') GLightbox({ selector: '.glightbox' });
    if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 50 });
});