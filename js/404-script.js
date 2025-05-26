/**
 * Hayali Çizgili - 404 Sayfası JavaScript
 * Geliştirilmiş ve İyileştirilmiş Versiyon
 */

// Sayfa yükleme performansını ölçme
const startTime = performance.now();

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    // Dil seçici için
    initLanguageSelector();
    
    // Otomatik yönlendirme
    startRedirectCountdown();
    
    // Animasyonları başlat
    initAnimations();
    
    // Kalem etkileşimlerini etkinleştir
    enhancePencilInteractivity();
    
    // Arama işlevselliği
    initSearchFunctionality();
    
    // Erişilebilirlik iyileştirmeleri
    enhanceAccessibility();
    
    // Sayfa ziyaretini ve 404 hatasını logla
    logPageNotFound();
    
    // Performans ölçümü
    measurePerformance();
});

/**
 * Otomatik yönlendirme geri sayımı
 */
function startRedirectCountdown() {
    const countdownElement = document.getElementById('countdown');
    const cancelButton = document.getElementById('cancel-redirect');
    
    if (!countdownElement || !cancelButton) return;
    
    // Ana sayfa URL'sini belirle
    const isEnglish = window.location.pathname.includes('/en/');
    const homePageUrl = isEnglish ? 'index.html' : 'tr/index.html';
    
    let secondsLeft = parseInt(countdownElement.textContent, 10);
    let redirectTimer;
    let isRedirectCancelled = false;
    
    // Geri sayım işlevi
    const countdown = () => {
        secondsLeft--;
        
        if (secondsLeft <= 0) {
            window.location.href = homePageUrl;
            return;
        }
        
        countdownElement.textContent = secondsLeft;
        redirectTimer = setTimeout(countdown, 1000);
    };
    
    // Geri sayımı başlat
    redirectTimer = setTimeout(countdown, 1000);
    
    // İptal butonu
    cancelButton.addEventListener('click', function() {
        clearTimeout(redirectTimer);
        isRedirectCancelled = true;
        
        const redirectMessage = document.querySelector('.redirect-message');
        if (redirectMessage) {
            // Animasyonlu geçiş
            redirectMessage.style.opacity = '0';
            redirectMessage.style.height = redirectMessage.offsetHeight + 'px';
            redirectMessage.style.transition = 'opacity 0.5s ease, height 0.5s ease 0.5s, padding 0.5s ease 0.5s, margin 0.5s ease 0.5s';
            
            setTimeout(() => {
                redirectMessage.style.height = '0';
                redirectMessage.style.padding = '0';
                redirectMessage.style.margin = '0';
                
                setTimeout(() => {
                    redirectMessage.style.display = 'none';
                }, 500);
            }, 500);
        }
    });
    
    // Sayfa terk edildiğinde zamanlayıcıyı temizle
    window.addEventListener('beforeunload', function() {
        clearTimeout(redirectTimer);
    });
}

/**
 * Dil seçici oluşturma ve yönetme
 */
function initLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    if (!languageSelector) return;
    
    // Mevcut URL'yi analiz et
    const currentPath = window.location.pathname;
    const isEnglish = currentPath.includes('/en/');
    
    // Dil seçeneklerini oluştur
    const trOption = document.createElement('a');
    trOption.href = isEnglish ? '../404.html' : '404.html';
    trOption.textContent = 'TR';
    trOption.setAttribute('aria-label', 'Türkçe dil seçeneği');
    if (!isEnglish) trOption.classList.add('active');
    
    const enOption = document.createElement('a');
    enOption.href = isEnglish ? '404.html' : 'en/404.html';
    enOption.textContent = 'EN';
    enOption.setAttribute('aria-label', 'English language option');
    if (isEnglish) enOption.classList.add('active');
    
    // Dil seçeneklerini ekle
    languageSelector.appendChild(trOption);
    languageSelector.appendChild(document.createTextNode(' | '));
    languageSelector.appendChild(enOption);
    
    // Klavye erişilebilirliği için
    [trOption, enOption].forEach(option => {
        option.setAttribute('role', 'button');
        option.setAttribute('tabindex', '0');
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = this.href;
            }
        });
    });
}

/**
 * Arama işlevselliğini başlat
 */
