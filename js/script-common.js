/**
 * Hayali Çizgili - Optimize Edilmiş Ortak JavaScript Fonksiyonları
 * Performans ve kod kalitesini artırmak için yeniden düzenlenmiş
 */

// Sayfa yüklendiğinde otomatik dil yönlendirmesi yap
document.addEventListener('DOMContentLoaded', function() {
    // Ana işlevleri başlat
    initLanguageHandling();
    initMobileMenu();
    initBottomNavigation();
    initSmoothScroll();
    initLazyLoading();
    initWhatsAppButton();
    
    // Performans seviyesine göre ek özellikler
    const performanceLevel = detectDeviceCapabilities();
    if (performanceLevel !== 'low') {
        initScrollAnimations();
    }
    
    // Gizli finans erişimi
    initSecretFinanceAccess();
});

/**
 * Dil algılama ve yönlendirme
 */
function initLanguageHandling() {
    // Dil seçici elementini seç
    setupLanguageSelector();
    
    // Ana sayfada olup olmadığımızı kontrol et
    const isHomePage = window.location.pathname === '/' ||
                       window.location.pathname === '/index.html';
    
    // Daha önce seçilmiş bir dil var mı kontrol et
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    // Eğer ana sayfadaysak ve dil tercihi kaydedilmemişse
    if (isHomePage && !savedLanguage) {
        // Tarayıcı dilini al
        const browserLang = navigator.language || navigator.userLanguage;
        
        // Tarayıcı dili Türkçe ise
        if (browserLang.startsWith('tr')) {
            window.location.href = '/tr/index.html';
        }
        // Tarayıcı dili Türkçe değilse
        else {
            window.location.href = '/en/index.html';
        }
    }
}

/**
 * Dil seçicisini ayarla
 */
function setupLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    if (!languageSelector) return;
    
    // Mevcut sayfanın URL'ini al
    const currentUrl = window.location.pathname;
    
    // Hangi sayfada olduğumuzu ve hangi dilde olduğumuzu belirle
    let currentPage = '';
    let isInTr = false;
    let isInEn = false;
    
    // Alt klasördeyse (ürünler/products) kontrol et
    const isInSubfolder = currentUrl.includes('/urunler/') || currentUrl.includes('/products/');
    
    // Mevcut dili belirle
    if (currentUrl.includes('/tr/')) {
        isInTr = true;
    } else if (currentUrl.includes('/en/')) {
        isInEn = true;
    }
    
    // Sayfa adını belirle ve karşılığını bul
    let trPageName = '';
    let enPageName = '';
    
    if (currentUrl.includes('hakkimizda') || currentUrl.includes('about-us')) {
        trPageName = 'hakkimizda.html';
        enPageName = 'about-us.html';
    } else if (currentUrl.includes('iletisim') || currentUrl.includes('contact')) {
        trPageName = 'iletisim.html';
        enPageName = 'contact.html';
    } else if (currentUrl.includes('nasil-calisir') || currentUrl.includes('how-it-works')) {
        trPageName = 'nasil-calisir.html';
        enPageName = 'how-it-works.html';
    } else if (currentUrl.includes('neden-biz') || currentUrl.includes('why-us')) {
        trPageName = 'neden-biz.html';
        enPageName = 'why-us.html';
    } else if (currentUrl.includes('urunler') || currentUrl.includes('products')) {
        trPageName = 'urunler/index.html';
        enPageName = 'products/index.html';
    } else {
        trPageName = 'index.html';
        enPageName = 'index.html';
    }
    
    // Göreli yolu hesapla
    let trUrl = '';
    let enUrl = '';
    
    if (isInSubfolder) {
        // Alt klasördeyse (ürünler/products sayfasında)
        if (isInTr) {
            trUrl = '#'; // Zaten TR'de
            enUrl = '../../en/' + enPageName;
        } else if (isInEn) {
            trUrl = '../../tr/' + trPageName;
            enUrl = '#'; // Zaten EN'de
        }
    } else {
        // Ana klasörde
        if (isInTr) {
            trUrl = '#'; // Zaten TR'de
            enUrl = '../en/' + enPageName;
        } else if (isInEn) {
            trUrl = '../tr/' + trPageName;
            enUrl = '#'; // Zaten EN'de
        } else {
            // Kök dizinde (genelde olmaz ama yine de)
            trUrl = 'tr/' + trPageName;
            enUrl = 'en/' + enPageName;
        }
    }
    
    // Aktif sayfada kalınacaksa link yerine # kullan
    if (trUrl === '#') {
        trUrl = 'javascript:void(0)';
    }
    if (enUrl === '#') {
        enUrl = 'javascript:void(0)';
    }
    
    // Dil seçici HTML'i oluştur
    languageSelector.innerHTML = `
        <a href="${trUrl}" class="lang-option ${isInTr ? 'active' : ''}">TR</a>
        <span class="lang-separator">|</span>
        <a href="${enUrl}" class="lang-option ${isInEn ? 'active' : ''}">EN</a>
    `;
    
    // Dil seçici linklerine tıklandığında tercihi kaydet
    const langOptions = languageSelector.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            const lang = this.textContent.toLowerCase();
            localStorage.setItem('preferredLanguage', lang);
            
            // Eğer javascript:void(0) ise tıklamayı engelle
            if (this.getAttribute('href') === 'javascript:void(0)') {
                e.preventDefault();
            }
        });
    });
}

