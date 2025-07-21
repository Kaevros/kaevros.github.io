# Sade ve Teknik GitHub Pages Blog Şablonu

Bu proje, herhangi bir statik site oluşturucu (Jekyll, Hugo vb.) kullanmadan, saf HTML, CSS ve minimal JavaScript ile oluşturulmuş, teknik içerik paylaşımına uygun bir blog şablonudur.

## ✨ Özellikler

- **Sıfır Bağımlılık:** Sadece HTML, CSS ve JS. Karmaşık kurulumlar yok.
- **Karanlık Tema:** Göz yormayan, kod odaklı bir karanlık tema.
- **Duyarlı Tasarım (Responsive):** Mobil cihazlarda ve masaüstünde harika görünür.
- **Kolay Özelleştirme:** Renkler ve fontlar `css/style.css` dosyasındaki değişkenler üzerinden kolayca değiştirilebilir.
- **GitHub Pages Uyumlu:** Depoyu GitHub'a yükleyip Pages'i aktif ettiğiniz an siteniz yayında.
- **Teknik Odaklı:** Kod blokları ve inline kodlar için özel stil desteği.

## 🚀 Başlarken

1.  **Depoyu Alın:** Bu depoyu "Fork" yapın veya dosyaları indirip kendi GitHub deponuza yükleyin.
2.  **GitHub Pages'i Etkinleştirin:**
    - Deponuzun **Settings** > **Pages** sekmesine gidin.
    - "Build and deployment" altında, **Source** olarak **Deploy from a branch** seçin.
    - **Branch** olarak `main` (veya `master`) ve klasör olarak `/(root)` seçip **Save** deyin.
3.  Birkaç dakika içinde siteniz `https://kullaniciadiniz.github.io/depo-adiniz/` adresinde yayında olacaktır.

## ✍️ Nasıl Yeni Yazı Eklenir?

Bu şablon bir veritabanı veya derleyici kullanmadığı için yazılar manuel olarak eklenir:

1.  **Yeni HTML Dosyası Oluşturun:** `posts/` klasörü içinde yeni bir `.html` dosyası oluşturun (örneğin: `ikinci-yazim.html`).
2.  **Şablonu Kullanın:** `posts/first-post.html` dosyasının içeriğini kopyalayıp yeni oluşturduğunuz dosyaya yapıştırın. İçeriği (başlık, tarih, metin) kendinize göre düzenleyin.
3.  **Yazıyı Listelere Ekleyin (ÖNEMLİ):**
    - **Ana Sayfa için:** `index.html` dosyasını açın ve "Son Yazılar" bölümüne yeni yazınız için bir `<article>` bloğu ekleyin.
    - **Tüm Yazılar Sayfası için:** `posts.html` dosyasını açın ve oradaki listeye de aynı şekilde yeni yazınızı ekleyin.

Bu kadar! Değişiklikleri GitHub'a `push` ettiğinizde yeni yazınız sitenizde görünecektir.

## 🎨 Özelleştirme

- **Renkler:** `css/style.css` dosyasının en üstündeki `:root` bloğundaki renk kodlarını (`--bg-color`, `--accent-color` vb.) değiştirerek tüm sitenin renk paletini anında güncelleyebilirsiniz.
- **Font:** Fontu değiştirmek için HTML dosyalarındaki Google Fonts linkini ve `css/style.css` dosyasındaki `--font-family` değişkenini güncelleyin.
- **Profil Fotoğrafı Ekleme (YENİ):**
    - `about.html` dosyasını açın.
    - İçindeki şu satırı bulun: `<img src="https://github.com/kullaniciadiniz.png" ... >`
    - `kullaniciadiniz` yazan yeri kendi **GitHub kullanıcı adınızla** değiştirin. Fotoğrafınız otomatik olarak yüklenecektir.
- **İçerik:** `about.html` ve `contact.html` gibi sayfaları doğrudan düzenleyerek kişisel bilgilerinizi ekleyin. `<footer>` kısmındaki telif hakkı metnini güncellemeyi unutmayın.
