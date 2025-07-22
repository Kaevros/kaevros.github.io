// js/script.js

// Bütün olay burada başlıyor. Sayfa hazır olunca...
document.addEventListener('DOMContentLoaded', () => {
    // console.log("Sayfa hazır, makine ısınıyor...");

    // Giriş animasyonu sadece anasayfada çalışsın diye body'e bir class eklemiştik.
    if (document.body.classList.contains('home')) {
        setupWelcomeScreen();
    }

    // Sidebar her sayfada lazım, o yüzden onu hep kuruyoruz.
    setupSidebar();
    
    // Kod bloklarını yakalayıp güzelleştiren sihirbaz.
    enhanceCodeBlocks();

    // Hangi sayfadaysak o linki sidebar'da işaretleyelim ki kullanıcı kaybolmasın.
    setActiveSidebarLink();
});


/**
 * O havalı karşılama ekranını ve daktilo efektini ayarlar.
 */
function setupWelcomeScreen() {
    const welcomeMessage = document.getElementById('welcome-message');
    const skipButton = document.getElementById('skip-button');
    
    // Ekranda dönecek o felsefi sözler.
    const messages = [
        "Siber güvenlik sadece bir başlangıçtır.",
        "Sistemler insanlar tarafından yapılır ve insanlar kusurludur.",
        "Kontrol bir yanılsamadır.",
        "Sıfırlar ve birler... Dünyayı yöneten ikili.",
        "Gerçek tehlike, görmezden geldiğimiz güvenlik açığıdır."
    ];
    let messageIndex = 0;
    let typingInterval;
    let messageCycleTimeout;

    // Şu meşhur daktilo efekti fonksiyonu.
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

    // Mesajları birer birer ekrana getiren döngü.
    function startMessageCycle() {
        if (!welcomeMessage || messages.length === 0) return;
        welcomeMessage.style.opacity = '1';
        typeWriterEffect(welcomeMessage, messages[messageIndex], () => {
            messageIndex = (messageIndex + 1) % messages.length;
            messageCycleTimeout = setTimeout(startMessageCycle, 4000); // sonraki mesaja geçmeden bekle
        });
        if (skipButton) skipButton.classList.add('visible');
    }

    // Karşılama ekranını atlayıp ana siteye dalma fonksiyonu.
    function enterBlog() {
        if (typingInterval) clearInterval(typingInterval);
        clearTimeout(messageCycleTimeout);

        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
            setTimeout(() => { welcomeScreen.style.display = 'none'; }, 1000); // animasyon bitsin diye bekliyoruz
        }
        document.querySelector('.main-layout').classList.add('visible');
    }
    
    if (skipButton) {
        skipButton.addEventListener('click', enterBlog);
    }

    // Başlangıç vuruşu
    setTimeout(startMessageCycle, 1500);
}


/**
 * Kenardaki menünün (sidebar) açılıp kapanma olaylarını halleder.
 */
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    // bu elemanlar yoksa hiç uğraşmayalım
    if (!sidebar || !mobileMenuToggle || !closeSidebarBtn) return;

    // hamburger menüye tıklayınca...
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    // çarpı (X) butonuna tıklayınca...
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // mobilde menü açıkken dışarı tıklayınca kapansın.
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}


/**
 * Sayfadaki tüm kod bloklarını (<pre> etiketleri) bulur,
 * onları renklendirir ve bir de kopyalama butonu ekler. Tam teşkilatlı.
 */
function enhanceCodeBlocks() {
    // hljs kütüphanesi yüklenmiş mi, bi' bakalım.
    if (typeof hljs === 'undefined') {
        // console.log("highlight.js kütüphanesi bu sayfada yok, atlıyorum.");
        return;
    }
    
    // sayfadaki tüm kodları otomatik olarak bul ve boya.
    hljs.highlightAll();

    // şimdi de kopyala butonlarını ekleyelim
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        const codeElement = block.querySelector('code');
        // içinde kod olmayan pre'leri atlayalım.
        if (!codeElement) return;

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'Kopyala';

        block.appendChild(copyButton);

        // butona basınca olacaklar...
        copyButton.addEventListener('click', () => {
            const codeToCopy = codeElement.innerText;
            navigator.clipboard.writeText(codeToCopy).then(() => {
                // başardık!
                copyButton.textContent = 'Kopyalandı!';
                copyButton.style.backgroundColor = 'var(--accent-color-primary)';
                setTimeout(() => {
                    copyButton.textContent = 'Kopyala';
                    copyButton.style.backgroundColor = '';
                }, 2000); // 2 saniye sonra eski haline dönsün
            }).catch(err => {
                console.error('Kod panoya kopyalanamadı, ne yazık ki.', err);
                copyButton.textContent = 'Hata!';
            });
        });
    });
}

/**
 * Mevcut sayfanın URL'ine bakarak sidebar'daki doğru linke "active" class'ı ekler.
 */
function setActiveSidebarLink() {
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        // Anasayfa özel durumu (genellikle 'index.html' veya boş olur)
        if (currentPath === '' || currentPath === 'index.html') {
            if (linkPath === '' || linkPath === 'index.html') {
                link.classList.add('active');
            }
        } else if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}