/**
 * Mobil menü için tek bir olay kontrolcüsü kullanarak performansı artır
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.body;
    
    if (!mobileMenuToggle) return;
    
    // Event delegation kullanarak tek bir event listener ile tüm olayları yönet
    document.addEventListener('click', function(e) {
        // Mobil menü düğmesine tıklandığında
        if (e.target.closest('.mobile-menu-toggle')) {
            e.stopPropagation();
            body.classList.toggle('mobile-menu-open');
        }
        // Menü açıkken menü dışına tıklandığında menüyü kapat
        else if (body.classList.contains('mobile-menu-open') && 
                !e.target.closest('nav')) {
            body.classList.remove('mobile-menu-open');
        }
        // Menü açıkken menü linklerine tıklandığında menüyü kapat
        else if (body.classList.contains('mobile-menu-open') && 
                e.target.closest('nav ul li a')) {
            body.classList.remove('mobile-menu-open');
        }
    });
    
    // ESC tuşuna basıldığında menüyü kapat - bu ayrı bir dinleyici gerektirir
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && body.classList.contains('mobile-menu-open')) {
            body.classList.remove('mobile-menu-open');
        }
    });
}

/**
 * Alt navigasyon aktif durum kontrolü - Debounced scroll kullanarak optimizasyon
 */
function initBottomNavigation() {
    const bottomNavLinks = document.querySelectorAll('.bottom-nav a');
    if (!bottomNavLinks.length) return;
    
    // Sayfadaki tüm bölümleri al
    const sections = document.querySelectorAll('section');
    if (!sections.length) return;
    
    // Debounce fonksiyonu - performans optimizasyonu
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Hangi bölümün görünür olduğunu kontrol et
    function checkVisibleSection() {
        let currentSection = '';
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        sections.forEach(section => {
            if (!section.id) return; // id'si olmayan bölümleri atla
            
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = '#' + section.id;
            }
        });
        
        // Alt navigasyon linklerini güncelle
        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Sayfa bağlantıları için kontrol
            if (href && href.includes('#')) {
                const hashPart = href.split('#')[1];
                if (hashPart && currentSection === '#' + hashPart) {
                    link.classList.add('active');
                }
            } else if (href && isCurrentPage(href)) {
                // Farklı sayfa bağlantıları için kontrol
                link.classList.add('active');
            }
        });
    }
    
    // Mevcut sayfa kontrolü
    function isCurrentPage(href) {
        const currentPath = window.location.pathname;
        const hrefPath = href.split('?')[0]; // Query parametrelerini kaldır
        return currentPath.endsWith(hrefPath) || 
               (currentPath.endsWith('/') && hrefPath === 'index.html') ||
               (currentPath.endsWith('/index.html') && hrefPath === '');
    }
    
    // Debounce ile scroll olayını optimize et
    window.addEventListener('scroll', debounce(checkVisibleSection, 100));
    
    // Sayfa yüklendiğinde de kontrol et
    checkVisibleSection();
}

