/**
 * Hayali Çizgili - Gelişmiş Buton ve Geçiş Animasyonları
 * Daha modern ve interaktif kullanıcı deneyimi için ek JavaScript fonksiyonları
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ana geliştirmeleri uygula
    enhanceButtons();
    addPageTransitions();
    addMagneticEffect();
    enhanceScrollBehavior();
    initTestimonialCarousel();
    addParallaxEffects();
    optimizeForPerformance();
});

/**
 * Tüm butonlar için gelişmiş efektler
 */
function enhanceButtons() {
    // Gelişmiş dalgalanma (ripple) efekti
    const buttons = document.querySelectorAll('.cta-primary, .cta-secondary, .btn-3d, .btn-glass, .btn-neumorphic, .carousel-control, .mobile-menu-toggle, .cta-button a');
    
    buttons.forEach(button => {
        // Dalgalanma efekti için tıklama olayı
        button.addEventListener('click', function(e) {
            // Performans kontrolü
            if (isLowPerformanceDevice()) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Merkeze göre maksimum dalgalanma boyutu hesapla
            const width = this.offsetWidth;
            const height = this.offsetHeight;
            const maxDimension = Math.max(width, height);
            const scale = maxDimension / 50 * 3; // Maksimum boyut faktörü
            
            // Buton rengini al ve dalgalanma rengini ayarla
            const computedStyle = window.getComputedStyle(this);
            const bgColor = computedStyle.backgroundColor;
            let useColoredRipple = false;
            
            // Renk RGB/RGBA formatında mı kontrol et
            if (bgColor.includes('rgb')) {
                const rgbValues = bgColor.match(/\d+/g);
                if (rgbValues && rgbValues.length >= 3) {
                    useColoredRipple = true;
                }
            }
            
            // Çoklu dalgalanma efekti oluştur
            for (let i = 0; i < 2; i++) {
                const ripple = document.createElement('span');
                ripple.classList.add('enhanced-ripple');
                
                if (useColoredRipple) {
                    ripple.classList.add('enhanced-ripple--color');
                }
                
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                // Farklı boyutlar ve gecikmeler
                ripple.style.setProperty('--scale', scale - i * 0.5);
                ripple.style.setProperty('--delay', `${i * 100}ms`);
                
                this.appendChild(ripple);
                
                // Animasyon bitince elementi kaldır
                ripple.style.animation = `enhanced-ripple ${0.8 + i * 0.1}s ease-out ${i * 0.1}s forwards`;
                
                setTimeout(() => {
                    ripple.remove();
                }, 1000 + i * 100);
            }
        });
        
        // Mouse takip eden ışıldama efekti
        button.addEventListener('mousemove', function(e) {
            // Performans kontrolü
            if (isLowPerformanceDevice()) return;
            if (!window.matchMedia('(hover: hover)').matches) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Parlaklık efekti için CSS değişkenlerini güncelle
            this.style.setProperty('--x', `${x}px`);
            this.style.setProperty('--y', `${y}px`);
            this.classList.add('mouse-tracking-glow');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('mouse-tracking-glow');
        });
    });
    
    // Butonlarda özel vurgulamalar - Sitenin genelinde dikkat çekmesi gereken butonlara pulse efekti ekle
    const primaryCTAs = document.querySelectorAll('.cta-primary');
    if (primaryCTAs.length > 0) {
        // Sayfada ilk gördüğümüz primary CTA'ya nabız efekti ekle
        setTimeout(() => {
            const firstCTA = primaryCTAs[0];
            firstCTA.classList.add('pulse-animation');
            
            // Bir kullanıcı etkileşimi olduğunda efekti kaldır
            firstCTA.addEventListener('click', function() {
                this.classList.remove('pulse-animation');
            });
            
            // Ya da belirli bir süre sonra efekti kaldır
            setTimeout(() => {
                firstCTA.classList.remove('pulse-animation');
            }, 10000); // 10 saniye sonra kaldır
        }, 2000); // Sayfa yüklendikten 2 saniye sonra başlat
    }
    
    // WhatsApp buton geliştirmeleri
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('mouseover', function() {
            this.classList.add('heartbeat');
        });
        
        whatsappBtn.addEventListener('mouseout', function() {
            this.classList.remove('heartbeat');
        });
        
        // Mobil dokunma efekti
        whatsappBtn.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        whatsappBtn.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
            setTimeout(() => {
                this.classList.add('heartbeat');
                setTimeout(() => {
                    this.classList.remove('heartbeat');
                }, 1000);
            }, 300);
        }, { passive: true });
    }
    
    // Dokunmatik cihazlar için özel efektler
    if ('ontouchstart' in window) {
        const touchTargets = document.querySelectorAll('.touch-target, .btn-3d, .btn-glass, .btn-neumorphic, .cta-primary, .cta-secondary');
        
        touchTargets.forEach(target => {
            target.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
                
                // Dokunma geri bildirimi (titreşim) - destekleyen cihazlarda
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, { passive: true });
            
            target.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    }
}

