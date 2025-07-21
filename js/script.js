// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Blog şablonu yüklendi. Decap CMS entegrasyonu ve sidebar hazır.');

    const welcomeScreen = document.getElementById('welcome-screen');
    const blogTitleElement = document.getElementById('blog-title');
    const welcomeMessageElement = document.getElementById('welcome-message');
    const skipButton = document.getElementById('skip-button');
    const mainLayout = document.querySelector('.main-layout');
    const latestPostsSection = document.getElementById('latest-posts-section'); // "Son Yazılar" bölümü

    let messages = [];
    let messageIndex = 0;
    let typingTimeout;
    let messageDisplayTimeout;

    // Dinamik içerikleri Decap CMS'ten yükle (config.yml'den)
    // Decap CMS, index.html dosyasını güncellerken bu verileri bir JS değişkeni olarak eklemelidir.
    // Şimdilik varsayılan mesajları kullanacağız.
    // *** Gerçek entegrasyon için, Decap CMS'in bu verileri HTML içine nasıl yazacağını yapılandırmanız gerekir. ***
    // Örneğin, config.yml'de 'index.html' için özel bir 'template' veya 'editor_components' kullanabilirsiniz.
    // Ancak düz HTML/CSS/JS için en basit yol, Decap CMS'in admin panelinde
    // bu mesajları elle girip, çıkan HTML'deki `<p id="welcome-message">` içine yazdırmasını beklemektir.
    // Daha dinamik bir yaklaşım için, config.yml'deki 'welcome_messages' listesini
    // index.html'e JSON olarak gömmek ve JS ile okumak gerekebilir.
    // Şu anki Decap CMS HTML dosyası güncelleme yapısı, doğrudan HTML içine string veya markdown yazar.
    // Bu yüzden şimdilik JS tarafında statik varsayılanları kullanacağız veya config.yml'den manuel olarak
    // HTML'e eklediğiniz bir JSON stringini parse etmeniz gerekecek.

    const defaultMessages = [
        "Sıfırlar ve Birler Arasında Bir Yolculuk...",
        "Her kod bir hikaye anlatır. Bugün ne yazıyoruz?",
        "Dijital evrenin derinliklerinde kaybolmaya hazır mısın?",
        "Bazen her şeyi silip yeniden başlamak gerekir."
    ];
    messages = defaultMessages; // Varsayılan mesajları kullan

    // Daktilo efekti fonksiyonu
    function typeWriterEffect(text, element, callback) {
        element.textContent = ''; // Önceki metni temizle
        element.style.width = '0%'; // Animasyon için başlangıç genişliği
        element.classList.add('typing-active'); // Animasyonu tetikleyen sınıfı ekle

        clearTimeout(typingTimeout); // Önceki zamanlayıcıları temizle
        
        // CSS animasyonu metnin tamamı yüklendiğinde çalışır.
        // Elementin textContent'ine metnin tamamını ekliyoruz.
        element.textContent = text;

        // Daktilo animasyonu için metin uzunluğuna göre süre hesapla
        const typingDuration = text.length * 80; // Her harf için 80ms
        element.style.setProperty('--typing-steps', text.length); // CSS animasyonu için custom property
        element.style.setProperty('--typing-duration', `${typingDuration}ms`); // CSS animasyonu için custom property

        typingTimeout = setTimeout(() => {
            element.classList.remove('typing-active'); // Animasyon bitince sınıfı kaldır
            element.style.borderRight = 'none'; // İmleci gizle
            clearTimeout(messageDisplayTimeout); // Önceki mesaj döngüsü zamanlayıcısını temizle
            messageDisplayTimeout = setTimeout(callback, 2000); // 2 saniye sonra callback'i çağır (bir sonraki mesaja geçmek için)
        }, typingDuration + 500); // Yazma süresi + kısa bir bekleme
    }

    // Mesaj döngüsünü başlatan fonksiyon
    function startMessageCycle() {
        if (messages.length === 0) {
            messages = defaultMessages;
        }

        const currentMessage = messages[messageIndex].message || messages[messageIndex]; // Decap CMS yapısına uyumlu
        welcomeMessageElement.style.opacity = '1'; // Mesaj elementini görünür yap

        typeWriterEffect(currentMessage, welcomeMessageElement, () => {
            messageIndex = (messageIndex + 1) % messages.length; // Sonraki mesaja geç
            startMessageCycle(); // Döngüyü tekrar başlat
        });
    }

    // Bloga giriş fonksiyonu
    function enterBlog() {
        clearTimeout(typingTimeout);
        clearTimeout(messageDisplayTimeout);

        welcomeScreen.classList.add('hidden'); // Karşılama ekranını gizle
        setTimeout(() => {
            welcomeScreen.style.display = 'none'; // Tamamen DOM'dan kaldır
            mainLayout.classList.remove('hidden'); // Ana içeriği göster
            mainLayout.classList.add('visible');
            latestPostsSection.classList.remove('hidden'); // Son yazılar bölümünü göster
        }, 1000); // Geçiş animasyonu süresi
    }

    // "GEÇ >_" butonu tıklama olayı
    if (skipButton) {
        skipButton.addEventListener('click', enterBlog);
    }

    // Sayfa yüklendiğinde karşılama ekranını başlat
    const isIndexPage = (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/');
    if (isIndexPage) {
        // Blog başlığını Decap CMS'ten veya varsayılan olarak ayarla
        // Bu kısım, Decap CMS'in index.html'e doğrudan veri yazmasını gerektirir.
        // Eğer config.yml'deki 'blog_title' değeri HTML'e basılmıyorsa,
        // manuel olarak buraya yazabilirsiniz ya da JS ile bir fetch işlemi yapmalısınız.
        // Şimdilik varsayılan olarak "Mustafa Günay" kalacak.
        blogTitleElement.textContent = "Mustafa Günay"; // Başlığı ayarla
        document.getElementById('sidebar-blog-title').textContent = "Mustafa Günay"; // Sidebar başlığını ayarla

        // Karşılama mesajlarını Decap CMS'ten veya varsayılan olarak ayarla
        // Örneğin, index.html'in içinde gizli bir JSON script etiketi oluşturabilirsiniz:
        // <script type="application/json" id="welcome-data">{"messages": [{"message": "Slogan 1"}, {"message": "Slogan 2"}]}</script>
        // Sonra burada:
        // const welcomeDataScript = document.getElementById('welcome-data');
        // if (welcomeDataScript) {
        //     const data = JSON.parse(welcomeDataScript.textContent);
        //     messages = data.messages || defaultMessages;
        // }
        
        showWelcomeScreen();
    } else {
        // Diğer sayfalar için karşılama ekranını atla ve ana içeriği direkt göster
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
        if (mainLayout) {
            mainLayout.classList.remove('hidden');
            mainLayout.classList.add('visible');
            latestPostsSection.classList.add('hidden'); // Diğer sayfalarda "Son Yazılar" gizli kalsın
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
