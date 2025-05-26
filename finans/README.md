# Hayali Çizgili Finans Yönetim Sistemi

Modern, güvenli ve kullanıcı dostu gelir-gider takip uygulaması.

## 🚀 Özellikler

### ✅ Mevcut Özellikler
- **Gelir/Gider Yönetimi**: Tüm finansal işlemlerinizi kolayca takip edin
- **Kategori Sistemi**: Özelleştirilebilir kategoriler ile organize olun
- **Görsel Raporlar**: Chart.js ile güçlü veri görselleştirme
- **Offline Destek**: PWA teknolojisi ile internet olmadan da çalışır
- **Mobil Uyumlu**: Responsive tasarım ile her cihazda mükemmel görünüm
- **Karanlık Mod**: Göz yorgunluğunu azaltan tema desteği
- **Veri Yedekleme**: Otomatik ve manuel yedekleme seçenekleri
- **Hızlı İşlem**: Tek tıkla gelir/gider ekleme

### 🔄 Geliştirme Aşamasında
- Multi-currency desteği
- Bütçe planlama ve hedefler
- Fatura yönetimi
- Excel/PDF dışa aktarma
- Cloud senkronizasyon
- AI destekli tahminleme

## 📁 Proje Yapısı

```
finans/
├── dashboard.html          # Ana uygulama sayfası
├── manifest.json          # PWA manifest dosyası
├── service-worker.js      # Offline destek için SW
├── README.md             # Bu dosya
│
├── src/                  # Kaynak kodlar
│   ├── js/
│   │   ├── core/        # Çekirdek modüller
│   │   │   ├── app.js       # Ana uygulama
│   │   │   ├── config.js    # Konfigürasyon
│   │   │   └── router.js    # SPA yönlendirme
│   │   ├── modules/     # İş mantığı modülleri
│   │   │   ├── categories.js
│   │   │   ├── transactions.js (TODO)
│   │   │   └── reports.js (TODO)
│   │   ├── services/    # Servis katmanı
│   │   │   ├── storage.js   # IndexedDB yönetimi
│   │   │   ├── api.js (TODO)
│   │   │   └── sync.js (TODO)
│   │   ├── utils/       # Yardımcı fonksiyonlar
│   │   │   └── helpers.js
│   │   └── pages/       # Sayfa modülleri (TODO)
│   │
│   ├── css/
│   │   ├── base/        # Temel stiller
│   │   │   ├── reset.css (TODO)
│   │   │   ├── variables.css
│   │   │   └── typography.css (TODO)
│   │   ├── components/  # Bileşen stilleri (TODO)
│   │   ├── layouts/     # Sayfa düzenleri (TODO)
│   │   └── main.css     # Ana stil dosyası (TODO)
│   │
│   └── templates/       # HTML şablonları (TODO)
│
├── assets/              # Statik dosyalar
│   ├── images/
│   │   └── icons/
│   ├── logo.svg
│   └── logo.png
│
└── data/               # Veri dosyaları
    └── database.json   # Yedek veri dosyası
```

## 🛠️ Teknolojiler

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with CSS Variables
- **Database**: IndexedDB
- **Charts**: Chart.js
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Nunito, Comic Neue)
- **PWA**: Service Worker, Web App Manifest

## 🚀 Kurulum

1. Projeyi klonlayın veya indirin
2. Web sunucusuna yükleyin
3. `/finans/dashboard.html` adresine gidin

### Geliştirme Ortamı

```bash
# Yerel sunucu başlatma
python -m http.server 8000
# veya
npx serve .

# Tarayıcıda aç
http://localhost:8000/finans/dashboard.html
```

## 📱 PWA Kurulumu

1. Desteklenen tarayıcıda (Chrome, Edge, Safari) siteyi açın
2. Adres çubuğundaki "Install" butonuna tıklayın
3. Veya tarayıcı menüsünden "Install App" seçeneğini kullanın

## 🔒 Güvenlik

- Tüm veriler yerel olarak saklanır
- IndexedDB ile güvenli veri depolama
- XSS koruması
- Input validasyonu
- Şifreleme desteği (gelecek sürüm)

## 📊 Veritabanı Yapısı

### Transactions
```javascript
{
  id: auto,
  type: 'income' | 'expense',
  amount: number,
  category: categoryId,
  description: string,
  date: ISO string,
  tags: string[],
  attachments: string[],
  createdAt: ISO string,
  updatedAt: ISO string
}
```

### Categories
```javascript
{
  id: auto,
  name: string,
  type: 'income' | 'expense',
  icon: string,
  color: hex color,
  description: string,
  isActive: boolean,
  createdAt: ISO string,
  updatedAt: ISO string
}
```

## 🎨 Renk Paleti

- **Primary**: #F8C3CD (Pembe)
- **Secondary**: #A5DEF1 (Mavi)
- **Tertiary**: #D1C1E6 (Mor)
- **Success**: #4CAF50
- **Warning**: #FF9800
- **Danger**: #F44336
- **Info**: #2196F3

## 📝 Lisans

Bu proje Hayali Çizgili tarafından geliştirilmiştir. Tüm hakları saklıdır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

- Website: [hayalicizgili.com](https://hayalicizgili.com)
- WhatsApp: +90 850 346 61 72

## 🔄 Güncelleme Geçmişi

### v2.0.0 (2025-01-22)
- Tamamen yeniden yazıldı
- Modern modüler yapı
- PWA desteği
- Gelişmiş performans
- Yeni kullanıcı arayüzü

### v1.0.0 (2024)
- İlk sürüm