/**
 * Smooth Scroll - Performans optimizasyonlu
 */
function initSmoothScroll() {
    // Tüm anchor linklerini bul ve smooth scroll ekle
    document.addEventListener('click', function(e) {
        // Sadece # ile başlayan linkleri işle
        const target = e.target.closest('a[href^="#"]');
        if (!target) return;
        
        e.preventDefault();
        
        const targetId = target.getAttribute('href');
        
        // # işareti tek başına kullanılmışsa işlemi atla
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        // Düşük performanslı cihazlarda smooth scroll'u devre dışı bırak
        const scrollBehavior = isPoorPerformance() ? 'auto' : 'smooth';
        
        window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: scrollBehavior
        });
    });
}

/**
 * Lazy Loading özelliği
 */
function initLazyLoading() {
    // Sadece görünür hale geldiklerinde yüklenecek görseller
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if (!lazyImages.length) return;
    
    // Lazy loading için IntersectionObserver kullan
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // IntersectionObserver desteklenmeyen tarayıcılar için fallback
        setTimeout(() => {
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            });
        }, 500);
    }
}

/**
 * WhatsApp butonu için optimize edilmiş kod
 */
function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (!whatsappBtn) return;
    
    // Mobil mi kontrol et
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Mobil cihazda API'yi değiştir
    if (isMobile && whatsappBtn.href) {
        // Link'i WhatsApp mobil uygulamasına yönlendir
        whatsappBtn.href = whatsappBtn.href.replace('web.whatsapp.com', 'api.whatsapp.com');
    }
    
    // Butonun hızlıca görünmesi için
    setTimeout(() => {
        whatsappBtn.classList.add('visible');
    }, 300);
}

/**
 * Kaydırma Animasyonları - Yüksek performanslı cihazlarda
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
    
    if (!animatedElements.length) return;
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Bir kere animasyonu gösterdikten sonra gözlemlemeyi bırak
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Element %10 görünür olduğunda tetikle
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    } else {
        // IntersectionObserver desteklenmeyen tarayıcılar için fallback
        animatedElements.forEach(element => {
            element.classList.add('animated');
        });
    }
}

/**
 * Düşük performanslı cihaz kontrolü
 */
function isPoorPerformance() {
    return detectDeviceCapabilities() === 'low';
}

/**
 * Cihaz özelliklerini tespit et ve performans seviyesini belirle
 * @returns {string} 'low', 'medium' veya 'high'
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
    
    return performanceLevel;
}

/**
 * Gizli finans sistemi erişimi
 */
function initSecretFinanceAccess() {
    const secretLink = document.getElementById('secret-link');
    if (!secretLink) return;
    
    // "dır" kısmına tıklandığında finans sistemine yönlendir
    secretLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Önce mevcut oturumu temizle - güvenlik için
        try {
            localStorage.removeItem('budget_auth_token');
            localStorage.removeItem('budget_auth_time');
            localStorage.removeItem('budget_remember_me');
        } catch (err) {
            console.error('LocalStorage temizleme hatası:', err);
        }
        
        // Mevcut sayfa yolunu al
        const currentPath = window.location.pathname;
        let financeUrl = '';
        
        // TR sayfalarında mı kontrol et
        if (currentPath.includes('/tr/')) {
            // Ürünler alt klasöründe mi?
            if (currentPath.includes('/urunler/')) {
                financeUrl = '../../finans/index.html';
            } else {
                financeUrl = '../finans/index.html';
            }
        } 
        // EN sayfalarında mı kontrol et
        else if (currentPath.includes('/en/')) {
            // Products alt klasöründe mi?
            if (currentPath.includes('/products/')) {
                financeUrl = '../../finans/index.html';
            } else {
                financeUrl = '../finans/index.html';
            }
        }
        // Ana dizinde
        else {
            financeUrl = 'finans/index.html';
        }
        
        // Finans sistemine yönlendir - oturum temizlendiği için şifre sorulacak
        window.location.href = financeUrl;
    });
    
    // Görünümde hiçbir değişiklik olmaması için cursor stilini koru
    secretLink.style.cursor = 'inherit';
}
