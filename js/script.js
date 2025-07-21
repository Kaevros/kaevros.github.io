
// Mobil menü toggle işlevselliği
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Buton yoksa veya menü yoksa kodu çalıştırma
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            // 'active' class'ını menüye ekle/kaldır
            navMenu.classList.toggle('active');
        });
    }
});
