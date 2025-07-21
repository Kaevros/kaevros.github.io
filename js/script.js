// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM içeriği yüklendi.');

    const welcomeScreen = document.getElementById('welcome-screen');
    const blogTitleElement = document.getElementById('blog-title');
    const welcomeMessageElement = document.getElementById('welcome-message');
    const skipButton = document.getElementById('skip-button');
    const mainLayout = document.querySelector('.main-layout');
    const latestPostsSection = document.getElementById('latest-posts-section'); // "Son Yazılar" bölümü

    let messages = []; // Decap CMS'ten veya varsayılan olarak yüklenecek mesajlar
    let messageIndex = 0;
    let typingInterval; // setInterval yerine bu
    let messageCycleTimeout; // setTimeout için

    // Decap CMS'ten dinamik içerik yükleme (data-attributes'tan)
    function loadDynamicContentFromHTML() {
        // index.html'deki data-messages attribute'undan sloganları çek
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
            "Dijital ayak izlerinizi bırakın, hikayeler yaratın.",
            "Veri sadece rakam değil, anlamdır. Anlam katın.",
            "Bugün hangi sorunu çözüyoruz?"
        ];
        console.log('Varsayılan sloganlar kullanıldı:', messages);
    }

    // Daktilo efekti fonksiyonu (daha kararlı hale getirildi)
    function typeWriterEffect(text, element, callback) {
        let i = 0;
        element.textContent = ''; // Önceki metni temizle
        element.style.width = '0%'; // CSS animasyonu için başlangıç genişliği

        clearInterval(typingInterval); // Önceki interval'i temizle

        // CSS'teki animasyonu doğrudan tetiklemek için sınıf ekle/kaldır
        element.classList.remove('typing-active'); // Önceki animasyonu sıfırla
        element.offsetHeight; // Reflow'u zorla (animasyonu yeniden başlatmak için)
        element.classList.add('typing-active');

        // Metni hemen ekle, CSS animasyonu görünürlükle oynayacak
        element.textContent = text;
        element.style.setProperty('--typing-steps', text.length); // CSS animasyonu için custom property
        // Her harf için 80ms, toplam süreyi hesapla
        const typingDuration = text.length * 80;
        element.style.setProperty('--typing-duration', `${typingDuration}ms`);

        // Animasyon bitince imleci gizle ve callback'i çağır
        typingInterval = setTimeout(() => {
            element.classList.remove('typing-active');
            element.style.borderRightColor = 'transparent'; // İmleci gizle
            if (callback) callback();
        }, typingDuration + 500); // Yazma süresi + kısa bir bekleme
    }

    // Mesaj döngüsünü başlatan fonksiyon
    function startMessageCycle() {
        if (messages.length === 0) {
            console.warn('Mesaj listesi boş, daktilo animasyonu başlatılamıyor.');
            // Boşsa bile butonu göster ve ana sayfaya geçişi sağla
            skipButton.classList.remove('hidden');
            skipButton.classList.add('visible');
            return;
        }

        const currentMessage = messages[messageIndex];
        welcomeMessageElement.style.opacity = '1';

        typeWriterEffect(currentMessage, welcomeMessageElement, () => {
            messageIndex = (messageIndex + 1) % messages.length; // Sonraki mesaja geç
            clearTimeout(messageCycleTimeout);
            messageCycleTimeout = setTimeout(startMessageCycle, 3000); // 3 saniye sonra diğer mesaja geç
        });

        // Tüm sloganlar oynadıktan sonra veya ilk slogan bittikten sonra "Geç" butonunu göster
        // Burada her slogan başladığında göstermeyi tercih ettim, daha hızlı erişim için.
        skipButton.classList.remove('hidden');
        skipButton.classList.add('visible');
    }

    // Bloga giriş fonksiyonu
    function enterBlog() {
        console.log('Bloga giriş yapılıyor...');
        clearInterval(typingInterval);
        clearTimeout(messageCycleTimeout);

        welcomeScreen.classList.add('hidden'); // Karşılama ekranını gizle
        setTimeout(() => {
            welcomeScreen.style.display = 'none'; // Tamamen DOM'dan kaldır
            mainLayout.classList.remove('hidden'); // Ana içeriği göster
            mainLayout.classList.add('visible');
            latestPostsSection.classList.remove('hidden'); // "Son Yazılar" bölümünü göster
        }, 1000); // Geçiş animasyonu süresi
    }

    // "GEÇ >_" butonu tıklama olayı
    if (skipButton) {
        skipButton.addEventListener('click', enterBlog);
    } else {
        console.error('Skip butonu bulunamadı!');
    }

    // Sayfa yüklendiğinde Decap CMS için özel ayarlar (Decap CMS dışındaki sayfalar için)
    const isIndexPage = (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/');
    if (isIndexPage) {
        loadDynamicContentFromHTML(); // Sloganları HTML'den yükle
        // Blog başlığını Decap CMS'ten veya varsayılan olarak ayarla
        blogTitleElement.textContent = "Mustafa Günay"; // Bu başlık HTML'de sabit kaldı, Decap CMS değiştirecek
        document.getElementById('sidebar-blog-title').textContent = "Mustafa Günay"; // Sidebar başlığını ayarla
        
        // Karşılama ekranını göster ve animasyonları başlat
        setTimeout(() => {
            startMessageCycle();
        }, 1500); // Başlık animasyonu sonrası başlasın
        
    } else {
        // Diğer sayfalar için karşılama ekranını atla ve ana içeriği direkt göster
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
        if (mainLayout) {
            mainLayout.classList.remove('hidden');
            mainLayout.classList.add('visible');
        }
        if (latestPostsSection) { // Diğer sayfalarda "Son Yazılar" gizli kalsın
            latestPostsSection.classList.add('hidden');
        }
        // Diğer sayfalarda sidebar başlığını ayarla
        document.getElementById('sidebar-blog-title').textContent = "Mustafa Günay";
    }

    // Sidebar hover efektleri (CSS tarafından yönetiliyor, JS sadece kontrol için kalabilir)
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('i');
            if (icon) icon.style.color = 'var(--accent-color-primary)';
        });
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('i');
            if (icon) icon.style.color = 'var(--text-color)';
        });
    });
});
