<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OSI Modeli Nedir? - Mustafa Günay</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <div class="main-layout">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header"><h2 id="sidebar-blog-title">Mustafa Günay</h2><button class="close-sidebar-btn" id="close-sidebar-btn" aria-label="Menüyü kapat"><i class="fas fa-times"></i></button></div>
            <nav class="sidebar-nav">
                <ul>
                    <li class="nav-item"><a href="../index.html"><span class="icon"><i class="fas fa-home-alt"></i></span><span class="nav-text">Ana Sayfa</span></a></li>
                    <li class="nav-item"><a href="../about.html"><span class="icon"><i class="fas fa-user-secret"></i></span><span class="nav-text">Hakkında</span></a></li>
                    <li class="nav-item"><a href="../posts.html"><span class="icon"><i class="fas fa-file-alt"></i></span><span class="nav-text">Yazılar</span></a></li>
                    <li class="nav-item"><a href="../hizmetler.html"><span class="icon"><i class="fas fa-briefcase"></i></span><span class="nav-text">Hizmetler</span></a></li>
                    <li class="nav-item"><a href="../contact.html"><span class="icon"><i class="fas fa-paper-plane"></i></span><span class="nav-text">İletişim</span></a></li>
                </ul>
            </nav>
            <div class="sidebar-footer"><p>&copy; 2025 Mustafa Günay</p></div>
        </aside>
        <div class="mobile-menu-toggle" id="mobile-menu-toggle"><i class="fas fa-bars"></i></div>

        <div class="content-wrapper">
            <main id="main-content">
                <article class="post-detail" data-aos="fade-up">
                    <header class="post-header">
                        <h1>💡 OSI Modeli Nedir? Açıklayıcı ve Eğlenceli Rehber</h1>
                        <div class="post-meta">
                            <span><i class="fas fa-user"></i> Mustafa Günay</span>
                            <span><i class="fas fa-calendar-alt"></i> 2 Temmuz 2025</span>
                            <span><i class="fas fa-clock"></i> 3 dakikalık okuma</span>
                        </div>
                    </header>
                    <div class="post-content">
                        <h2>🚀 OSI Modeline Giriş — Basit Kodlamayla Ezber</h2>
                        <p>OSI Modeli, ağ iletişimini 7 katmana bölen bir sistemdir. Her katman farklı bir iş yapar ama hepsi birlikte ağ iletişimini sağlar.</p>

                        <blockquote class="mnemonic">
                            <p><strong>📌 Türkçe Ezber Kodu (Yukarıdan Aşağı):</strong></p>
                            <p>“A Papatya Sevgiliye Taşınırken Ne Dediyse O!”<br>(Application → Presentation → Session → Transport → Network → Data Link → Physical)</p>
                        </blockquote>
                        <blockquote class="mnemonic">
                            <p><strong>📌 Türkçe Ezber Kodu (Aşağıdan Yukarı):</strong></p>
                            <p>“Fazla Dertli Nazlı Teyze Sabaha Pişi Açtı”<br>(Physical → Data Link → Network → Transport → Session → Presentation → Application)</p>
                        </blockquote>

                        <h2>🧱 Katmanlar</h2>
                        
                        <h3>🔹 7. Application Layer — Kullanıcıyla İlk Temas</h3>
                        <p>💬 Web tarayıcıları, e-posta uygulamaları, anlık mesajlaşma platformları bu katmanda çalışır.</p>
                        <ul>
                            <li><strong>Protokoller:</strong> HTTP, FTP, SMTP</li>
                            <li><strong>Görev:</strong> Kullanıcının yaptığı işlemi veriye dönüştürmek.</li>
                            <li><strong>Gerçek Hayat:</strong> WhatsApp’ta “Naber?” yazmak bu katmanda başlar.</li>
                        </ul>

                        <h3>🔹 6. Presentation Layer — Veriye Makyaj Yapan Katman</h3>
                        <p>🔐 Şifreleme, 🔄 sıkıştırma ve 🎨 veri formatlama burada gerçekleşir.</p>
                        <ul>
                            <li><strong>Standartlar:</strong> SSL, TLS, JPEG, MPEG</li>
                            <li><strong>Görev:</strong> Veriyi ortak bir anlaşılabilir dile çevirir.</li>
                            <li><strong>Gerçek Hayat:</strong> Fotoğrafı sıkıştırarak gönderdiğinde ya da veriyi şifrelediğinde bu katman çalışır.</li>
                        </ul>

                        <h3>🔹 5. Session Layer — Oturumu Açan Katman</h3>
                        <p>🕰️ İletişimin ne zaman başlayıp biteceğini belirler. Kim konuşuyor, kim susuyor, onu düzenler.</p>
                        <ul>
                            <li><strong>Protokoller:</strong> NetBIOS, RPC</li>
                            <li><strong>Görev:</strong> Oturumları başlatır, sürdürür, kapatır.</li>
                            <li><strong>Gerçek Hayat:</strong> Zoom’da “Bağlantı Kuruluyor” dediği an bu katman devrede.</li>
                        </ul>

                        <h3>🔹 4. Transport Layer — Paket Ustası</h3>
                        <p>📦 Verileri bölüp karşı tarafa güvenli ya da hızlı şekilde ulaştırır.</p>
                        <ul>
                            <li><strong>Protokoller:</strong> TCP (güvenilir) ve UDP (hızlı)</li>
                            <li><strong>Kavramlar:</strong> Portlar, segmentasyon, hata kontrolü</li>
                            <li><strong>Gerçek Hayat:</strong> YouTube video akışı (UDP), WhatsApp mesajı (TCP).</li>
                        </ul>

                        <h3>🔹 3. Network Layer — Harita Çizen Katman</h3>
                        <p>🗺️ IP adresleriyle veri paketine “gideceği adresi” yazan katman.</p>
                        <ul>
                            <li><strong>Protokoller:</strong> IP, ICMP, IGMP</li>
                            <li><strong>Cihazlar:</strong> Router’lar</li>
                            <li><strong>Gerçek Hayat:</strong> Google Maps gibi verinin gideceği yönü çizer.</li>
                        </ul>

                        <h3>🔹 2. Data Link Layer — Komşuyla Konuşan Katman</h3>
                        <p>📡 Aynı ağdaki cihazlar arasındaki veri aktarımını sağlar. MAC adresleri ile çalışır.</p>
                        <ul>
                            <li><strong>Protokoller:</strong> Ethernet, PPP</li>
                            <li><strong>Cihazlar:</strong> Switch’ler</li>
                            <li><strong>Görev:</strong> Frame (çerçeve) oluşturmak.</li>
                            <li><strong>Gerçek Hayat:</strong> Aynı apartmandaki iki dairenin zil sistemi gibi.</li>
                        </ul>

                        <h3>🔹 1. Physical Layer — Sinyallerin Dünyası</h3>
                        <p>⚡ Gerçek fiziksel bağlantıların olduğu katman: voltajlar, ışık sinyalleri, fiber kablolar…</p>
                        <ul>
                            <li><strong>Cihazlar:</strong> Kablolar, hub’lar, modemler</li>
                            <li><strong>Veri Türü:</strong> Bit (1’ler ve 0’lar)</li>
                            <li><strong>Gerçek Hayat:</strong> Elektrik sinyaliyle çalışan bir radyo gibi düşün.</li>
                        </ul>

                    </div>
                </article>
            </main>
        </div>
    </div>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="../js/script.js"></script>
</body>
</html>