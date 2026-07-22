# Nişan davet sitesi — kurulum rehberi

Statik site (GitHub Pages) + Google Form / Drive / Maps butonları.

## 1) Google Form — katılım (RSVP)

1. [Google Forms](https://forms.google.com) açın → **Boş form**.
2. Başlık: `Nişan katılım bildirimi`.
3. Örnek sorular:
   - Ad Soyad (Kısa yanıt, zorunlu)
   - Katılacak mısınız? (Çoktan seçmeli: Evet / Hayır / Belki)
   - Kişi sayısı (Kısa yanıt veya sayı)
   - Not (Paragraf, isteğe bağlı)
4. Sağ üst **Gönder** → linki kopyalayın (`https://forms.gle/...`).
5. Bu linki `index.html` içinde `RSVP_LINKINIZ` yazan yerlere yapıştırın.

## 2) Fotoğraf yükleme (Form veya Drive)

### Seçenek A — Form (önerilen)

1. Yeni Form: `Nişan fotoğrafları`.
2. Sorular: Ad Soyad + **Dosya yükleme** (birden fazla dosyaya izin verin).
3. Linki kopyalayıp `FOTO_LINKINIZ` yerlerine yapıştırın.
4. Yüklenen dosyalar otomatik Drive’ınıza gider.

### Seçenek B — Drive klasörü

1. Drive’da klasör: `Nişan fotoğrafları`.
2. Paylaş → **Bağlantısı olan herkes** → rol: **Düzenleyici** (yükleme için).
3. Klasör linkini `FOTO_LINKINIZ` yerine koyun.

## 3) Konum (Google Maps)

1. Maps’te mekânı açın → **Paylaş** → linki kopyalayın.
2. `KONUM_LINKINIZ` yerine yapıştırın.
3. İsterseniz `index.html` içindeki adres metnini de güncelleyin.

## 4) Siteyi kişiselleştirin

`index.html` dosyasında değiştirin:

- İsimler (`Ayşe & Mehmet`)
- Tarih / saat
- Mekân adı ve adres
- Üç buton linki (RSVP, foto, konum)
- `<title>` metni

İsterseniz `styles.css` içindeki `--blush`, `--sage` renklerini de oynayabilirsiniz.

## 5) Bilgisayarda önizleme

`index.html` dosyasını tarayıcıda açın (çift tık veya sürükle-bırak).  
Linkler henüz örnek olduğu için Form/Maps gerçek linklerle değişince çalışır.

## 6) GitHub’a yükleyip yayınlama

1. [GitHub](https://github.com) → **New repository**  
   - İsim örneği: `nisan`  
   - **Public** seçin  
   - Create repository
2. Bilgisayarınızda (PowerShell), proje klasöründe:

```powershell
cd "$env:USERPROFILE\Desktop\webnisan"
git init
git add index.html styles.css README.md
git commit -m "Nişan davet sitesi: RSVP, konum ve foto butonları"
git branch -M main
git remote add origin https://github.com/cagridemirbas01/nisan.git
git push -u origin main
```

3. Repo sayfasında: **Settings → Pages**
4. **Source**: Deploy from a branch  
5. Branch: `main` → klasör: `/ (root)` → **Save**
6. 1–2 dakika sonra site adresi:

`https://cagridemirbas01.github.io/nisan/`

## 7) Misafirlere gönderme

WhatsApp / SMS ile Pages linkini paylaşın.  
İsterseniz QR kod da üretebilirsiniz (ör. qr-code-generator.com).

## Dosya yapısı

```
webnisan/
├── index.html   ← sayfa + buton linkleri
├── styles.css   ← görünüm
└── README.md    ← bu rehber
```

## Sık sorulanlar

**Form’u kim görür?**  
Sadece siz (Form yanıtları + Drive). Misafirler yalnızca formu doldurur.

**Foto boyutu?**  
Google Form’da dosya limiti hesabınıza göre değişir; büyük albüm için Drive klasörü daha rahat olabilir.

**Linkleri sonra değiştirmek?**  
`index.html` içinde `href` güncelleyin → tekrar `git add` / `commit` / `push`. Site otomatik yenilenir.