/**
 * Sayfa geçişlerini iyileştir
 */
function addPageTransitions() {
    // Tüm navigasyon linkleri için geçiş animasyonları ekle
    const navigationLinks = document.querySelectorAll('nav a, .bottom-nav a');
    
    navigationLinks.forEach(link => {
        // Aynı domain içindeki bağlantıları animasyonlu yap
        if (link.hostname === window.location.hostname && !link.hasAttribute('target')) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Aynı sayfaya bağlantıları kontrol et, hash bağlantıları için özel işlem yapma
                if (href.startsWith('#') || href === window.location.pathname) return;
                
                e.preventDefault();
                
                // Sayfa geçiş animasyonu
                document.body.classList.add('page-transition-out');
                
                // Animasyon tamamlandıktan sonra sayfaya git
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        }
    });
    
    // Sayfa yüklendiğinde giriş animasyonu
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            // Sayfaya geri dönüldüğünde
            document.body.classList.remove('page-transition-out');
            document.body.classList.add('page-transition-in');
            
            setTimeout(() => {
                document.body.classList.remove('page-transition-in');
            }, 500);
        } else {
            // Sayfa ilk yüklendiğinde
            document.body.classList.add('page-transition-in');
            
            setTimeout(() => {
                document.body.classList.remove('page-transition-in');
            }, 500);
        }
    });
    
    // Sayfa geçiş stili ekle
    const style = document.createElement('style');
    style.textContent = `
        .page-transition-out {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .page-transition-in {
            opacity: 0;
            transform: translateY(-10px);
            animation: fadeIn 0.5s forwards;
        }
        
        @keyframes fadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Manyetik buton efekti ekle
 */
function addMagneticEffect() {
    // Hover desteği olan cihazlarda çalış
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (isLowPerformanceDevice()) return;
    
    const magneticButtons = document.querySelectorAll('.cta-primary, .btn-3d, .cta-button a');
    
    magneticButtons.forEach(button => {
        const buttonBounding = button.getBoundingClientRect();
        const buttonHeight = buttonBounding.height;
        const buttonWidth = buttonBounding.width;
        const magneticStrength = Math.min(buttonHeight, buttonWidth) * 0.3;
        
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Merkeze göre fare pozisyonu (-1 ile 1 arasında)
            const ratioX = (e.clientX - centerX) / (rect.width / 2);
            const ratioY = (e.clientY - centerY) / (rect.height / 2);
            
            // Manyetik çekim efekti - hareket miktarını sınırla
            const moveX = ratioX * magneticStrength;
            const moveY = ratioY * magneticStrength;
            
            this.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            // İçindeki ikonu daha fazla hareket ettir
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = `translate(${moveX * 1.5}px, ${moveY * 1.5}px)`;
            }
        });
        
        button.addEventListener('mouseleave', function() {
            // Pozisyonu yumuşak bir şekilde sıfırla
            this.style.transition = 'transform 0.5s ease-out';
            this.style.transform = 'translate(0, 0)';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transition = 'transform 0.5s ease-out';
                icon.style.transform = 'translate(0, 0)';
            }
            
            // Transition'ı sıfırla
            setTimeout(() => {
                this.style.transition = '';
                if (icon) icon.style.transition = '';
            }, 500);
        });
    });
}

/**
 * Kaydırma davranışını geliştir
 */
function enhanceScrollBehavior() {
    // Yumuşak kaydırma için tüm iç bağlantıları kontrol et
    const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Hedef elementin pozisyonunu hesapla
                const offset = 80; // Üst menü için boşluk
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                // Yumuşak kaydırma
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // URL'yi güncelle
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });
    
    // Sayfa yüklendiğinde hash varsa o bölüme kaydır
    if (location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(location.hash);
            if (targetElement) {
                const offset = 80; // Üst menü için boşluk
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 500); // Sayfa tamamen yüklendikten sonra
    }
}

/**
 * Testimonial carousel'ını iyileştir
 */
function initTestimonialCarousel() {
    const testimonialsContainer = document.querySelector('.testimonials-slider');
    if (!testimonialsContainer) return;
    
    const testimonials = testimonialsContainer.querySelectorAll('.testimonial-card');
    if (testimonials.length <= 1) return;
    
    // Testimonials için dot göstergeleri oluştur
    const dotsContainer = document.querySelector('.carousel-dots');
    if (dotsContainer) {
        dotsContainer.innerHTML = ''; // Mevcut noktaları temizle
        
        testimonials.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Testimonial ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });
    }
    
    // Kontrol butonları
    const controlsContainer = document.querySelector('.carousel-controls');
    let prevButton, nextButton;
    
    if (controlsContainer) {
        prevButton = controlsContainer.querySelector('.prev');
        nextButton = controlsContainer.querySelector('.next');
    }
    
    // Aktif yorumu güncelle
    let currentIndex = 0;
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : null;
    
    function updateActiveTestimonial(index) {
        const previousActive = testimonialsContainer.querySelector('.testimonial-card.active');
        
        // Aktif elemanı güncelle
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        
        // Geçiş efekti ekle
        if (previousActive) {
            previousActive.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                previousActive.style.animation = '';
                previousActive.classList.remove('active');
                
                // Yeni aktif elementi göster
                testimonials[index].classList.add('active');
                testimonials[index].style.animation = 'fadeIn 0.3s forwards';
            }, 300);
        } else {
            testimonials[index].classList.add('active');
        }
        
        // Dot göstergelerini güncelle
        if (dots) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        }
    }
    
    // Önceki yoruma geç
    function goToPrevSlide() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        updateActiveTestimonial(currentIndex);
    }
    
    // Sonraki yoruma geç
    function goToNextSlide() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateActiveTestimonial(currentIndex);
    }
    
    // Nokta göstergelerine tıklandığında
    if (dots) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                if (currentIndex === index) return;
                clearInterval(slideInterval); // Otomatik kaydırmayı durdur
                currentIndex = index;
                updateActiveTestimonial(currentIndex);
                slideInterval = setInterval(autoSlide, autoSlideInterval); // Otomatik kaydırmayı yeniden başlat
            });
        });
    }
    
    // Kontrol butonlarına tıklandığında
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            clearInterval(slideInterval); // Otomatik kaydırmayı durdur
            goToPrevSlide();
            slideInterval = setInterval(autoSlide, autoSlideInterval); // Otomatik kaydırmayı yeniden başlat
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            clearInterval(slideInterval); // Otomatik kaydırmayı durdur
            goToNextSlide();
            slideInterval = setInterval(autoSlide, autoSlideInterval); // Otomatik kaydırmayı yeniden başlat
        });
    }
    
    // Otomatik kaydırma
    const autoSlideInterval = 5000; // 5 saniye
    
    function autoSlide() {
        goToNextSlide();
    }
    
    // Otomatik kaydırmayı başlat
    let slideInterval = setInterval(autoSlide, autoSlideInterval);
    
    // Kullanıcı etkileşiminde otomatik kaydırmayı durdur ve yeniden başlat
    const carouselArea = document.querySelector('#testimonials');
    if (carouselArea) {
        carouselArea.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        carouselArea.addEventListener('mouseleave', function() {
            slideInterval = setInterval(autoSlide, autoSlideInterval);
        });
        
        // Dokunmatik cihazlar için
        carouselArea.addEventListener('touchstart', function() {
            clearInterval(slideInterval);
        }, { passive: true });
        
        carouselArea.addEventListener('touchend', function() {
            slideInterval = setInterval(autoSlide, autoSlideInterval);
        }, { passive: true });
    }
    
    // Animasyon CSS'i ekle
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Dokunmatik kaydırma (swipe) desteği
    let touchStartX = 0;
    let touchEndX = 0;
    
    testimonialsContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    testimonialsContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const threshold = 50; // Minimum kaydırma mesafesi
        
        if (touchStartX - touchEndX > threshold) {
            // Sola kaydırma - sonraki slide
            clearInterval(slideInterval);
            goToNextSlide();
            slideInterval = setInterval(autoSlide, autoSlideInterval);
        }
        
        if (touchEndX - touchStartX > threshold) {
            // Sağa kaydırma - önceki slide
            clearInterval(slideInterval);
            goToPrevSlide();
            slideInterval = setInterval(autoSlide, autoSlideInterval);
        }
    }
}

/**
 * Paralaks efektleri ekle
 */
function addParallaxEffects() {
    // Hero bölümü için paralaks efekti
    const hero = document.querySelector('#hero');
    if (!hero) return;
    if (isLowPerformanceDevice()) return; // Düşük performanslı cihazlarda çalıştırma
    
    // Hero bölümündeki animasyonlu elementler
    const animatedElements = hero.querySelectorAll('.hero-element, .path, .rainbow, .planet, .brush, .ball, .butterfly, .shape, .star');
    
    // Kaydırma olayı
    window.addEventListener('scroll', function() {
        // Hero bölümünün görünür olup olmadığını kontrol et
        const heroRect = hero.getBoundingClientRect();
        if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) return;
        
        // Paralaks efekti için kaydırma miktarını hesapla
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollFactor = scrollTop * 0.3;
        
        // Hero arka planını kaydır
        hero.style.backgroundPosition = `center ${scrollFactor}px`;
        
        // Animasyonlu elementlerin paralaks efekti
        animatedElements.forEach((element, index) => {
            // Her element için farklı hız faktörü
            const speedFactor = 0.05 + (index % 3) * 0.03;
            const yMove = scrollTop * speedFactor;
            
            // Y-ekseninde paralaks efekti
            element.style.transform = `translateY(${yMove}px)`;
        });
    });
    
    // Hero bölümündeki SVG elementler için boyut değiştirme animasyonu
    const svgElements = hero.querySelectorAll('svg');
    
    svgElements.forEach(svg => {
        // Fare hareketi ile boyut değiştirme
        hero.addEventListener('mousemove', function(e) {
            // Fare pozisyonuna göre hareket
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
            
            // SVG elementlerini fare hareketine göre yeniden konumlandır
            svg.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    });
}

/**
 * Performans optimizasyonu
 */
function optimizeForPerformance() {
    // Düşük performanslı cihazlarda bazı özellikleri devre dışı bırak
    if (isLowPerformanceDevice()) {
        document.documentElement.classList.add('low-performance');
        
        // Animasyon miktarını azaltmak için ek CSS kuralları
        const style = document.createElement('style');
        style.textContent = `
            .low-performance .enhanced-ripple {
                display: none !important;
            }
            
            .low-performance .mouse-tracking-glow {
                background-image: none !important;
            }
            
            .low-performance .hero-element {
                animation-duration: 10s !important;
            }
            
            .low-performance .btn-glass {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Görünmez elemanların animasyonlarını durdur (sayfa performansı için)
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Görünürlüğe göre animasyon sınıfları ekle/kaldır
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    entry.target.classList.remove('is-hidden');
                } else {
                    entry.target.classList.remove('is-visible');
                    entry.target.classList.add('is-hidden');
                }
            });
        }, { threshold: 0.1 }); // Elemanın %10'u görünür olduğunda tetikle
        
        // Animasyonlu tüm elementleri izle
        const animatedElements = document.querySelectorAll('.hero-element, .animated-element, .path, .rainbow, .planet, .brush, .ball, .butterfly, .shape, .star');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
        
        // Animasyon durdurmak için ek CSS
        const style = document.createElement('style');
        style.textContent = `
            .is-hidden {
                animation-play-state: paused !important;
            }
            
            .is-visible {
                animation-play-state: running !important;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Düşük performanslı cihazları tespit et
 */
function isLowPerformanceDevice() {
    // Bellek kapasitesi
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    // CPU çekirdek sayısı
    const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    // Mobil cihaz kontrolü
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Tarayıcı hafif animasyonları tercih ediyor mu?
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Kullanıcı cihazı şarj oluyor mu?
    let isLowPower = false;
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            isLowPower = !battery.charging && battery.level < 0.15; // %15'in altında ve şarj olmuyor
        });
    }
    
    return lowMemory || lowCPU || (isMobile && (prefersReducedMotion || isLowPower));
}

// Sayfa CSS'ini ekle
function addStyleSheet() {
    // enhanced-buttons.css dosyasını ekle
    if (!document.querySelector('link[href*="enhanced-buttons.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '../css/enhanced-buttons.css';
        document.head.appendChild(link);
    }
}

// Stil dosyasını ekle
addStyleSheet();
