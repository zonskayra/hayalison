/**
 * Hayali Çizgili - Performans Optimizasyonları
 * Web sitesinin performansını artırmak için JavaScript kodları
 * Güncellenmiş Versiyon - 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Performans optimizasyonlarını başlat
    detectDeviceCapabilities();
    optimizeImages();
    optimizeAnimations();
    optimizeEventListeners();
    deferNonCriticalOperations();
    monitorPerformance();
});

/**
 * Cihaz özelliklerini tespit et ve performans sınıfını ayarla
 */
function detectDeviceCapabilities() {
    // Cihaz belleği, CPU çekirdek sayısı ve tarayıcı desteğini kontrol et
    const deviceMemory = navigator.deviceMemory || 4; // Varsayılan olarak 4GB
    const hardwareConcurrency = navigator.hardwareConcurrency || 4; // Varsayılan olarak 4 çekirdek
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Performans seviyesini belirle
    let performanceLevel = 'high';
    
    if (deviceMemory < 4 || hardwareConcurrency < 4 || isMobile) {
        performanceLevel = 'medium';
    }
    
    if (deviceMemory < 2 || hardwareConcurrency < 2 || prefersReducedMotion) {
        performanceLevel = 'low';
    }
    
    // Performans seviyesini HTML elementine sınıf olarak ekle
    document.documentElement.classList.add(`performance-${performanceLevel}`);
    
    // Konsola performans bilgilerini yazdır
    console.log(`Performance Level: ${performanceLevel}`);
    console.log(`Device Memory: ${deviceMemory}GB`);
    console.log(`CPU Cores: ${hardwareConcurrency}`);
    console.log(`Mobile Device: ${isMobile}`);
    console.log(`Prefers Reduced Motion: ${prefersReducedMotion}`);
    
    // Performans seviyesine göre CSS değişkenlerini ayarla
    const root = document.documentElement;
    
    if (performanceLevel === 'low') {
        root.style.setProperty('--transition-duration', '0.1s');
        root.style.setProperty('--animation-duration', '0.1s');
    } else if (performanceLevel === 'medium') {
        root.style.setProperty('--transition-duration', '0.3s');
        root.style.setProperty('--animation-duration', '0.5s');
    } else {
        root.style.setProperty('--transition-duration', '0.5s');
        root.style.setProperty('--animation-duration', '0.8s');
    }
    
    return performanceLevel;
}

/**
 * Resimleri optimize et
 */
function optimizeImages() {
    // Lazy loading uygula
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
    
    // Responsive resimler için srcset kontrol et
    const responsiveImages = document.querySelectorAll('img:not([srcset])');
    responsiveImages.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.includes('data:image')) {
            // Eğer resim URL'i varsa ve data URL değilse
            const baseName = src.split('.').slice(0, -1).join('.');
            const extension = src.split('.').pop();
            
            // Eğer yüksek çözünürlüklü versiyonlar varsa, srcset ekle
            if (extension && ['jpg', 'jpeg', 'png', 'webp'].includes(extension.toLowerCase())) {
                // Srcset özniteliğini oluştur
                const srcset = `
                    ${src} 1x,
                    ${baseName}-2x.${extension} 2x
                `;
                
                // Srcset özniteliğini ekle
                img.setAttribute('srcset', srcset.trim());
            }
        }
    });
    
    // WebP formatını destekleyen tarayıcılar için WebP resimlerini kullan
    const supportsWebP = localStorage.getItem('supportsWebP');
    
    if (supportsWebP === null) {
        // WebP desteğini kontrol et
        const webpTest = new Image();
        webpTest.onload = function() {
            localStorage.setItem('supportsWebP', 'true');
            convertImagesToWebP();
        };
        webpTest.onerror = function() {
            localStorage.setItem('supportsWebP', 'false');
        };
        webpTest.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    } else if (supportsWebP === 'true') {
        convertImagesToWebP();
    }
    
    // Resimleri WebP formatına dönüştür
    function convertImagesToWebP() {
        const jpgPngImages = document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]');
        
        jpgPngImages.forEach(img => {
            const src = img.getAttribute('src');
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            // Orijinal resmi yedekle
            img.setAttribute('data-original-src', src);
            
            // WebP versiyonunu ayarla
            img.setAttribute('src', webpSrc);
            
            // Hata durumunda orijinal resme geri dön
            img.onerror = function() {
                this.setAttribute('src', this.getAttribute('data-original-src'));
                this.onerror = null;
            };
        });
    }
}

