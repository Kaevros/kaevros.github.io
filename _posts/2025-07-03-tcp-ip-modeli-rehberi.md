---
title: "🌐 TCP/IP Modeli Nedir?"
date: "2025-07-03"
---

İnternet dediğimiz devasa ağın nasıl çalıştığını hiç merak ettiniz mi? Milyarlarca cihazın birbiriyle sorunsuzca konuşmasını sağlayan dil nedir? Cevap, TCP/IP modelinde saklı. Bu model, internetin anayasasıdır ve modern ağ iletişiminin temelini oluşturur.

### TCP/IP'nin Katmanları

OSI modelinin aksine daha pratik ve basit olan TCP/IP modeli genellikle 4 katmandan oluşur:

1.  **Uygulama (Application) Katmanı:** Tarayıcılar (HTTP), e-posta istemcileri (SMTP) gibi son kullanıcı uygulamalarının çalıştığı yerdir. Veri burada ilk olarak oluşturulur.
2.  **Taşıma (Transport) Katmanı:** Verinin güvenilir bir şekilde uçtan uca iletilmesini sağlar. En bilinen protokolleri **TCP** (güvenilir, sıralı) ve **UDP** (hızlı, güvenilirsiz)'dir.
3.  **İnternet Katmanı:** Veri paketlerinin (datagram) farklı ağlar arasında yönlendirilmesini sağlar. Meşhur **IP (Internet Protocol)** adresi bu katmanın yıldızıdır. Paketlerin hedefe giden en iyi yolu bulmasından sorumludur.
4.  **Ağ Arayüzü (Network Interface) Katmanı:** Paketlerin fiziksel olarak ağa (kablolar, Wi-Fi sinyalleri vb.) nasıl aktarılacağını tanımlar. MAC adresleri bu katmanda çalışır.

Kısacası, bir e-posta gönderdiğinizde, mesajınız Uygulama katmanından başlayarak aşağı doğru her katmanda paketlenir, İnternet katmanında adreslenir, Ağ Arayüzü katmanında fiziksel sinyallere dönüştürülür ve hedefe ulaştığında bu işlemlerin tam tersi gerçekleşir.