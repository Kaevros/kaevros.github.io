// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM içeriği yüklendi. Script çalışıyor.");

    // Gerekli DOM elemanlarını seçelim
    const welcomeScreen = document.getElementById('welcome-screen');
    const blogTitle = document.getElementById('blog-title');
    const welcomeMessage = document.getElementById('welcome-message');
    const skipButton = document.getElementById('skip-button');
    const mainLayout = document.querySelector('.main-layout');

    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarBlogTitle = document.getElementById('sidebar-blog-title');

    // Daktilo efekti ve mesaj döngüsü için değişkenler
    let messages = [
        "Siber güvenlik sadece bir başlangıçtır.",
        "Sistemler insanlar tarafından yapılır ve insanlar kusurludur.",
        "Kontrol bir yanılsamadır.",
        "Sıfırlar ve birler... Dünyayı yöneten ikili.",
        "Gerçek tehlike, görmezden geldiğimiz güvenlik açığıdır."
    ];
    let messageIndex = 0;
    let typingInterval; // Hata veren değişken burada doğru şekilde tanımlandı
    let messageCycleTimeout;
    let sidebarCloseTimeout;

    // --- Karşılama Ekranı Mantığı ---

    /**
     * Daktilo efekti ile metin yazan fonksiyon.
     * @param {string} text - Yazılacak metin.
     * @param {HTMLElement} element - Metnin yazılacağı HTML elemanı.
     * @param {function} callback - Yazma işlemi bittiğinde çalışacak fonksiyon.
     */
    function typeWriterEffect(text, element, callback) {
        if (!element) return; // Eleman bulunamazsa işlemi durdur
        
        element.textContent = '';
        element.style.borderRightColor = 'var(--accent-color-primary)'; // İmleci görünür yap

        // Önceki animasyonları temizle
        if (typingInterval) clearInterval(typingInterval);
        clearTimeout(messageCycleTimeout);

        let i = 0;
        typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval); // Yazı bitince interval'i durdur
                typingInterval = null; // Değişkeni sıfırla
                setTimeout(() => { // İmleci gizlemeden önce kısa bir bekleme
                     if(element) element.style.borderRightColor = 'transparent';
                }, 500);
                if (callback) callback();
            }
        }, 85); // Karakter yazma hızı (ms)
    }

    /**
     * Sloganları döngüsel olarak gösteren fonksiyon.
     */
    function startMessageCycle() {
        if (!welcomeMessage || messages.length === 0) return;

        // Bir sonraki mesaja geçmeden önce eski metni temizle ve görünür yap
        welcomeMessage.textContent = '';
        welcomeMessage.style.opacity = '1';

        const currentMessage = messages[messageIndex];

        typeWriterEffect(currentMessage, welcomeMessage, () => {
            messageIndex = (messageIndex + 1) % messages.length;
            // Bir sonraki mesaj için döngüyü ayarla
            messageCycleTimeout = setTimeout(startMessageCycle, 4000); // Sloganlar arası bekleme süresi (4 saniye)
        });

        // Skip butonu varsa görünür yap
        if (skipButton) {
            skipButton.classList.remove('hidden');
            skipButton.classList.add('visible');
        }
    }

    /**
     * Karşılama ekranından ana blog görünümüne geçişi sağlar.
     */
    function enterBlog() {
        // Tüm animasyon zamanlayıcılarını temizle
        if (typingInterval) clearInterval(typingInterval);
        clearTimeout(messageCycleTimeout);

        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
            // welcomeScreen tamamen gizlendikten sonra display:none yap
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 1000); // CSS transition süresiyle aynı olmalı
        }

        if (mainLayout) {
            mainLayout.classList.remove('hidden');
            mainLayout.classList.add('visible');
        }
    }
    
    // Skip butonuna tıklama olayını ekle
    if (skipButton) {
        skipButton.addEventListener('click', enterBlog);
    } else {
        // Bu artık bir hata değil, sadece bir uyarı. Script çalışmaya devam eder.
        console.warn('Skip butonu bulunamadı!');
    }

    // Karşılama animasyonunu başlat
    if (welcomeScreen) {
         setTimeout(startMessageCycle, 1500); // Sayfa yüklendikten 1.5 saniye sonra başla
    }
   

    // --- Sidebar İşlevselliği ---

    function openSidebar() {
        if (sidebar) sidebar.classList.add('open');
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('open');
    }

    // Mobil menü (hamburger) tıklama olayı
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Olayın dışarıya yayılmasını engelle
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    // Mobil kapatma (X) butonu tıklama olayı
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }

    // Sidebar linklerine tıklandığında (mobil için) menüyü kapat
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });
    });

    // Sayfanın herhangi bir yerine tıklandığında (mobil için) menüyü kapat
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && sidebar && mobileMenuToggle) {
             if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                closeSidebar();
            }
        }
    });

    // PC'de fare sidebar üzerindeyken otomatik kapanmasını engelleme (bu mantık CSS :hover ile daha verimli yönetiliyor)
    // Ancak mobil için bir otomatik kapanma ekleyebiliriz (istendiği gibi)
    sidebar.addEventListener('mouseenter', () => clearTimeout(sidebarCloseTimeout));
    sidebar.addEventListener('mouseleave', () => {
        if(window.innerWidth <= 768 && sidebar.classList.contains('open')) {
             sidebarCloseTimeout = setTimeout(closeSidebar, 5000); // Mobil'de 5sn sonra kapat
        }
    });
});