/**
 * Animasyonları optimize et
 */
function optimizeAnimations() {
    const performanceLevel = document.documentElement.classList.contains('performance-low') ? 'low' :
                            document.documentElement.classList.contains('performance-medium') ? 'medium' : 'high';
    
    // Düşük performanslı cihazlar için animasyonları basitleştir
    if (performanceLevel === 'low') {
        // Animasyonları devre dışı bırak veya basitleştir
        const style = document.createElement('style');
        style.textContent = `
            .performance-low * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
            
            .performance-low .animated-element,
            .performance-low .hero-element,
            .performance-low .float-animation,
            .performance-low .rotate-animation,
            .performance-low .pulse-animation,
            .performance-low .shine-animation {
                animation: none !important;
            }
            
            .performance-low .enhanced-ripple,
            .performance-low .ripple-effect,
            .performance-low .touch-ripple {
                display: none !important;
            }
            
            .performance-low .parallax-bg {
                transform: none !important;
            }
            
            .performance-low .wave-divider {
                height: 50px !important;
                margin-top: -50px !important;
            }
            
            .performance-low .btn-glass {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // GSAP animasyonlarını basitleştir
        if (typeof gsap !== 'undefined') {
            gsap.defaults({
                duration: 0.3,
                ease: 'power1.out'
            });
        }
    } else if (performanceLevel === 'medium') {
        // Orta seviye performans için animasyonları optimize et
        const style = document.createElement('style');
        style.textContent = `
            .performance-medium .btn-glass {
                backdrop-filter: blur(5px) !important;
                -webkit-backdrop-filter: blur(5px) !important;
            }
            
            .performance-medium .wave-divider {
                height: 70px !important;
                margin-top: -70px !important;
            }
        `;
        document.head.appendChild(style);
        
        // GSAP animasyonlarını optimize et
        if (typeof gsap !== 'undefined') {
            gsap.defaults({
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }
    
    // requestAnimationFrame kullanarak animasyonları optimize et
    const animatedElements = document.querySelectorAll('.animated-element');
    
    animatedElements.forEach(element => {
        let lastTime = 0;
        const fps = performanceLevel === 'low' ? 30 : performanceLevel === 'medium' ? 45 : 60;
        const interval = 1000 / fps;
        
        function animate(currentTime) {
            if (currentTime - lastTime > interval) {
                lastTime = currentTime;
                // Animasyon kodları burada
            }
            
            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
    });
}

/**
 * Event listener'ları optimize et
 */
function optimizeEventListeners() {
    // Scroll ve resize olaylarını throttle et
    let lastScrollTime = 0;
    let lastResizeTime = 0;
    const throttleThreshold = 100; // ms
    
    // Orijinal olay işleyicileri
    const scrollHandlers = [];
    const resizeHandlers = [];
    
    // Orijinal event listener'ı override et
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    
    EventTarget.prototype.addEventListener = function(type, handler, options) {
        if (type === 'scroll') {
            scrollHandlers.push(handler);
            return;
        } else if (type === 'resize') {
            resizeHandlers.push(handler);
            return;
        }
        
        originalAddEventListener.call(this, type, handler, options);
    };
    
    // Throttled scroll olayı
    window.addEventListener('scroll', function() {
        const now = Date.now();
        
        if (now - lastScrollTime > throttleThreshold) {
            lastScrollTime = now;
            
            // Tüm scroll işleyicilerini çağır
            scrollHandlers.forEach(handler => {
                handler.call(window);
            });
        }
    }, { passive: true });
    
    // Throttled resize olayı
    window.addEventListener('resize', function() {
        const now = Date.now();
        
        if (now - lastResizeTime > throttleThreshold) {
            lastResizeTime = now;
            
            // Tüm resize işleyicilerini çağır
            resizeHandlers.forEach(handler => {
                handler.call(window);
            });
        }
    });
    
    // Event delegation kullan
    document.addEventListener('click', function(e) {
        // Butonlar için
        if (e.target.matches('button, .cta-button a, .cta-primary, .cta-secondary, .btn-3d, .btn-glass, .btn-neumorphic, .btn-glow, .btn-gradient, .btn-outline') || 
            e.target.closest('button, .cta-button a, .cta-primary, .cta-secondary, .btn-3d, .btn-glass, .btn-neumorphic, .btn-glow, .btn-gradient, .btn-outline')) {
            
            const button = e.target.matches('button, .cta-button a, .cta-primary, .cta-secondary, .btn-3d, .btn-glass, .btn-neumorphic, .btn-glow, .btn-gradient, .btn-outline') ? 
                        e.target : 
                        e.target.closest('button, .cta-button a, .cta-primary, .cta-secondary, .btn-3d, .btn-glass, .btn-neumorphic, .btn-glow, .btn-gradient, .btn-outline');
            
            // Buton tıklama efekti
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Ripple efekti
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            // Animasyon bitince elementi kaldır
            setTimeout(() => {
                ripple.remove();
            }, 800);
        }
    });
}

/**
 * Kritik olmayan işlemleri ertele
 */
function deferNonCriticalOperations() {
    // requestIdleCallback kullanarak kritik olmayan işlemleri ertele
    const idleCallback = window.requestIdleCallback || function(callback) {
        const start = Date.now();
        return setTimeout(function() {
            callback({
                didTimeout: false,
                timeRemaining: function() {
                    return Math.max(0, 50 - (Date.now() - start));
                }
            });
        }, 1);
    };
    
    // Kritik olmayan işlemleri ertele
    idleCallback(function() {
        // Analitik kodlarını yükle
        loadAnalytics();
        
        // Sosyal medya widget'larını yükle
        loadSocialWidgets();
        
        // Üçüncü taraf scriptlerini yükle
        loadThirdPartyScripts();
    });
    
    // Analitik kodlarını yükle
    function loadAnalytics() {
        // Google Analytics, Facebook Pixel vb.
        console.log('Analytics loaded');
    }
    
    // Sosyal medya widget'larını yükle
    function loadSocialWidgets() {
        // Facebook, Twitter, Instagram vb.
        console.log('Social widgets loaded');
    }
    
    // Üçüncü taraf scriptlerini yükle
    function loadThirdPartyScripts() {
        // Diğer üçüncü taraf scriptleri
        console.log('Third party scripts loaded');
    }
}

/**
 * Performansı izle
 */
function monitorPerformance() {
    // Performans metriklerini izle
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const timing = window.performance.timing;
                const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                console.log('Page loading time: ' + pageLoadTime + 'ms');
                
                // Diğer performans metrikleri
                const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
                const tcpTime = timing.connectEnd - timing.connectStart;
                const requestTime = timing.responseEnd - timing.requestStart;
                const processingTime = timing.domComplete - timing.domLoading;
                
                console.log('DNS lookup time: ' + dnsTime + 'ms');
                console.log('TCP connection time: ' + tcpTime + 'ms');
                console.log('Request/response time: ' + requestTime + 'ms');
                console.log('DOM processing time: ' + processingTime + 'ms');
                
                // Performans skorunu hesapla
                const performanceScore = calculatePerformanceScore(pageLoadTime, dnsTime, tcpTime, requestTime, processingTime);
                console.log('Performance score: ' + performanceScore + '/100');
            }, 0);
        });
    }
    
    // Performans skorunu hesapla
    function calculatePerformanceScore(pageLoadTime, dnsTime, tcpTime, requestTime, processingTime) {
        // Basit bir performans skoru hesaplama
        let score = 100;
        
        // Sayfa yükleme süresi
        if (pageLoadTime > 3000) score -= 20;
        else if (pageLoadTime > 2000) score -= 10;
        else if (pageLoadTime > 1000) score -= 5;
        
        // DNS süresi
        if (dnsTime > 500) score -= 10;
        else if (dnsTime > 200) score -= 5;
        else if (dnsTime > 100) score -= 2;
        
        // TCP süresi
        if (tcpTime > 500) score -= 10;
        else if (tcpTime > 200) score -= 5;
        else if (tcpTime > 100) score -= 2;
        
        // İstek/yanıt süresi
        if (requestTime > 1000) score -= 15;
        else if (requestTime > 500) score -= 10;
        else if (requestTime > 200) score -= 5;
        
        // DOM işleme süresi
        if (processingTime > 1000) score -= 15;
        else if (processingTime > 500) score -= 10;
        else if (processingTime > 200) score -= 5;
        
        return Math.max(0, score);
    }
    
    // FPS (Frames Per Second) izle
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;
    
    function countFrames() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
            
            // FPS'i konsola yazdır
            console.log('FPS: ' + fps);
            
            // Düşük FPS durumunda optimizasyon yap
            if (fps < 30) {
                // Animasyonları daha da basitleştir
                document.documentElement.classList.add('performance-critical');
            }
        }
        
        requestAnimationFrame(countFrames);
    }
    
    requestAnimationFrame(countFrames);
}