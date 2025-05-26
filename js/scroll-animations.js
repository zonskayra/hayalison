/**
 * Hayali Çizgili - Scroll Animasyonları
 * Sayfa kaydırma sırasında gerçekleşen animasyonlar için JavaScript kodları
 * Güncellenmiş Versiyon - 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Scroll animasyonlarını başlat
    initScrollAnimations();
    initParallaxEffects();
    initScrollReveal();
    initSectionTransitions();
    
    // Performans optimizasyonu
    optimizeScrollPerformance();
});

/**
 * Temel scroll animasyonlarını başlat
 */
function initScrollAnimations() {
    // GSAP ve ScrollTrigger kullanarak scroll animasyonları
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero bölümü animasyonu
        gsap.from('.hero-text h1', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.hero-text',
                start: 'top 80%',
            }
        });
        
        gsap.from('.hero-text p', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.2,
            scrollTrigger: {
                trigger: '.hero-text',
                start: 'top 80%',
            }
        });
        
        gsap.from('.hero-cta', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.4,
            scrollTrigger: {
                trigger: '.hero-text',
                start: 'top 80%',
            }
        });
        
        // Ürün kartları için stagger animasyonu
        gsap.from('.product-card', {
            duration: 0.8,
            y: 100,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.products-grid',
                start: 'top 80%',
            }
        });
        
        // Özellik kartları için stagger animasyonu
        gsap.from('.feature', {
            duration: 0.8,
            scale: 0.8,
            opacity: 0,
            stagger: 0.2,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.features',
                start: 'top 80%',
            }
        });
        
        // Testimonial kartları için animasyon
        gsap.from('.testimonial-card', {
            duration: 0.8,
            x: -100,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.testimonials-container',
                start: 'top 80%',
            }
        });
        
        // CTA bölümü için animasyon
        gsap.from('#cta h2', {
            duration: 0.8,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#cta',
                start: 'top 80%',
            }
        });
        
        gsap.from('#cta p', {
            duration: 0.8,
            y: 50,
            opacity: 0,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#cta',
                start: 'top 80%',
            }
        });
        
        gsap.from('.cta-buttons', {
            duration: 0.8,
            y: 50,
            opacity: 0,
            delay: 0.4,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#cta',
                start: 'top 80%',
            }
        });
        
        // Bilgi kartları için animasyon
        gsap.from('.info-item', {
            duration: 0.8,
            y: 50,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.info-grid',
                start: 'top 80%',
            }
        });
    } else {
        console.warn('GSAP veya ScrollTrigger yüklenemedi. Scroll animasyonları devre dışı bırakıldı.');
    }
}

/**
 * Parallax efektlerini başlat
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    if (parallaxElements.length > 0) {
        // Scroll olayını dinle
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Her parallax elementi için pozisyonu güncelle
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // Hero bölümü için özel parallax efekti
    const heroSection = document.querySelector('#hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroSection && heroImage) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const heroHeight = heroSection.offsetHeight;
            
            if (scrollTop <= heroHeight) {
                const scrollPercentage = scrollTop / heroHeight;
                heroImage.style.transform = `translateY(${scrollPercentage * 50}px)`;
                heroSection.style.backgroundPositionY = `${scrollPercentage * 50}%`;
            }
        });
    }
}

/**
 * Scroll reveal animasyonlarını başlat
 */
function initScrollReveal() {
    // Animasyon sınıflarını içeren elementleri seç
    const fadeElements = document.querySelectorAll('.fade-in');
    const slideLeftElements = document.querySelectorAll('.slide-in-left');
    const slideRightElements = document.querySelectorAll('.slide-in-right');
    const slideUpElements = document.querySelectorAll('.slide-in-up');
    const slideDownElements = document.querySelectorAll('.slide-in-down');
    const scaleElements = document.querySelectorAll('.scale-in');
    
    // Tüm animasyon elementlerini bir dizide topla
    const allAnimElements = [
        ...fadeElements,
        ...slideLeftElements,
        ...slideRightElements,
        ...slideUpElements,
        ...slideDownElements,
        ...scaleElements
    ];
    
    // Intersection Observer oluştur
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Eğer element sadece bir kez animasyon yapacaksa, gözlemlemeyi durdur
                if (entry.target.classList.contains('once')) {
                    observer.unobserve(entry.target);
                }
            } else {
                // Tekrarlanan animasyonlar için sınıfı kaldır
                if (!entry.target.classList.contains('once')) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1, // elementin %10'u göründüğünde tetikle
        rootMargin: '-50px' // viewport'un 50px içinde tetikle
    });
    
    // Tüm animasyon elementlerini gözlemle
    allAnimElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Bölümler arası geçiş animasyonlarını başlat
 */
function initSectionTransitions() {
    // Dalga ayırıcıları ekle
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        // İlk bölüm hariç, her bölümün üstüne dalga ayırıcı ekle
        if (index > 0) {
            const prevSection = sections[index - 1];
            const prevBgColor = getComputedStyle(prevSection).backgroundColor;
            const currentBgColor = getComputedStyle(section).backgroundColor;
            
            // Eğer arka plan renkleri farklıysa, dalga ayırıcı ekle
            if (prevBgColor !== currentBgColor) {
                const waveDiv = document.createElement('div');
                waveDiv.className = 'wave-divider';
                
                // Dalga SVG'sini ekle
                waveDiv.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="${currentBgColor}"></path>
                    </svg>
                `;
                
                // Dalga ayırıcıyı bölümün üstüne ekle
                section.insertBefore(waveDiv, section.firstChild);
            }
        }
    });
}

/**
 * Scroll performansını optimize et
 */
function optimizeScrollPerformance() {
    // Cihaz performansını kontrol et
    const isLowPerformance = window.navigator.deviceMemory < 4 ||
                            window.navigator.hardwareConcurrency < 4 ||
                            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isLowPerformance) {
        // Düşük performanslı cihazlar için scroll animasyonlarını basitleştir
        document.documentElement.classList.add('low-performance');
        
        // Parallax efektlerini devre dışı bırak
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        parallaxElements.forEach(element => {
            element.style.transform = 'none';
        });
        
        // Dalga ayırıcıları basitleştir
        const waveDividers = document.querySelectorAll('.wave-divider');
        waveDividers.forEach(divider => {
            divider.style.height = '50px';
            divider.style.marginTop = '-50px';
        });
        
        // GSAP animasyonlarını basitleştir
        if (typeof gsap !== 'undefined') {
            gsap.defaults({
                duration: 0.5,
                ease: 'power1.out'
            });
        }
    }
    
    // Animasyonları tercih etmeyen kullanıcılar için
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Tüm animasyonları devre dışı bırak
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
            
            .wave-divider {
                height: 50px !important;
                margin-top: -50px !important;
            }
            
            .parallax-bg {
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Scroll throttling - scroll olayını optimize et
    let lastScrollTime = 0;
    const scrollThreshold = 10; // ms
    
    function throttledScroll() {
        const now = Date.now();
        if (now - lastScrollTime > scrollThreshold) {
            lastScrollTime = now;
            // Scroll işlemlerini burada yap
            window.dispatchEvent(new CustomEvent('optimized-scroll'));
        }
    }
    
    // Orijinal scroll olayı yerine throttled scroll kullan
    window.addEventListener('scroll', throttledScroll, { passive: true });
}