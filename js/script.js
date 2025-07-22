// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM içeriği yüklendi. Script çalışıyor.');

    const welcomeScreen = document.getElementById('welcome-screen');
    const blogTitleElement = document.getElementById('blog-title');
    const welcomeMessageElement = document.getElementById('welcome-message');
    const skipButton = document.getElementById('skip-button');
    const mainLayout = document.querySelector('.main-layout');
    const latestPostsSection = document.getElementById('latest-posts-section');

    const sidebar = document.getElementById('sidebar'); // Sidebar elementi
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle'); // Hamburger ikonu
    const closeSidebarBtn = document.getElementById('close-sidebar-btn'); // Kapatma ikonu (X)

    let messages = [];
    let messageIndex = 0;
    let typingTimeout;
    let messageCycleTimeout;
    let sidebarCloseTimeout; // Mobil sidebar için otomatik kapanma zamanlayıcısı

    // Dinamik içerikleri Decap CMS'ten yükle (data-attributes'tan)
    function loadDynamicContentFromHTML() {
        const messagesData = welcomeMessageElement.getAttribute('data-messages');
        if (messagesData) {
            try {
                const parsedMessages = JSON.parse(messagesData);
                if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
                    messages = parsedMessages.map(item => item.message);
                    console.log('Sloganlar HTML data-attribute üzerinden yüklendi:', messages);
                    return;
                }
            } catch (e) {
                console.error('data-messages JSON ayrıştırma hatası:', e);
            }
        }
        // Eğer data-messages boşsa veya hata varsa varsayılanları kullan
        messages = [
            "Düşünceler kodla buluşuyor. Hoş geldiniz.",
            "Siberin karanlık dehlizlerinde yolculuğa çıkmaya hazır mısın?",
            "Bilgi güvenliğin, dijital özgürlüğündür. Koru onu.",
            "Ağlar konuşur, biz dinleriz. Tehlikeleri analiz ederiz.",
            "Her byte bir sır saklar. Çözebilir misin?"
        ];
        console.log('Varsayılan sloganlar kullanıldı:', messages);
    }

    // Daktilo efekti fonksiyonu
    function typeWriterEffect(text, element, callback) {
        element.textContent = '';
        element.style.width = '0%';

        clearInterval(typingInterval);

        element.classList.remove('typing-active');
        element.offsetHeight; 
        element.classList.add('typing-active');

        element.textContent = text;
        element.style.setProperty('--typing-steps', text.length);
        const typingDuration = text.length * 80;
        element.style.setProperty('--typing-duration', `${typingDuration}ms`);

        typingTimeout = setTimeout(() => {
            element.classList.remove('typing-active');
            element.style.borderRightColor = 'transparent';
            if (callback) callback();
        }, typingDuration + 500);
    }

    // Mesaj döngüsünü başlatan fonksiyon
    function startMessageCycle() {
        if (messages.length === 0) {
            console.warn('Mesaj listesi boş, daktilo animasyonu başlatılamıyor.');
            skipButton.classList.remove('hidden');
            skipButton.classList.add('visible');
            return;
        }

        const currentMessage = messages[messageIndex];
        welcomeMessageElement.style.opacity = '1';

        typeWriterEffect(currentMessage, welcomeMessageElement, () => {
            messageIndex = (messageIndex + 1) % messages.length;
            clearTimeout(messageCycleTimeout);
            messageCycleTimeout = setTimeout(startMessageCycle, 3000);
        });

        skipButton.classList.remove('hidden');
        skipButton.classList.add('visible');
    }

    // Bloga giriş fonksiyonu
    function enterBlog() {
        console.log('Bloga giriş yapılıyor...');
        clearInterval(typingInterval);
        clearTimeout(messageCycleTimeout);

        welcomeScreen.classList.add('hidden');
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            mainLayout.classList.remove('hidden');
            mainLayout.classList.add('visible');
            latestPostsSection.classList.remove('hidden'); // "Son Yazılar" bölümünü göster
        }, 1000);
    }

    // "GEÇ >_" butonu tıklama olayı
    if (skipButton) {
        skipButton.addEventListener('click', enterBlog);
    } else {
        console.error('Skip butonu bulunamadı!');
    }

    // Sayfa yüklendiğinde karşılama ekranını başlatma mantığı
    const isIndexPage = (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/');
    if (isIndexPage) {
        loadDynamicContentFromHTML();
        blogTitleElement.textContent = "Mustafa Günay";
        document.getElementById('sidebar-blog-title').textContent = "Mustafa Günay";
        
        setTimeout(() => {
            startMessageCycle();
        }, 1500);
        
    } else {
        // Diğer sayfalar için karşılama ekranını atla ve ana içeriği direkt göster
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
        if (mainLayout) {
            mainLayout.classList.remove('hidden');
            mainLayout.classList.add('visible');
        }
        if (latestPostsSection) {
            latestPostsSection.classList.add('hidden');
        }
        document.getElementById('sidebar-blog-title').textContent = "Mustafa Günay";
    }

    // --- Sidebar İşlevselliği ---

    // Mobil menüyü açma/kapama fonksiyonları
    function openSidebar() {
        sidebar.classList.add('open');
        // Mobil sidebar açıldığında Mustafa Günay yazısının görünür olmasını sağla
        const sidebarTitle = sidebar.querySelector('.sidebar-header h2');
        if (sidebarTitle) {
            sidebarTitle.style.opacity = '1';
            sidebarTitle.style.transition = 'opacity 0.3s ease-in-out'; // Animasyon ekle
        }
        // Otomatik kapanma zamanlayıcısını başlat
        resetSidebarCloseTimer();
        console.log('Mobil sidebar açıldı.');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        // Mobil sidebar kapandığında Mustafa Günay yazısını gizle
        const sidebarTitle = sidebar.querySelector('.sidebar-header h2');
        if (sidebarTitle) {
            sidebarTitle.style.opacity = '0';
        }
        clearTimeout(sidebarCloseTimeout); // Zamanlayıcıyı temizle
        console.log('Mobil sidebar kapandı.');
    }

    // Mobil menü toggle butonuna tıklama olayı
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', openSidebar);
    } else {
        console.error('Mobil menü toggle butonu bulunamadı!');
    }

    // Kapatma (X) butonuna tıklama olayı
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    } else {
        console.error('Kapatma butonu bulunamadı!');
    }

    // Sidebar içindeki bir linke tıklandığında menüyü kapat
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', () => {
            // Sadece mobil görünümde sidebar'ı kapat
            if (window.innerWidth <= 768) { // Mobil ekran boyutu eşiği
                closeSidebar();
            }
        });
        // Mobil görünümde fare etkileşimleri için dokunma olaylarını dinle
        if (window.innerWidth <= 768) {
            item.addEventListener('touchstart', () => {
                resetSidebarCloseTimer(); // Dokunulduğunda zamanlayıcıyı sıfırla
            });
        }
    });

    // Otomatik kapanma zamanlayıcısını sıfırlayan fonksiyon
    function resetSidebarCloseTimer() {
        clearTimeout(sidebarCloseTimeout);
        sidebarCloseTimeout = setTimeout(() => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }, 5000); // 5 saniye sonra otomatik kapanacak
    }

    // Mobil sidebar açıkken dışarıya tıklama olayını dinle (otomatik kapanma)
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open') &&
            !sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            closeSidebar();
        }
    });

    // Pencere boyutu değiştiğinde sidebar durumunu sıfırla (mobil/PC geçişi için)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // PC moduna geçince mobil specific sınıfları kaldır
            sidebar.classList.remove('open');
            sidebar.style.left = '0'; // PC'de solda kalsın
            const sidebarTitle = sidebar.querySelector('.sidebar-header h2');
            if (sidebarTitle) {
                 sidebarTitle.style.opacity = ''; // CSS'in kontrol etmesine izin ver
                 sidebarTitle.style.transition = '';
            }
        } else {
            // Mobil moduna geçince (eğer açıksa) otomatik kapanma zamanlayıcısını başlat
            if (sidebar.classList.contains('open')) {
                resetSidebarCloseTimer();
            }
        }
    });

    // Sidebar header'daki Mustafa Günay yazısı ve kapatma butonu PC'de gizli olsun
    // Bu kontrol CSS'te de var ama JS ile de ek kontrol edelim.
    if (window.innerWidth > 768) {
        if (closeSidebarBtn) closeSidebarBtn.style.display = 'none';
        const sidebarTitlePC = sidebar.querySelector('.sidebar-header h2');
        if (sidebarTitlePC) sidebarTitlePC.style.opacity = '0'; // PC'de başlangıçta gizli
    }
});
