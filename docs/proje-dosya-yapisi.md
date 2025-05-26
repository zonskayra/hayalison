# Hayali Çizgili Web Sitesi Dosya Yapısı

Bu belge, Hayali Çizgili web sitesinin dosya yapısını ve organizasyonunu açıklar. Proje, ana web sitesi ve finans sistemi olmak üzere iki ana bölümden oluşmaktadır.

## Ana Dizin Yapısı

```
hayalicizgili.com/
│
├── assets/           # Site görselleri ve medya dosyaları
│   ├── images/       # Resimler, logolar, ikonlar
│   └── ...
│
├── css/              # Ana sitenin stil dosyaları
│
├── docs/             # Dokümantasyon dosyaları
│   ├── finans-sistem-kullanimi.md
│   └── ...
│
├── en/               # İngilizce dil sayfaları
│
├── finans/           # Finans yönetim sistemi (erişim kontrollü)
│   ├── css/          # Finans sistemine özgü stiller
│   ├── js/           # Finans sistemine özgü scriptler
│   ├── assets/       # Finans sistemine özgü görseller
│   ├── index.html    # Finans ana panel sayfası
│   └── giris.html    # Finans giriş sayfası
│
├── includes/         # Yeniden kullanılabilir HTML parçaları
│
├── js/               # Ana site için JavaScript dosyaları
│
├── tr/               # Türkçe dil sayfaları (varsayılan dil)
│
├── urunler/          # Ürün sayfaları
│
├── 404.html          # Hata sayfası
├── index.html        # Ana site yönlendirme sayfası
└── ...
```

## Finans Sistemi Dosya Yapısı

Finans sistemi, ana siteden ayrı, şifre korumalı bir modüldür:

```
finans/
│
├── css/
│   ├── custom.css            # Özel stil tanımlamaları
│   ├── performance.css       # Performans optimizasyonları
│   └── style.css             # Ana stil dosyası
│
├── js/
│   ├── app.js                # Ana uygulama mantığı
│   ├── charts.js             # Grafik oluşturma fonksiyonları
│   ├── data.js               # Veri yönetimi
│   └── optimization.js       # Performans optimizasyonları
│
├── assets/
│   └── logo.svg              # Finans sistemi logosu
│
├── giris.html                # Giriş sayfası
└── index.html                # Ana panel sayfası
```

## Ana Site CSS Organizasyonu

Ana site, modüler CSS yapısı kullanır:

```
css/
├── 404-style.css             # Hata sayfası stilleri
├── animations.css            # Animasyon tanımlamaları
├── enhanced-buttons.css      # Geliştirilmiş buton stilleri
├── loading-screen.css        # Yükleme ekranı
├── optimized-styles.css      # Optimize edilmiş genel stiller
├── paint-loader.css          # Yükleme animasyonları
├── style-about.css           # Hakkımızda sayfası stilleri
├── style-common.css          # Ortak stiller
├── style-contact.css         # İletişim sayfası stilleri
├── style-home.css            # Ana sayfa stilleri
├── style-how-it-works.css    # Nasıl Çalışır sayfası stilleri
├── style-products.css        # Ürünler sayfası stilleri
└── style-why-us.css          # Neden Biz sayfası stilleri
```

## Ana Site JavaScript Organizasyonu

Ana site, modüler JavaScript yapısı kullanır:

```
js/
├── 404-script.js             # Hata sayfası scriptleri
├── button-animation.js       # Buton animasyonları
├── enhanced-buttons.js       # Geliştirilmiş buton davranışları
├── image-loader.js           # Görsel yükleme optimizasyonları
├── include-loading-screen.js # Yükleme ekranı include script
├── loading-screen.js         # Yükleme ekranı kontrolleri
├── optimized-buttons.js      # Optimize edilmiş buton davranışları
├── optimized-loading-screen.js # Optimize edilmiş yükleme ekranı
├── optimized-script-common.js # Optimize edilmiş ortak scriptler
├── paint-loader.js           # Yükleme animasyonları
├── performance-optimizer.js  # Performans optimizasyonları
├── script-common.js          # Ortak script fonksiyonları
├── script-contact.js         # İletişim sayfası scriptleri
├── script-home.js            # Ana sayfa scriptleri
├── script-products.js        # Ürünler sayfası scriptleri
└── scroll-animations.js      # Kaydırma animasyonları
```

## Dil Organizasyonu

Site çok dilli bir yapıya sahiptir:

```
tr/                           # Türkçe (varsayılan)
├── hakkimizda.html
├── iletisim.html
├── index.html
├── nasil-calisir.html
├── neden-biz.html
└── urunler/
    └── index.html

en/                           # İngilizce
├── about-us.html
├── contact.html
├── how-it-works.html
├── index.html
├── why-us.html
└── products/
    └── index.html
```

## Erişim ve Güvenlik

- Finans sistemine erişim şifre korumalıdır
- Ana siteden finans sistemine gizli bir bağlantı (footer'daki "HÇ" metni) ile erişilir
- Tüm finans verileri yerel depolama alanında şifrelenmiş olarak saklanır

## Dosya Entegrasyonu

- Ana site ve finans sistemi birbirinden bağımsız ancak entegre çalışacak şekilde tasarlanmıştır
- Ortak stil ve script dosyaları her iki sistem tarafından da kullanılabilir
- Finans sistemi, ana siteden bağımsız olarak da çalışabilir

---

© 2025 Hayali Çizgili. Tüm hakları saklıdır.