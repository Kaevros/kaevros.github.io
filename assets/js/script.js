// /assets/js/script.js - Modüler Başlatıcı

import { setupWelcomeScreen, skipWelcomeScreen } from './modules/animations.js';
import { setupSidebar, setupSearch, setupThemeToggle, setupBackToTopButton, enhanceCodeBlocks } from './modules/ui.js';
// setupReplayButton buraya eklendi ve doğru yerden import ediliyor
import { setActiveSidebarLink, setupReadingProgressBar, setupReplayButton } from './modules/utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Önce temayı uygula
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Giriş animasyonunu sadece ana sayfada çalıştır
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

    // Tüm bileşenleri başlat
    setupSidebar();
    enhanceCodeBlocks();
    setActiveSidebarLink();
    setupReplayButton(); // Bu satır artık hata vermeyecek
    setupReadingProgressBar();
    setupSearch();
    setupThemeToggle();
    setupBackToTopButton();
    
    // Global kütüphaneleri (varsa) başlat
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