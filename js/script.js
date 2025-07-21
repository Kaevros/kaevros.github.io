// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Blog şablonu yüklendi. Decap CMS entegrasyonu ve sidebar hazır.');

    const welcomeScreen = document.getElementById('welcome-screen');
    const blogTitle = document.getElementById('blog-title');
    const welcomeMessage = document.getElementById('welcome-message');
    const enterButton = document.getElementById('enter-button');
    const mainLayout = document.querySelector('.main-layout');

    // Karşılama mesajı ve animasyon ayarları
    const messages = [
        "Sıfırlar ve Birler Arasında Bir Yolculuk...",
        "Kod, Sanat ve Teknolojiye Dair Derinlemesine Bakışlar...",
        "Dijital Dünyanın Kapıları Aralanıyor...",
        "Merhaba Dünya! Hoş Geldiniz..."
    ];
    let messageIndex = 0;

    function typeWriterEffect(text, element, callback) {
        let i = 0;
        element.textContent = ''; // Metni temizle
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50); // Yazma hızı
            } else {
                if (callback) callback();
            }
        }
        type();
    }

    function showNextMessage() {
        if (messageIndex < messages.length) {
            welcomeMessage.classList.remove('visible'); // Önceki mesajı gizle
            setTimeout(() => {
                typeWriterEffect(messages[messageIndex], welcomeMessage, () => {
                    welcomeMessage.classList.add('visible'); // Yeni mesajı göster
                    messageIndex++;
                    setTimeout(showNextMessage, 3000); // 3 saniye sonra diğer mesaj
                });
            }, 500); // Gizlenme animasyonu süresi kadar bekle
        } else {
            // Tüm mesajlar bittiğinde butonu göster
            enterButton.classList.add('visible');
        }
    }

    // Karşılama ekranını başlat
    setTimeout(showNextMessage, 1000); // Başlık animasyonundan sonra başlasın

    // Bloga giriş butonu tıklama olayı
    if (enterButton) {
        enterButton.addEventListener('click', () => {
            welcomeScreen.classList.add('hidden'); // Karşılama ekranını gizle
            setTimeout(() => {
                welcomeScreen.style.display = 'none'; // Tamamen kaldır
                mainLayout.classList.add('visible'); // Ana içeriği göster
            }, 1000); // Geçiş animasyonu süresi
        });
    }

    // Navigasyon öğelerine hover efekti ekleyelim (CSS ile de yapılabilir, JS ile daha dinamik kontrol için örnek)
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('i');
            const text = item.querySelector('.nav-text');
            if (icon) icon.style.color = 'var(--accent-color-primary)';
            if (text) text.style.color = 'var(--accent-color-primary)';
        });
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('i');
            const text = item.querySelector('.nav-text');
            if (icon) icon.style.color = 'var(--text-color)'; // Varsayılan renge dön
            if (text) text.style.color = 'var(--text-color)'; // Varsayılan renge dön
        });
    });

    // Sayfa yüklendiğinde Decap CMS için özel ayarlar (Decap CMS dışındaki sayfalar için)
    // Bu kısım doğrudan Decap CMS ile alakalı değil, genel sayfa davranışını belirler.
    // Eğer index.html dışındaki sayfalarda karşılama ekranı olmasın isterseniz,
    // bu mantığı HTML içinde doğrudan `main-layout.visible` sınıfını ekleyerek yapabilirsiniz.
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/') {
        // index.html için karşılama ekranını göster
    } else {
        // Diğer sayfalar için karşılama ekranını atla
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
        if (mainLayout) {
            mainLayout.classList.add('visible');
        }
    }
});
