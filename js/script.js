// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Blog şablonu yüklendi. Decap CMS entegrasyonu ve sidebar hazır.');

    const welcomeScreen = document.getElementById('welcome-screen');
    const blogTitle = document.getElementById('blog-title'); // "Mustafa Günay" başlığı
    const welcomeMessageElement = document.getElementById('welcome-message'); // Sloganlar için element
    const skipButton = document.getElementById('skip-button');
    const mainLayout = document.querySelector('.main-layout');

    // Sloganlar (admin panelinden gelecek) - Şimdilik varsayılanlar
    const defaultMessages = [
        "Hello, friend.", // Mr. Robot'tan esinlenme
        "Her kod bir hikaye anlatır. Bugün ne yazıyoruz?",
        "Dijital evrenin derinliklerinde kaybolmaya hazır mısın?",
        "Bazen her şeyi silip yeniden başlamak gerekir."
    ];
    let messages = []; // Decap CMS'ten yüklenecek mesajlar buraya gelecek
    let messageIndex = 0;
    let typingTimeout;
    let messageDisplayTimeout;

    // Decap CMS'ten dinamik içerik yükleme fonksiyonu (Basit JSON fetch)
    async function loadDynamicContent() {
        try {
            // index.html'den mi, yoksa doğrudan config.yml'den mi okuyacağız?
            // Decap CMS, config.yml'deki 'file' alanına göre doğrudan HTML dosyasını günceller.
            // HTML içindeki script'ler doğrudan güncel HTML'i okur.
            // Ancak, JS ile dinamik olarak config.yml'deki listeye erişmek için
            // Decap CMS'in API'ını veya Jekyll benzeri bir yapıyı kullanmak gerekir.
            // Saf statik HTML/JS için, Decap CMS'in config.yml'deki mesajları
            // doğrudan index.html içine yazmasını beklemek daha basittir.
            // Şimdilik varsayılan mesajları kullanmaya devam edelim veya admin panelinden
            // bu mesajları manuel olarak index.html içine yazdırmanın bir yolunu bulmalıyız.
            // En basit çözüm: JS scripti index.html'in içindeki sloganları doğrudan okuyabilir.
            // Decap CMS ile yönetilebilirlik için config.yml'deki veriyi bir şekilde JS'e aktarmalıyız.
            // Bunu başarmak için, Decap CMS'in index.html dosyasını güncellerken
            // bir <script> etiketi içine JSON verisi yazdırmasını sağlayabiliriz.
            // Bu maalesef saf HTML/CSS/JS projesi için Decap CMS'in varsayılanı değildir
            // ve Jekyll gibi static site generator'ların templating yeteneklerini taklit etmek demektir.

            // Şimdilik, JS'i basitleştirmek adına sloganın varsayılan mesajlardan geldiğini varsayalım.
            // Gerçek Decap CMS entegrasyonunda bu mesajlar config.yml'den index.html'e basılacak.
            messages = defaultMessages; // Varsayılan mesajları kullanıyoruz

            // Blog başlığını da Decap CMS'ten alabiliriz (index.html içinde bir yere yazmasını sağlayarak)
            // const response = await fetch('index.html'); // Bu dinamik olmaz, sadece statik dosya
            // const text = await response.text();
            // const parser = new DOMParser();
            // const doc = parser.parseFromString(text, 'text/html');
            // const fetchedBlogTitle = doc.querySelector('#blog-title').textContent;
            // if (fetchedBlogTitle) {
            //     blogTitle.textContent = fetchedBlogTitle;
            //     document.getElementById('sidebar-blog-title').textContent = fetchedBlogTitle;
            // }

        } catch (error) {
            console.error("Dinamik içerik yüklenirken hata oluştu:", error);
            messages = defaultMessages; // Hata durumunda varsayılanları kullan
        }
    }

    // Daktilo efekti fonksiyonu
    function typeWriterEffect(text, element, callback) {
        let i = 0;
        element.textContent = ''; // Metni temizle
        // CSS'teki daktilo animasyonunu sıfırla
        element.style.animation = 'none';
        element.offsetHeight; // Reflow zorla
        element.style.animation = `typing ${text.length * 0.1}s steps(${text.length}, end) forwards, blink-caret .75s step-end infinite`; // Dinamik hız
        element.style.width = '0%'; // Animasyon için başlangıç genişliği
        
        // Asıl daktilo yazımı (CSS animasyonu ile senkronize değil, sadece HTML içeriğini doldurur)
        // Eğer CSS ile tam kontrol istiyorsak, JS'in metni harf harf eklemesine gerek yok.
        // CSS daktilo animasyonu, metnin tamamen elementte olduğunu varsayar.
        // O yüzden burada sadece elementin textContent'ini ayarlayıp animasyonu tetikleyeceğiz.
        element.textContent = text;
        
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            element.style.borderRight = 'none'; // Animasyon bitince imleci gizle
            if (callback) callback();
        }, text.length * 100); // Metin uzunluğuna göre bitiş süresi
    }

    // Mesaj döngüsünü başlatan fonksiyon
    function startMessageCycle() {
        if (messages.length === 0) {
            messages = defaultMessages; // Eğer boşsa varsayılanları kullan
        }
        
        welcomeMessageElement.style.opacity = '1'; // Mesaj elementini görünür yap
        welcomeMessageElement.classList.remove('typing-finished'); // Her döngüde sınıfı kaldır

        const currentMessage = messages[messageIndex];
        typeWriterEffect(currentMessage, welcomeMessageElement, () => {
            messageIndex = (messageIndex + 1) % messages.length; // Sonraki mesaja geç
            clearTimeout(messageDisplayTimeout);
            messageDisplayTimeout = setTimeout(startMessageCycle, 4000); // 4 saniye sonra diğer mesaja geç
        });
    }

    // Karşılama ekranını göster ve animasyonları başlat
    function showWelcomeScreen() {
        welcomeScreen.classList.remove('hidden');
        mainLayout.classList.add('hidden'); // Ana içeriği gizle
        
        // İlk mesajı başlat
        setTimeout(() => {
            startMessageCycle();
            skipButton.classList.add('visible'); // Geç butonunu göster
        }, 1500); // Başlık animasyonu sonrası başlasın
    }

    // Ana içeriği göster fonksiyonu
    function enterBlog() {
        clearTimeout(typingTimeout); // Daktilo animasyonunu durdur
        clearTimeout(messageDisplayTimeout); // Mesaj döngüsünü durdur

        welcomeScreen.classList.add('hidden'); // Karşılama ekranını gizle
        setTimeout(() => {
            welcomeScreen.style.display = 'none'; // Tamamen kaldır
            mainLayout.classList.remove('hidden'); // Ana içeriği göster
            mainLayout.classList.add('visible');
        }, 1000); // Geçiş animasyonu süresi
    }

    // "GEÇ" butonu tıklama olayı
    if (skipButton) {
        skipButton.addEventListener('click', enterBlog);
    }

    // Sayfa yüklendiğinde Decap CMS için özel ayarlar (Decap CMS dışındaki sayfalar için)
    // Eğer index.html dışındaki sayfalarda karşılama ekranı olmasın isterseniz,
    // bu mantığı HTML içinde doğrudan `main-layout`'a `.visible` sınıfını ekleyerek yapabilirsiniz.
    const isIndexPage = (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/');
    if (isIndexPage) {
        loadDynamicContent().then(showWelcomeScreen); // Dinamik içerik yükle ve sonra hoş geldin ekranını göster
    } else {
        // Diğer sayfalar için karşılama ekranını atla ve ana içeriği direkt göster
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
        if (mainLayout) {
            mainLayout.classList.remove('hidden');
            mainLayout.classList.add('visible');
        }
    }
});
