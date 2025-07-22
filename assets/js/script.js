// js/script.js - TAM GÜNCEL VE DÜZELTİLMİŞ HALİ

document.addEventListener('DOMContentLoaded', () => {
    // anasayfadaysak giriş animasyonunu kur.
    if (document.body.classList.contains('home')) {
        setupWelcomeScreen();
    } else {
        // anasayfa dışındaki sayfalarda direkt içeriği göster.
        const mainLayout = document.querySelector('.main-layout');
        if (mainLayout) {
            // "hidden" class'ını kaldırarak görünür yap
            mainLayout.classList.remove('hidden');
            mainLayout.style.opacity = 1;
        }
    }

    // Sidebar her sayfada lazım.
    setupSidebar();
    
    // Kod bloklarını yakalayıp güzelleştir.
    enhanceCodeBlocks();

    // Hangi sayfadaysak o linki sidebar'da işaretle.
    setActiveSidebarLink();

    // Scroll animasyonlarını başlat.
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
        });
    }
});


/**
 * Karşılama ekranını ve daktilo efektini ayarlar.
 */
function setupWelcomeScreen() {
    const welcomeMessage = document.getElementById('welcome-message');
    const skipButton = document.getElementById('skip-button');
    const messages = [
        "Siber güvenlik sadece bir başlangıçtır.",
        "Sistemler insanlar tarafından yapılır ve insanlar kusurludur.",
        "Kontrol bir yanılsamadır.",
        "Sıfırlar ve birler... Dünyayı yöneten ikili.",
        "Gerçek tehlike, görmezden geldiğimiz güvenlik açığıdır."
    ];
    let messageIndex = 0;
    let typingInterval, messageCycleTimeout;

    function typeWriterEffect(element, text, onComplete) {
        if (!element) return;
        element.textContent = '';
        element.style.borderRightColor = 'var(--accent-color-primary)';
        if (typingInterval) clearInterval(typingInterval);
        
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
        if (!welcomeMessage || messages.length === 0) return;
        welcomeMessage.style.opacity = '1';
        typeWriterEffect(welcomeMessage, messages[messageIndex], () => {
            messageIndex = (messageIndex + 1) % messages.length;
            messageCycleTimeout = setTimeout(startMessageCycle, 4000);
        });
        if (skipButton) skipButton.classList.add('visible');
    }

    function enterBlog() {
        if (typingInterval) clearInterval(typingInterval);
        if (messageCycleTimeout) clearTimeout(messageCycleTimeout);

        const welcomeScreen = document.getElementById('welcome-screen');
        const mainLayout = document.querySelector('.main-layout');

        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
            // DOM'dan kaldırmak için display none ekle
            setTimeout(() => { welcomeScreen.style.display = 'none'; }, 1000);
        }
        if (mainLayout) {
             mainLayout.classList.remove('hidden');
        }
    }

    if (skipButton) {
        skipButton.addEventListener('click', enterBlog);
    }
    
    // Animasyon biraz geç başlasın, daha şık duruyor.
    setTimeout(startMessageCycle, 1500);
}


/**
 * Kenardaki menünün (sidebar) açılıp kapanma olaylarını halleder. (Mobil için iyileştirildi)
 */
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    
    if (!sidebar || !mobileMenuToggle || !closeSidebarBtn) return;

    const openMenu = () => {
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open'); // Arka plan kaydırmayı engelle
    };
    
    const closeMenu = () => {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open'); // Kaydırmayı tekrar aktif et
    };

    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        openMenu();
    });

    closeSidebarBtn.addEventListener('click', closeMenu);

    document.addEventListener('click', (event) => {
        // Sadece mobil görünümde ve menü açıkken dışarı tıklanınca kapat
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            // Tıklanan yerin menü veya menü açma butonu OLMADIĞINDAN emin ol
            if (!sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                closeMenu();
            }
        }
    });
}


/**
 * Kod bloklarına kopyalama butonu ekler ve renklendirir.
 */
function enhanceCodeBlocks() {
    if (typeof hljs === 'undefined') {
        console.warn('highlight.js kütüphanesi bulunamadı.');
        return;
    }
    // Tüm `pre code` bloklarını renklendir
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });

    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(preElement => {
        const codeElement = preElement.querySelector('code');
        if (!codeElement) return;

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'Kopyala';
        preElement.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
            const codeToCopy = codeElement.innerText;
            navigator.clipboard.writeText(codeToCopy).then(() => {
                copyButton.textContent = 'Kopyalandı!';
                copyButton.style.backgroundColor = 'var(--accent-color-primary)';
                setTimeout(() => {
                    copyButton.textContent = 'Kopyala';
                    copyButton.style.backgroundColor = '';
                }, 2000);
            }).catch(err => {
                copyButton.textContent = 'Hata!';
                console.error('Kod kopyalanamadı: ', err);
            });
        });
    });
}


/**
 * Bulunulan sayfaya göre sidebar'daki aktif linki işaretler.
 */
function setActiveSidebarLink() {
    // `../` gibi göreceli yolları hesaba katmak için tam yolu alıyoruz.
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        // Eğer linkin yolu, mevcut yolun sonunda bitiyorsa aktif kabul et.
        // Bu, 'index.html' gibi durumları doğru yönetir.
        if (currentPath.endsWith(linkPath)) {
            link.classList.add('active');
        }
    });
}