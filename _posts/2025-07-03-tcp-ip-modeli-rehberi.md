<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TCP/IP Modeli Nedir? - Mustafa Günay</title>
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
                        <h1>🌐 TCP/IP Modeli Nedir? Eğlenceli ve Açıklayıcı Rehber</h1>
                        <div class="post-meta">
                            <span><i class="fas fa-user"></i> Mustafa Günay</span>
                            <span><i class="fas fa-calendar-alt"></i> 3 Temmuz 2025</span>
                            <span><i class="fas fa-clock"></i> 2 dakikalık okuma</span>
                        </div>
                    </header>
                    <div class="post-content">
                        <p>Bu yazıda hem bu modeli anlayacaksın, hem de gerçek hayat örnekleriyle öğrenmenin ne kadar kolay olabileceğini göreceksin.</p>
                        
                        <h2>🚀 OSI’nin Kardeşi TCP/IP</h2>
                        <p>TCP/IP Modeli, aslında internette kullandığımız <strong>gerçek protokol modelidir</strong>. OSI gibi 7 değil, <strong>4 katmandan oluşur</strong> (bazı kaynaklara göre 5).</p>
                        
                        <blockquote class="mnemonic">
                            <p><strong>📌 Türkçe Ezber Kodu:</strong></p>
                            <p>“Ayşe Tatilde İnternette Nefeslendi”<br>(Application → Transport → Internet → Network Access)</p>
                        </blockquote>
                        <blockquote class="mnemonic">
                            <p><strong>📌 İngilizce Ezber Kodu:</strong></p>
                            <p>“A Touchy Internet Needs Data”<br>(Application → Transport → Internet → Network Access)</p>
                        </blockquote>

                        <h2>🧱 Katman Katman TCP/IP Modeli</h2>

                        <h3>🔹 1. Application Layer — Uygulamanın Konuştuğu Yer</h3>
                        <p>HTTP, FTP, DNS gibi kullanıcıya en yakın protokoller burada çalışır.</p>
                        <ul>
                            <li><strong>İşlev:</strong> Kullanıcıyla sistem arasındaki en üst iletişim.</li>
                            <li><strong>Gerçek Hayat:</strong> YouTube’a girip video izlemek.</li>
                            <li><strong>🧠 OSI’deki Karşılığı:</strong> Application + Presentation + Session katmanlarının birleşimi.</li>
                        </ul>

                        <h3>🔹 2. Transport Layer — Verinin Sağlıklı Taşınması</h3>
                        <p>TCP ile güvenli, UDP ile hızlı taşıma yapılır.</p>
                        <ul>
                            <li><strong>Protokoller:</strong> TCP, UDP</li>
                            <li><strong>Görev:</strong> Veriyi segmentlere ayırmak, bağlantı kurmak.</li>
                            <li><strong>Gerçek Hayat:</strong> WhatsApp mesajları (TCP), canlı yayınlar (UDP).</li>
                            <li><strong>🧠 OSI’deki Karşılığı:</strong> Transport katmanıyla birebir örtüşür.</li>
                        </ul>

                        <h3>🔹 3. Internet Layer — Yön Bulucu Katman</h3>
                        <p>IP adresi, yönlendirme, hedef bulma bu katmanda gerçekleşir.</p>
                        <ul>
                            <li><strong>Protokoller:</strong> IP, ICMP, ARP</li>
                            <li><strong>Görev:</strong> Paketlere adres vermek ve yönlendirmek.</li>
                            <li><strong>Gerçek Hayat:</strong> “Bu veri nereye gidiyor?” sorusuna yanıt.</li>
                            <li><strong>🧠 OSI’deki Karşılığı:</strong> Network katmanına denk gelir.</li>
                        </ul>

                        <h3>🔹 4. Network Access Layer — Fiziksel Temas Noktası</h3>
                        <p>Ethernet, Wi-Fi, MAC adresi, sinyaller… fiziksel aktarım burada olur.</p>
                        <ul>
                            <li><strong>Protokoller:</strong> Ethernet, PPP</li>
                            <li><strong>Cihazlar:</strong> Switch, modem, kablo</li>
                            <li><strong>Görev:</strong> Paketin fiziksel olarak iletilmesi.</li>
                            <li><strong>🧠 OSI’deki Karşılığı:</strong> Data Link + Physical katmanları birleşmiştir.</li>
                        </ul>
                        
                        <h2>📊 OSI vs. TCP/IP – Karşılaştırmalı Tablo</h2>
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>OSI Modeli</th>
                                    <th>TCP/IP Modeli</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Application</td><td rowspan="3">Application</td></tr>
                                <tr><td>Presentation</td></tr>
                                <tr><td>Session</td></tr>
                                <tr><td>Transport</td><td>Transport</td></tr>
                                <tr><td>Network</td><td>Internet</td></tr>
                                <tr><td>Data Link</td><td rowspan="2">Network Access</td></tr>
                                <tr><td>Physical</td></tr>
                            </tbody>
                        </table>
                        
                        <h2>🏠 Bir Kargo Teslimatı Gibi</h2>
                        <ul>
                            <li><strong>Application</strong> → Kargoyu hazırlayan müşteri</li>
                            <li><strong>Transport</strong> → Kargonun güvenli paketlenmesi</li>
                            <li><strong>Internet</strong> → Kargonun yönlendirildiği dağıtım ağı</li>
                            <li><strong>Network Access</strong> → Motor kurye ile adrese teslim</li>
                        </ul>
                        
                        <h2>📌 TCP/IP Neden Bu Kadar Önemli?</h2>
                        <ul>
                            <li>✅ Gerçek dünyada kullanılan modeldir.</li>
                            <li>✅ İnternet iletişimi bu yapıyla işler.</li>
                            <li>✅ Yazılım, güvenlik, ağ yönetimi için temel bilgidir.</li>
                            <li>✅ OSI ile birlikte öğrenildiğinde mükemmel uyum sağlar.</li>
                        </ul>
                        <p>Artık TCP/IP modeli senin için karışık bir şey değil. Katmanları anladın, işlevlerini kavradın, OSI ile farkını öğrendin.</p>
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