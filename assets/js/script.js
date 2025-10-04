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
    
    // Defer heavy third-party inits until main layout is visible to reduce first-load jank
    function initThirdPartyIfReady(attempts = 0) {
        const mainLayout = document.querySelector('.main-layout');
        const visible = mainLayout && !mainLayout.classList.contains('hidden');
        if (visible || attempts > 60) {
            if (typeof GLightbox !== 'undefined') GLightbox({ selector: '.glightbox' });
            if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 50 });
            return;
        }
        // wait next frame and try again (up to ~1 second)
        window.requestAnimationFrame(() => initThirdPartyIfReady(attempts + 1));
    }
    initThirdPartyIfReady();
    // Start hero background animation after layout visible to avoid first-paint jank
    function enableHeroAnim(attempts=0){
        const mainLayout = document.querySelector('.main-layout');
        const hero = document.querySelector('.hero-section');
        const visible = mainLayout && !mainLayout.classList.contains('hidden');
        if ((visible && hero) || attempts>60){
            if (hero) hero.classList.add('hero-animate');
            return;
        }
        requestAnimationFrame(()=>enableHeroAnim(attempts+1));
    }
    enableHeroAnim();
    // PWA: register service worker (non-blocking)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').catch(() => {});
        });
    }
});