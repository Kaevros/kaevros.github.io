---
title: "💡 OSI Modeli Nedir?"
date: "2025-07-02"
---

Ağ dünyasına adım atan herkesin karşısına çıkan ilk temel kavramlardan biri OSI (Open Systems Interconnection) modelidir. Bu model, bir ağdaki iki cihaz arasındaki iletişimin nasıl gerçekleştiğini tanımlayan 7 katmanlı kavramsal bir çerçevedir. Her ne kadar günümüzde doğrudan OSI protokolleri kullanılmasa da, ağ sorunlarını gidermek ve ağ mimarisini anlamak için evrensel bir dil görevi görür.

### OSI'nin 7 Katmanı

Aşağıdan yukarıya doğru bu katmanları ve basit görevlerini inceleyelim:

* **1. Fiziksel (Physical) Katman:** Verinin fiziksel olarak (kablolar, sinyaller, voltaj) nasıl iletileceğini tanımlar.
* **2. Veri Bağlantı (Data Link) Katmanı:** Hata tespiti ve düzeltmesi yaparak verinin aynı ağdaki cihazlar arasında güvenilir bir şekilde aktarılmasını sağlar. MAC adresleri burada çalışır.
* **3. Ağ (Network) Katmanı:** Farklı ağlar arasındaki en iyi yolu bularak veri paketlerinin yönlendirilmesini (routing) sağlar. IP adresleri bu katmanın temelidir.
* **4. Taşıma (Transport) Katmanı:** Uçtan uca bağlantıyı kurar ve verinin ne kadar güvenilir iletileceğini belirler. TCP ve UDP protokolleri burada yer alır.
* **5. Oturum (Session) Katmanı:** Cihazlar arasındaki bağlantıların (oturumların) kurulmasını, yönetilmesini ve sonlandırılmasını sağlar.
* **6. Sunum (Presentation) Katmanı:** Verinin uygulamaların anlayacağı formata çevrilmesini (şifreleme, sıkıştırma, karakter kodlaması) sağlar.
* **7. Uygulama (Application) Katmanı:** Son kullanıcının etkileşimde bulunduğu katmandır. Web tarayıcıları (HTTP), e-posta (SMTP) gibi protokoller burada çalışır.