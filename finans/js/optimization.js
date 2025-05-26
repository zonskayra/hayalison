/**
 * Hayali Çizgili - Finans Uygulaması Performans Optimizasyonları
 * Bu dosya, performans ölçümleri ve optimizasyonlar için yardımcı fonksiyonlar içerir
 */

// Performans izleme modülü
const PerformanceTracker = {
    startTime: performance.now(),
    events: [],
    
    // Performans olayı kaydet
    logEvent(eventName) {
        const time = performance.now() - this.startTime;
        this.events.push({
            event: eventName,
            time: time,
            timestamp: new Date().toISOString()
        });
        
        if (window.FINANS_PERF) {
            window.FINANS_PERF.logEvent(eventName);
        }
        
        return time; // Geçen süreyi döndür
    },
    
    // Performans raporu oluştur
    generateReport() {
        let report = "=== Hayali Çizgili Finans Performans Raporu ===\n\n";
        
        this.events.forEach(event => {
            report += `${event.event}: ${Math.round(event.time)}ms\n`;
        });
        
        return report;
    },
    
    // Sayfa yükleme metrikleri
    getPageLoadMetrics() {
        if (!window.performance || !window.performance.timing) {
            return null;
        }
        
        const timing = window.performance.timing;
        
        return {
            // Navigasyon başlangıcından sayfa yüklemesine kadar geçen süre
            totalPageLoad: timing.loadEventEnd - timing.navigationStart,
            
            // DOM parsing süresi
            domParsing: timing.domComplete - timing.domLoading,
            
            // Ağ gecikmesi
            networkLatency: timing.responseEnd - timing.requestStart,
            
            // İçerik indirme süresi
            contentDownload: timing.responseEnd - timing.responseStart
        };
    }
};

// Veri önbelleği
const CacheManager = {
    cache: {},
    ttl: {}, // Time to live - önbellek süreleri
    
    // Veriyi önbelleğe al
    set(key, value, expireInSeconds = 300) { // Varsayılan 5 dakika
        this.cache[key] = value;
        this.ttl[key] = Date.now() + (expireInSeconds * 1000);
        return value;
    },
    
    // Önbellekten veri getir
    get(key) {
        // Önbellekte var mı ve süresi dolmamış mı kontrol et
        if (this.has(key)) {
            return this.cache[key];
        }
        return null;
    },
    
    // Önbellekte var mı ve süresi dolmamış mı kontrol et
    has(key) {
        return key in this.cache && this.ttl[key] > Date.now();
    },
    
    // Önbellekten veriyi sil
    remove(key) {
        if (key in this.cache) {
            delete this.cache[key];
            delete this.ttl[key];
            return true;
        }
        return false;
    },
    
    // Tüm önbelleği temizle
    clear() {
        this.cache = {};
        this.ttl = {};
    },
    
    // Süresi dolan verileri temizle
    cleanup() {
        const now = Date.now();
        Object.keys(this.ttl).forEach(key => {
            if (this.ttl[key] < now) {
                delete this.cache[key];
                delete this.ttl[key];
            }
        });
    }
};

// Tembel yükleme (Lazy Loading) yardımcıları
const LazyLoader = {
    // Görünür olduğunda içeriği yükle
    observeElements(selector, loadCallback) {
        if (!('IntersectionObserver' in window)) {
            // IntersectionObserver desteklenmiyorsa, tüm öğeleri hemen yükle
            document.querySelectorAll(selector).forEach(loadCallback);
            return;
        }
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadCallback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        document.querySelectorAll(selector).forEach(element => {
            observer.observe(element);
        });
    },
    
    // Resmi tembel yükle
    loadImage(element) {
        const src = element.dataset.src;
        if (src) {
            element.src = src;
            element.removeAttribute('data-src');
        }
    },
    
    // Genel içerik tembel yükleme
    loadContent(element) {
        const content = element.dataset.content;
        if (content) {
            element.innerHTML = content;
            element.removeAttribute('data-content');
        }
    }
};

// Oturum yönetimi - güvenlik ve performans için
const SessionManager = {
    // Oturum başlat
    start(duration = 30) { // Dakika cinsinden süre
        const expirationTime = Date.now() + (duration * 60 * 1000);
        localStorage.setItem('finans_session_expires', expirationTime);
        this.resetIdleTimer();
    },
    
    // Oturum süresi doldu mu?
    isExpired() {
        const expirationTime = localStorage.getItem('finans_session_expires');
        return !expirationTime || Date.now() > parseInt(expirationTime);
    },
    
    // Son aktivite zamanını güncelle
    resetIdleTimer() {
        localStorage.setItem('finans_last_activity', Date.now());
    },
    
    // Belirli süre hareketsizlik var mı?
    isIdle(idleMinutes = 15) {
        const lastActivity = localStorage.getItem('finans_last_activity');
        if (!lastActivity) return true;
        
        return (Date.now() - parseInt(lastActivity)) > (idleMinutes * 60 * 1000);
    },
    
    // Oturumu sonlandır
    end() {
        localStorage.removeItem('finans_session_expires');
        localStorage.removeItem('finans_last_activity');
    },
    
    // Aktivite izleyici başlat
    startActivityTracking() {
        // Tüm kullanıcı etkileşimlerini dinle
        ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(eventName => {
            window.addEventListener(eventName, () => this.resetIdleTimer(), true);
        });
        
        // Düzenli aralıklarla kontrol et
        setInterval(() => {
            if (this.isIdle() || this.isExpired()) {
                // Otomatik çıkış yap
                if (App && typeof App.logout === 'function') {
                    App.logout();
                }
            }
        }, 60000); // Her dakika kontrol et
    }
};

// Sayfanın yüklendiği sırada işlemleri başlat
document.addEventListener('DOMContentLoaded', () => {
    PerformanceTracker.logEvent('DOMContentLoaded');
    
    // Görsel yükleme optimizasyonu
    LazyLoader.observeElements('img[data-src]', LazyLoader.loadImage);
    
    // İçerik yükleme optimizasyonu
    LazyLoader.observeElements('[data-content]', LazyLoader.loadContent);
    
    // Her 5 dakikada bir önbelleği temizle
    setInterval(() => {
        CacheManager.cleanup();
    }, 300000);
});

// Tüm sayfa içeriği yüklendikten sonra
window.addEventListener('load', () => {
    PerformanceTracker.logEvent('window.load');
    document.body.classList.add('loaded');
    
    // Sayfa yükleme metrikleri
    const metrics = PerformanceTracker.getPageLoadMetrics();
    if (metrics) {
        console.log('Sayfa Yükleme Metrikleri:', metrics);
    }
});