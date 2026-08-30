# Glorya Massage Landing Page

Landing page statis satu halaman untuk Glorya Massage, jasa pijat panggilan di Yogyakarta. Website dibuat dengan HTML5, Tailwind CSS (build production, bukan CDN), custom CSS, dan Vanilla JavaScript.

## Menjalankan website

Buka `index.html` langsung di browser, atau jalankan lewat local static server pilihan Anda. Tidak perlu proses build untuk sekadar melihat halaman — `assets/css/tailwind.css` sudah berupa file hasil build yang di-commit ke repo.

## Build ulang CSS Tailwind

Build ulang **hanya diperlukan setelah menambah/mengubah class Tailwind di `index.html`** (CSS di-purge berdasarkan class yang benar-benar dipakai, jadi class baru tidak akan otomatis muncul sebelum di-build ulang):

```bash
npm install        # sekali saja
npm run build:css  # build production (minified) ke assets/css/tailwind.css
npm run watch:css   # opsional, auto-rebuild saat development
```

## Struktur

```text
index.html
robots.txt
sitemap.xml
site.webmanifest
README.md
package.json
tailwind.config.js
assets/
  css/custom.css
  css/tailwind.css        # hasil build, ikut di-commit
  css/tailwind-input.css  # source @tailwind directives
  js/main.js
  images/README.md
```

## Production checklist

- [x] Pasang logo asli
- [x] Pasang hero image
- [x] Pasang about image
- [x] Buat OG image
- [x] Pasang favicon
- [x] SEO: address di JSON-LD, alt text hero, Tailwind production build
- [ ] Ganti dummy testimonial
- [ ] Test seluruh link WhatsApp
- [ ] Test Instagram
- [ ] Test X
- [ ] Test responsive
- [ ] Validate JSON-LD
- [ ] Validate sitemap
- [ ] Run Lighthouse
- [ ] Hubungkan gloryamassage.com
- [ ] Google Search Console
- [ ] Submit sitemap.xml
- [ ] Setup Google Business Profile
