# Sade ve Teknik GitHub Blog Şablonu

Bu proje, herhangi bir statik site oluşturucu (Jekyll, Hugo vb.) kullanmadan, yalnızca saf HTML, CSS ve minimal JavaScript ile geliştirilmiş, teknik içerik paylaşımına uygun bir blog şablonudur.

### Özellikler

* **Sıfır Bağımlılık:** Sadece HTML, CSS ve JavaScript kullanır. Karmaşık kurulum gerektirmez.
* **Karanlık Tema:** Göz yormayan, kod odaklı bir karanlık temaya sahiptir.
* **Duyarlı Tasarım (Responsive):** Mobil cihazlarda ve masaüstünde sorunsuz görüntüleme sağlar.
* **Kolay Özelleştirme:** Renkler ve fontlar, `css/style.css` dosyasındaki değişkenler üzerinden kolayca değiştirilebilir.
* **GitHub Pages Uyumlu:** Depoyu GitHub'a yükleyip Pages özelliğini etkinleştirdiğiniz an siteniz yayına hazır olur.
* **Teknik Odaklı:** Kod blokları ve satır içi kodlar için özel stil desteği sunar.

---

### Başlarken

1.  **Depoyu Alın:** Bu depoyu "Fork" yapabilir veya dosyaları indirip kendi GitHub deponuza yükleyebilirsiniz.
2.  **GitHub Pages'i Etkinleştirin:**
    * Deponuzun **Settings > Pages** sekmesine gidin.
    * "Build and deployment" altında, **Source** olarak `Deploy from a branch` seçeneğini belirleyin.
    * **Branch** olarak `main` (veya `master`) ve klasör olarak `/(root)` seçip **Save** butonuna tıklayın.
    * Birkaç dakika içinde siteniz `https://kullaniciadiniz.github.io/depo-adiniz/` adresinde yayında olacaktır.

---

### Nasıl Yeni Yazı Eklenir?

Bu şablon bir veritabanı veya derleyici kullanmadığı için yazılar manuel olarak eklenir:

1.  **Yeni HTML Dosyası Oluşturun:** `posts/` klasörü içinde yeni bir `.html` dosyası oluşturun (örneğin: `ikinci-yazim.html`).
2.  **Şablonu Kullanın:** `posts/first-post.html` dosyasının içeriğini kopyalayıp yeni oluşturduğunuz dosyaya yapıştırın. İçeriği (başlık, tarih, metin) kendinize göre düzenleyin.
3.  **Yazıyı Listelere Ekleyin (ÖNEMLİ):**
    * **Ana Sayfa için:** `index.html` dosyasını açın ve "Son Yazılar" bölümüne yeni yazınız için bir `<article>` bloğu ekleyin.
    * **Tüm Yazılar Sayfası için:** `posts.html` dosyasını açın ve buradaki listeye de aynı şekilde yeni yazınızı ekleyin.

Değişiklikleri GitHub'a `push` ettiğinizde yeni yazınız sitenizde görünecektir.

---

### Özelleştirme

* **Renkler:** `css/style.css` dosyasının en üstündeki `:root` bloğundaki renk kodlarını (`--bg-color`, `--accent-color` vb.) değiştirerek tüm sitenin renk paletini anında güncelleyebilirsiniz.
* **Font:** Fontu değiştirmek için HTML dosyalarındaki Google Fonts linkini ve `css/style.css` dosyasındaki `--font-family` değişkenini güncelleyin.
* **Profil Fotoğrafı Ekleme:**
    * `about.html` dosyasını açın.
    * Şu satırı bulun: `<img src="https://github.com/yourusername.png" ... >`
    * `yourusername` yazan yeri kendi GitHub kullanıcı adınızla değiştirin. Fotoğrafınız otomatik olarak yüklenecektir.
* **İçerik:** `about.html` ve `contact.html` gibi sayfaları doğrudan düzenleyerek kişisel bilgilerinizi ekleyin. `<footer>` kısmındaki telif hakkı metnini güncellemeyi unutmayın.

---

# Simple & Technical GitHub Pages Blog Template

This project is a blog template designed for sharing technical content, built using only pure HTML, CSS, and minimal JavaScript, without relying on any static site generators (like Jekyll, Hugo, etc.).

### Features

* **Zero Dependencies:** Uses only HTML, CSS, and JavaScript. No complex setups required.
* **Dark Theme:** Features an eye-friendly, code-focused dark theme.
* **Responsive Design:** Looks great on both mobile devices and desktops.
* **Easy Customization:** Colors and fonts can be easily changed via variables in the `css/style.css` file.
* **GitHub Pages Compatible:** Your site goes live as soon as you upload the repository to GitHub and activate the Pages feature.
* **Technical Focus:** Includes special styling support for code blocks and inline code.

---

### Getting Started

1.  **Get the Repository:** You can "Fork" this repository or download the files and upload them to your own GitHub repository.
2.  **Enable GitHub Pages:**
    * Go to your repository's **Settings > Pages** tab.
    * Under "Build and deployment," select `Deploy from a branch` as the **Source**.
    * Choose `main` (or `master`) as the **Branch** and `/(root)` as the folder, then click **Save**.
    * Within a few minutes, your site will be live at `https://yourusername.github.io/your-repo-name/`.

---

### How to Add New Posts

Since this template doesn't use a database or compiler, posts are added manually:

1.  **Create a New HTML File:** Create a new `.html` file inside the `posts/` folder (e.g., `second-post.html`).
2.  **Use the Template:** Copy the content of `posts/first-post.html` and paste it into your newly created file. Edit the content (title, date, text) as you wish.
3.  **Add the Post to Lists (IMPORTANT):**
    * **For the Home Page:** Open `index.html` and add an `<article>` block for your new post in the "Recent Posts" section.
    * **For the All Posts Page:** Open `posts.html` and similarly add your new post to the list there.

Once you `push` your changes to GitHub, your new post will appear on your site.

---

### Customization

* **Colors:** You can instantly update the entire site's color palette by changing the color codes (`--bg-color`, `--accent-color`, etc.) in the `:root` block at the top of the `css/style.css` file.
* **Font:** To change the font, update the Google Fonts link in the HTML files and the `--font-family` variable in `css/style.css`.
* **Adding a Profile Picture:**
    * Open the `about.html` file.
    * Find the line: `<img src="https://github.com/yourusername.png" ... >`
    * Replace `yourusername` with your own GitHub username. Your profile picture will be loaded automatically.
* **Content:** Edit pages like `about.html` and `contact.html` directly to add your personal information. Don't forget to update the copyright text in the `<footer>` section.