function initSearchFunctionality() {
    const searchForm = document.querySelector('.search-form');
    if (!searchForm) return;
    
    // Arama yapılınca site içi arama parametresi ekle
    searchForm.addEventListener('submit', function(e) {
        const searchInput = this.querySelector('.search-input');
        const siteSearchInput = this.querySelector('input[name="q"][type="hidden"]');
        
        if (searchInput && siteSearchInput && searchInput.value.trim() !== '') {
            // Site içi arama için Google'ın site: operatörünü kullan
            searchInput.value = `site:hayalicizgili.com ${searchInput.value.trim()}`;
        }
    });
    
    // Klavye erişilebilirliği
    const searchButton = searchForm.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                searchForm.submit();
            }
        });
    }
}

/**
 * Kalem animasyonu için gelişmiş etkileşimler
 */
function enhancePencilInteractivity() {
    const errorImage = document.querySelector('.error-image');
    if (!errorImage) return;
    
    const pencilAnimation = errorImage.querySelector('.pencil-animation');
    if (!pencilAnimation) return;
    
    // Temel etkileşimler
    pencilAnimation.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    pencilAnimation.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
    
    // Dokunmatik etkileşim
    pencilAnimation.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.animationPlayState = 'paused';
    });
    
    pencilAnimation.addEventListener('touchend', function() {
        this.style.animationPlayState = 'running';
    });
    
    // Gelişmiş etkileşimler
    errorImage.addEventListener('click', function() {
        // Yeni çizgiler ekle ve görünür yap
        const hiddenLines = this.querySelectorAll('.hidden-line');
        let delay = 0;
        
        hiddenLines.forEach(line => {
            // Rastgele bir gecikme ekleyerek doğal görünüm elde et
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transition = 'opacity 0.5s ease';
                
                // Çizgi çizim animasyonunu başlat
                line.style.strokeDasharray = '100';
                line.style.strokeDashoffset = '100';
                line.style.animation = 'drawLine 1.5s forwards';
            }, delay);
            
            delay += 200; // Her çizgi için 200ms gecikme
        });
        
        // Kalem parçaları için animasyon
        const pencilParts = this.querySelectorAll('.pencil-part-1, .pencil-part-2');
        pencilParts.forEach(part => {
            part.style.transition = 'all 0.5s ease';
            
            // Renk ve kalınlık değişimi
            if (part.classList.contains('pencil-part-1')) {
                part.style.stroke = 'var(--color-tertiary)';
            } else {
                part.style.stroke = 'var(--color-primary)';
            }
            
            part.style.strokeWidth = '9';
            
            // 3 saniye sonra normal haline dön
            setTimeout(() => {
                part.style.transition = 'all 1s ease';
                part.style.strokeWidth = '8';
                
                if (part.classList.contains('pencil-part-1')) {
                    part.style.stroke = '#F8C3CD';
                } else {
                    part.style.stroke = '#A5DEF1';
                }
            }, 3000);
        });
    });
}

/**
 * Animasyonları başlatma
 */
