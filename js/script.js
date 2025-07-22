// js/script.js

// Bütün olay burada başlıyor. Sayfa hazır olunca...
document.addEventListener('DOMContentLoaded', () => {
    // console.log("Sayfa hazır, makine ısınıyor...");

    // Giriş animasyonu sadece anasayfada çalışsın diye body'e bir class eklemiştik.
    if (document.body.classList.contains('home')) {
        setupWelcomeScreen();
    } else {
        // anasayfa dışındaki sayfalarda direkt içeriği göster, gizleme
        document.querySelector('.main-layout').style.opacity = 1;
    }

    // Sidebar her sayfada lazım, o yüzden onu hep kuruyoruz.
    setupSidebar();
    
    // Kod bloklarını yakalayıp güzelleştiren sihirbaz.
    enhanceCodeBlocks();

    // Hangi sayfadaysak o linki sidebar'da işaretleyelim ki kullanıcı kaybolmasın.
    setActiveSidebarLink();

    // Scroll animasyonlarını başlatalım.
    AOS.init({
        duration: 800, // animasyon ne kadar sürsün
        once: true, // animasyonlar sadece bir kere tetiklensin
        offset: 50, // eleman ekrana ne kadar girince animasyon başlasın
    });
});


/**
 * O havalı karşılama ekranını ve daktilo efektini ayarlar.
 */
function setupWelcomeScreen() {
    // ... (Bu fonksiyonun içeriği öncekiyle aynı, değişiklik yok)
    const welcomeMessage = document.getElementById('welcome-message');
    const skipButton = document.getElementById('skip-button');
    const messages = ["Siber güvenlik sadece bir başlangıçtır.","Sistemler insanlar tarafından yapılır ve insanlar kusurludur.","Kontrol bir yanılsamadır.","Sıfırlar ve birler... Dünyayı yöneten ikili.","Gerçek tehlike, görmezden geldiğimiz güvenlik açığıdır."];
    let messageIndex = 0;
    let typingInterval, messageCycleTimeout;
    function typeWriterEffect(element, text, onComplete) { if (!element) return; element.textContent = ''; element.style.borderRightColor = 'var(--accent-color-primary)'; if (typingInterval) clearInterval(typingInterval); let i = 0; typingInterval = setInterval(() => { if (i < text.length) { element.textContent += text.charAt(i); i++; } else { clearInterval(typingInterval); if (onComplete) onComplete(); } }, 85); }
    function startMessageCycle() { if (!welcomeMessage || messages.length === 0) return; welcomeMessage.style.opacity = '1'; typeWriterEffect(welcomeMessage, messages[messageIndex], () => { messageIndex = (messageIndex + 1) % messages.length; messageCycleTimeout = setTimeout(startMessageCycle, 4000); }); if (skipButton) skipButton.classList.add('visible'); }
    function enterBlog() { if (typingInterval) clearInterval(typingInterval); clearTimeout(messageCycleTimeout); const welcomeScreen = document.getElementById('welcome-screen'); if (welcomeScreen) { welcomeScreen.classList.add('hidden'); setTimeout(() => { welcomeScreen.style.display = 'none'; }, 1000); } document.querySelector('.main-layout').classList.remove('hidden'); }
    if (skipButton) { skipButton.addEventListener('click', enterBlog); }
    setTimeout(startMessageCycle, 1500);
}


/**
 * Kenardaki menünün (sidebar) açılıp kapanma olaylarını halleder.
 */
function setupSidebar() {
    // ... (Bu fonksiyonun içeriği öncekiyle aynı, değişiklik yok)
    const sidebar = document.getElementById('sidebar'); const mobileMenuToggle = document.getElementById('mobile-menu-toggle'); const closeSidebarBtn = document.getElementById('close-sidebar-btn'); if (!sidebar || !mobileMenuToggle || !closeSidebarBtn) return; mobileMenuToggle.addEventListener('click', (e) => { e.stopPropagation(); sidebar.classList.toggle('open'); }); closeSidebarBtn.addEventListener('click', () => { sidebar.classList.remove('open'); }); document.addEventListener('click', (event) => { if (window.innerWidth <= 768 && sidebar.classList.contains('open')) { if (!sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) { sidebar.classList.remove('open'); } } });
}


/**
 * Kod bloklarını güzelleştirir.
 */
function enhanceCodeBlocks() {
    // ... (Bu fonksiyonun içeriği öncekiyle aynı, değişiklik yok)
    if (typeof hljs === 'undefined') { return; } hljs.highlightAll(); const codeBlocks = document.querySelectorAll('pre'); codeBlocks.forEach(block => { const codeElement = block.querySelector('code'); if (!codeElement) return; const copyButton = document.createElement('button'); copyButton.className = 'copy-code-button'; copyButton.textContent = 'Kopyala'; block.appendChild(copyButton); copyButton.addEventListener('click', () => { const codeToCopy = codeElement.innerText; navigator.clipboard.writeText(codeToCopy).then(() => { copyButton.textContent = 'Kopyalandı!'; copyButton.style.backgroundColor = 'var(--accent-color-primary)'; setTimeout(() => { copyButton.textContent = 'Kopyala'; copyButton.style.backgroundColor = ''; }, 2000); }).catch(err => { copyButton.textContent = 'Hata!'; }); }); });
}


/**
 * Aktif sidebar linkini işaretler.
 */
function setActiveSidebarLink() {
    // ... (Bu fonksiyonun içeriği öncekiyle aynı, değişiklik yok)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html'; const navLinks = document.querySelectorAll('.sidebar-nav a'); navLinks.forEach(link => { const linkPath = link.getAttribute('href').split('/').pop() || 'index.html'; if (linkPath === currentPath) { link.classList.add('active'); } });
}