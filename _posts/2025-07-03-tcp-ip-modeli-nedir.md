---
title: "🌐 TCP/IP Modeli Nedir? Eğlenceli ve Açıklayıcı Rehber"
date: "2025-07-24"
description: "İnternetin gerçek dünyadaki çalışma modeli olan TCP/IP'nin 4 katmanını, OSI ile farklarını ve gerçek hayat benzetmelerini bu rehberde keşfedin."
tags:
  - TCP/IP
  - Network
  - OSI
  - Protokoller
  - Ağ Modelleri
image: /assets/images/posts/network-layers.png
---

TCP/IP modeli, teorik OSI modelinin aksine, günümüz internetinin temelini oluşturan pratik ve yaşayan bir modeldir. Bu yazıda hem bu modeli anlayacaksın, hem de gerçek hayat örnekleriyle öğrenmenin ne kadar kolay olabileceğini göreceksin.

![TCP/IP ve OSI Modeli Karşılaştırması](/assets/images/posts/network-layers.png)
*TCP/IP ve OSI Modeli katmanlarının pratik karşılaştırması.*

---


## 🚀 OSI’nin Kardeşi TCP/IP
TCP/IP Modeli, aslında internette kullandığımız **gerçek protokol modelidir**. OSI gibi 7 değil, **4 katmandan oluşur** (bazı kaynaklarda bu 5 katman olarak da geçer).


### 📌 Ezber Kodları

> **Türkçe Ezber Kodu:**
>
> **"A**yşe **T**atilde **İ**nternette **N**efeslendi"
> (Application → Transport → Internet → Network Access)

> **İngilizce Ezber Kodu:**
>
> **"A**rmies **T**ake **I**nteresting **N**aps"
> (Application → Transport → Internet → Network Access)

---


### 🧱 Katman Katman TCP/IP Modeli


#### 🔹 1. Application Layer (Uygulama Katmanı) — Uygulamanın Konuştuğu Yer
Kullanıcının doğrudan etkileşimde bulunduğu katmandır. Web tarayıcıları, e-posta istemcileri gibi uygulamaların kullandığı protokolleri barındırır.
- **Protokoller:** HTTP, FTP, DNS, SMTP
- **İşlev:** Kullanıcıya ağ hizmetleri sunmak ve veri sunumu.
- **🧠 OSI'deki Karşılığı:** Application, Presentation ve Session katmanlarının birleşimidir.
- **Gerçek Hayat:** YouTube'a girip bir video izlemeye başlaman bu katmanda gerçekleşir.


#### 🔹 2. Transport Layer (Taşıma Katmanı) — Verinin Sağlıklı Taşınması
Uçtan uca bağlantıyı kurar ve verinin nasıl iletileceğini belirler: güvenli mi, yoksa hızlı mı?
- **Protokoller:** TCP (güvenilir, bağlantı odaklı), UDP (hızlı, bağlantısız)
- **Görev:** Veriyi segmentlere ayırmak, port numaraları ile doğru uygulamaya iletmek ve hata kontrolü yapmak.
- **🧠 OSI'deki Karşılığı:** Transport katmanıyla birebir aynıdır.
- **Gerçek Hayat:** WhatsApp mesajları (her harfin gitmesi gereken TCP), online oyunlar ve canlı yayınlar (hızın önemli olduğu UDP).


#### 🔹 3. Internet Layer (İnternet Katmanı) — Yön Bulucu Katman
Veri paketlerine IP adreslerini ekler ve bu paketleri ağlar arasında hedefe ulaştıracak en iyi yolu (routing) bulur.
- **Protokoller:** IP (IPv4, IPv6), ICMP, ARP
- **Görev:** Paketleme (packet), adresleme (addressing) ve yönlendirme (routing).
- **🧠 OSI'deki Karşılığı:** Network katmanına denk gelir.
- **Gerçek Hayat:** Gönderdiğiniz bir kargonun üzerine varış adresi etiketini yapıştırmak ve dağıtım ağında doğru kamyona yüklenmesi.


#### 🔹 4. Network Access Layer (Ağ Erişim Katmanı) — Fiziksel Temas Noktası
Paketlerin fiziksel olarak ağa (kablo, Wi-Fi) nasıl aktarılacağını tanımlar. MAC adresleri, kablolar, sinyaller bu katmanın konusudur.
- **Protokoller:** Ethernet, Wi-Fi, PPP
- **Cihazlar:** Switch, modem, kablolar, ağ kartı (NIC)
- **Görev:** Bitlerin fiziksel olarak iletilmesi ve frame'lerin (çerçevelerin) oluşturulması.
- **🧠 OSI'deki Karşılığı:** Data Link ve Physical katmanlarının birleşimidir.
- **Gerçek Hayat:** Kargo kuryesinin motoruyla paketi fiziksel olarak kapınıza kadar getirmesi.

---


### 📊 OSI vs. TCP/IP – Karşılaştırmalı Tablo


| **OSI Modeli Katmanı** | **TCP/IP Modeli Karşılığı** |
|:---------------------|:----------------------------|
| 7. Application       | Application                 |
| 6. Presentation      | Application                 |
| 5. Session           | Application                 |
| 4. Transport         | Transport                   |
| 3. Network           | Internet                    |
| 2. Data Link         | Network Access              |
| 1. Physical          | Network Access              |

---


### 🏠 Bir Kargo Teslimatı Gibi Özet
- **Application** → Kargoyu hazırlayıp ne göndereceğine karar veren müşteri.
- **Transport** → Kargonun sağlam ve güvenli bir şekilde paketlenmesi.
- **Internet** → Kargonun hangi şehirler ve yollar üzerinden gideceğini belirleyen lojistik ağı.
- **Network Access** → Motor kuryenin paketi alıp fiziksel olarak adrese teslim etmesi.


### 📌 TCP/IP Neden Bu Kadar Önemli?
✅ **Gerçek dünyada kullanılan modeldir:** İnternet bu yapı üzerine kuruludur.
✅ **Pratik ve esnektir:** OSI'ye göre daha az katı kuralları vardır.
✅ **Temel bilgidir:** Yazılım, güvenlik ve ağ yönetimi alanlarının temelini oluşturur.
✅ **OSI ile birlikte öğrenildiğinde** ağ dünyasının hem teorisini hem de pratiğini anlamanızı sağlar.

Artık TCP/IP modeli senin için karışık bir kavram değil. Katmanları, işlevlerini ve OSI ile farkını tamamen kavradın.