function initAnimations() {
    // GSAP ile animasyonları etkinleştir (eğer varsa)
    if (window.gsap) {
        // 404 sayısını animasyonlu yap
        gsap.to('.error-code', {
            y: -10,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
        
        // Alternatif bağlantıları sırayla göster
        const links = document.querySelectorAll('.alternative-links a');
        gsap.from(links, {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    }
    
    // Ana sayfaya dönüş butonu için efektler
    const homeButton = document.querySelector('.home-button');
    if (homeButton) {
        homeButton.addEventListener('mouseenter', function() {
            this.classList.add('hover-effect');
        });
        
        homeButton.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
        
        // Dokun-ve-tut (touch-and-hold) efekti için
        homeButton.addEventListener('touchstart', function() {
            this.classList.add('hover-effect');
        });
        
        homeButton.addEventListener('touchend', function() {
            this.classList.remove('hover-effect');
        });
    }
}

/**
 * Erişilebilirlik iyileştirmeleri
 */
function enhanceAccessibility() {
    // SVG elementlerine erişilebilirlik özellikleri ekle
    const errorSvg = document.querySelector('.error-image svg');
    if (errorSvg && !errorSvg.getAttribute('aria-labelledby')) {
        errorSvg.setAttribute('role', 'img');
        errorSvg.setAttribute('aria-labelledby', 'error-svg-title');
        
        // SVG için başlık ekle
        if (!document.getElementById('error-svg-title')) {
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.id = 'error-svg-title';
            const isEnglish = window.location.pathname.includes('/en/');
            title.textContent = isEnglish ? 'Broken pencil illustration' : 'Kırık kalem illüstrasyonu';
            errorSvg.insertBefore(title, errorSvg.firstChild);
        }
    }
    
    // Bağlantılar için erişilebilirlik iyileştirmeleri
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        // Dış bağlantılar için güvenlik ve erişilebilirlik
        if (link.hostname !== window.location.hostname && !link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
        
        // Boş bağlantı metinlerini kontrol et
        if (link.textContent.trim() === '' && !link.getAttribute('aria-label')) {
            const nextText = link.nextElementSibling?.textContent || '';
            const isEnglish = window.location.pathname.includes('/en/');
            link.setAttribute('aria-label', nextText || (isEnglish ? 'Link' : 'Bağlantı'));
        }
        
        // Mevcut sayfa bağlantılarına aria-current ekle
        if (link.href === window.location.href) {
            link.setAttribute('aria-current', 'page');
        }
    });
    
    // Klavye erişilebilirliği için tüm etkileşimli elementlere focus yönetimi
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    interactiveElements.forEach(element => {
        // Focus görünürlüğünü sağla
        element.addEventListener('focus', function() {
            this.classList.add('focus-visible');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focus-visible');
        });
    });
}

/**
 * 404 hatasını loglama ve analiz
 */
function logPageNotFound() {
    // 404 hatasına sebep olan URL'yi al
    const requestedURL = window.location.href;
    const referrerURL = document.referrer;
    
    // Konsola log
    console.log(`404 Hatası: ${requestedURL}`);
    if (referrerURL) {
        console.log(`Referrer: ${referrerURL}`);
    }
    
    // Gelecekte sunucu taraflı loglama için veri gönderme işlevi
    // Bu şu anda sadece örnek olarak burada duruyor
    /*
    fetch('/api/log-404', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            requestedURL,
            referrerURL,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        })
    }).catch(error => console.error('Loglama hatası:', error));
    */
}

/**
 * Performans ölçümü
 */
function measurePerformance() {
    // Sayfa yükleme süresini ölç
    window.addEventListener('load', function() {
        setTimeout(function() {
            const loadTime = Math.round(performance.now() - startTime);
            console.log(`404 sayfası yükleme süresi: ${loadTime}ms`);
            
            // Web Vitals ölçümü
            if ('PerformanceObserver' in window) {
                try {
                    // LCP (Largest Contentful Paint) ölçümü
                    const lcpObserver = new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        console.log('LCP:', Math.round(lastEntry.startTime), 'ms');
                    });
                    
                    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
                    
                    // FID (First Input Delay) ölçümü
                    const fidObserver = new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries();
                        for (const entry of entries) {
                            console.log('FID:', Math.round(entry.processingStart - entry.startTime), 'ms');
                        }
                    });
                    
                    fidObserver.observe({ type: 'first-input', buffered: true });
                    
                    // CLS (Cumulative Layout Shift) ölçümü
                    const clsObserver = new PerformanceObserver((entryList) => {
                        let clsValue = 0;
                        for (const entry of entryList.getEntries()) {
                            if (!entry.hadRecentInput) {
                                clsValue += entry.value;
                            }
                        }
                        console.log('CLS:', clsValue.toFixed(3));
                    });
                    
                    clsObserver.observe({ type: 'layout-shift', buffered: true });
                } catch (e) {
                    console.warn('Performance API desteklenmiyor:', e);
                }
            }
            
            // Resource Timing API ile kaynak yükleme performansı
            if (window.performance && window.performance.getEntriesByType) {
                const resources = window.performance.getEntriesByType('resource');
                const slowResources = resources
                    .filter(resource => resource.duration > 500) // 500ms'den uzun süren kaynaklar
                    .map(resource => ({
                        name: resource.name.split('/').pop(),
                        duration: Math.round(resource.duration)
                    }));
                
                if (slowResources.length > 0) {
                    console.log('Yavaş yüklenen kaynaklar:', slowResources);
                }
            }
        }, 0);
    });
}

/**
 * Tarayıcı uyumluluğu için temel geliştirmeler
 */
// Element.matches polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// Polyfill for Element.closest()
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        let el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}
