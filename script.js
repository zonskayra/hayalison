// ===== MODERN JAVASCRIPT FOR ARTISAN WEBSITE =====

// DOM Elements - Will be populated after DOM loads
let elements = {};

// Function to get DOM elements
function getElements() {
    elements = {
        header: document.getElementById('header'),
        navToggle: document.querySelector('.nav-toggle'),
        nav: document.querySelector('.nav'),
        navOverlay: document.querySelector('.nav-overlay'),
        navLinks: document.querySelectorAll('.nav-link'),
        typewriter: document.getElementById('typewriter'),
        backToTop: document.getElementById('backToTop'),
        testimonials: document.querySelectorAll('.testimonial'),
        testimonialDots: document.querySelectorAll('.dot')
    };
    
    return elements;
}

// ===== SVG ICON OPTIMIZATION =====
// Force resize all SVG icons to 10px for consistency
function optimizeSVGIcons() {
    const svgIcons = document.querySelectorAll('.feature-icon svg, .luxury-feature svg');
    svgIcons.forEach(svg => {
        svg.setAttribute('width', '10');
        svg.setAttribute('height', '10');
        svg.style.setProperty('width', '10px', 'important');
        svg.style.setProperty('height', '10px', 'important');
        svg.style.setProperty('min-width', '10px', 'important');
        svg.style.setProperty('max-width', '10px', 'important');
        svg.style.setProperty('min-height', '10px', 'important');
        svg.style.setProperty('max-height', '10px', 'important');
    });
    console.log(`🔧 ${svgIcons.length} SVG icons optimized to 10px`);
}

// ===== UTILITY FUNCTIONS =====
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// ===== TYPEWRITER EFFECT =====
class TypeWriter {
    constructor(element, words, typeSpeed = 150, deleteSpeed = 100, delayBetweenWords = 2000) {
        this.element = element;
        this.words = words;
        this.typeSpeed = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.delayBetweenWords = delayBetweenWords;
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentWord.length) {
            typeSpeed = this.delayBetweenWords;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== ENHANCED NAVIGATION FUNCTIONALITY - TASK 1.3 =====
class Navigation {
    constructor() {
        this.isMenuOpen = false;
        this.focusedBeforeModal = null;
        this.scrollbarWidth = this.getScrollbarWidth();
        this.isIOSSafari = this.detectIOSSafari();
        this.supportsTouch = 'ontouchstart' in window;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupSmoothScrolling();
        this.setupAccessibility();
        this.setupIOSFixes();
        this.setupTouchGestures();
    }

    bindEvents() {
        // Mobile menu toggle
        elements.navToggle?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });
        
        // Close menu when clicking nav links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking overlay
        elements.navOverlay?.addEventListener('click', (e) => {
            if (this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
                elements.navToggle?.focus();
            }
            
            // Tab trapping when menu is open
            if (e.key === 'Tab' && this.isMenuOpen) {
                this.handleTabTrapping(e);
            }
        });

        // Handle orientation change (mobile)
        window.addEventListener('orientationchange', () => {
            if (this.isMenuOpen) {
                // Delay to handle viewport changes
                setTimeout(() => this.updateMenuPosition(), 200);
            }
        });

        // Handle resize events
        window.addEventListener('resize', debounce(() => {
            if (this.isMenuOpen) {
                this.updateMenuPosition();
            }
        }, 150));
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;
        
        // Store currently focused element
        this.focusedBeforeModal = document.activeElement;
        
        // Add classes
        elements.nav?.classList.add('active');
        elements.navToggle?.classList.add('active');
        document.body.classList.add('nav-open');
        
        // Enhanced body scroll lock with scrollbar compensation
        this.lockBodyScroll();
        
        // iOS Safari specific fixes
        if (this.isIOSSafari) {
            this.applyIOSScrollFix();
        }
        
        // Update ARIA states
        elements.navToggle?.setAttribute('aria-expanded', 'true');
        elements.nav?.setAttribute('aria-hidden', 'false');
        
        // Focus management
        setTimeout(() => {
            elements.nav?.classList.remove('nav-animating');
            this.focusFirstMenuItem();
        }, 300);
        
    }

    closeMenu() {
        this.isMenuOpen = false;
        
        // Remove classes with animation
        elements.nav?.classList.remove('active');
        elements.navToggle?.classList.remove('active');
        document.body.classList.remove('nav-open');
        
        // Restore body scroll
        this.unlockBodyScroll();
        
        // iOS Safari cleanup
        if (this.isIOSSafari) {
            this.removeIOSScrollFix();
        }
        
        // Update ARIA states
        elements.navToggle?.setAttribute('aria-expanded', 'false');
        elements.nav?.setAttribute('aria-hidden', 'true');
        
        // Restore focus
        if (this.focusedBeforeModal) {
            this.focusedBeforeModal.focus();
            this.focusedBeforeModal = null;
        }
        
    }

    // Enhanced body scroll lock with scrollbar compensation
    lockBodyScroll() {
        const scrollY = window.scrollY;
        
        // Store current scroll position
        document.body.style.setProperty('--scroll-y', `${scrollY}px`);
        
        // Apply scroll lock with scrollbar compensation
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.paddingRight = `${this.scrollbarWidth}px`;
        
        // Lock header as well to prevent layout shift
        if (elements.header) {
            elements.header.style.paddingRight = `${this.scrollbarWidth}px`;
        }
    }

    unlockBodyScroll() {
        const scrollY = document.body.style.getPropertyValue('--scroll-y');
        const scrollYValue = scrollY ? parseInt(scrollY) : 0;
        
        // Remove scroll lock styles
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.paddingRight = '';
        
        // Restore header padding
        if (elements.header) {
            elements.header.style.paddingRight = '';
        }
        
        // Restore scroll position
        window.scrollTo(0, scrollYValue);
    }

    // iOS Safari specific fixes
    detectIOSSafari() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        return isIOS || (isSafari && 'ontouchstart' in window);
    }

    applyIOSScrollFix() {
        // Fix iOS Safari viewport issues
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            this.originalViewport = viewport.content;
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
        
        // Prevent iOS bounce scrolling
        document.addEventListener('touchmove', this.preventIOSBounce, { passive: false });
    }

    removeIOSScrollFix() {
        // Restore original viewport
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && this.originalViewport) {
            viewport.content = this.originalViewport;
        }
        
        // Remove bounce prevention
        document.removeEventListener('touchmove', this.preventIOSBounce);
    }

    preventIOSBounce(e) {
        e.preventDefault();
    }

    // Touch gesture enhancements
    setupTouchGestures() {
        if (!this.supportsTouch) return;
        
        let startY = 0;
        let startX = 0;
        
        elements.nav?.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        elements.nav?.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const deltaY = currentY - startY;
            const deltaX = currentX - startX;
            
            // Prevent scroll when menu is open
            if (this.isMenuOpen) {
                e.preventDefault();
            }
            
            // Swipe to close (right swipe > 100px)
            if (deltaX > 100 && Math.abs(deltaY) < 50) {
                this.closeMenu();
            }
        }, { passive: false });
    }

    // Enhanced accessibility
    setupAccessibility() {
        // Setup ARIA attributes
        elements.navToggle?.setAttribute('aria-expanded', 'false');
        elements.navToggle?.setAttribute('aria-controls', 'nav');
        elements.navToggle?.setAttribute('aria-label', 'Toggle navigation menu');
        
        elements.nav?.setAttribute('aria-hidden', 'true');
        elements.nav?.setAttribute('role', 'navigation');
        elements.nav?.setAttribute('aria-label', 'Main navigation');
    }

    setupIOSFixes() {
        // Additional iOS Safari fixes
        if (this.isIOSSafari) {
            // Fix iOS Safari address bar height issues
            const setVH = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };
            
            setVH();
            window.addEventListener('resize', setVH);
            window.addEventListener('orientationchange', () => {
                setTimeout(setVH, 500);
            });
        }
    }

    // Tab trapping for accessibility
    handleTabTrapping(e) {
        const focusableElements = elements.nav?.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    focusFirstMenuItem() {
        const firstLink = elements.nav?.querySelector('a, button');
        firstLink?.focus();
    }

    updateMenuPosition() {
        // Recalculate menu positioning on resize/orientation change
        if (this.isMenuOpen && elements.nav) {
            // Force repaint
            elements.nav.style.display = 'none';
            elements.nav.offsetHeight; // Trigger reflow
            elements.nav.style.display = '';
        }
    }


    getScrollbarWidth() {
        // Calculate scrollbar width for layout compensation
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);
        
        const inner = document.createElement('div');
        outer.appendChild(inner);
        
        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        
        return scrollbarWidth;
    }

    setupSmoothScrolling() {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Only handle internal links
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    
                    if (targetSection) {
                        this.closeMenu();
                        
                        setTimeout(() => {
                            const headerHeight = elements.header?.offsetHeight || 0;
                            const targetPosition = targetSection.offsetTop - headerHeight - 20;
                            
                            // Smooth scroll with enhanced timing
                            window.scrollTo({
                                top: Math.max(0, targetPosition),
                                behavior: 'smooth'
                            });
                        }, 300);
                    }
                }
            });
        });
    }
}

// ===== HEADER SCROLL EFFECT =====
class HeaderController {
    constructor() {
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        this.handleScroll = throttle(this.handleScroll.bind(this), 16);
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class when scrolling down
        if (currentScrollY > 100) {
            elements.header.classList.add('scrolled');
        } else {
            elements.header.classList.remove('scrolled');
        }

        this.lastScrollY = currentScrollY;
    }
}

// ===== TESTIMONIALS SLIDER =====
class TestimonialSlider {
    constructor() {
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        this.init();
    }

    init() {
        this.showTestimonial(this.currentIndex);
        this.startAutoPlay();
        this.bindEvents();
    }

    bindEvents() {
        // Pause autoplay on hover
        const slider = document.querySelector('.testimonials-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => this.stopAutoPlay());
            slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevTestimonial();
            if (e.key === 'ArrowRight') this.nextTestimonial();
        });
    }

    showTestimonial(index) {
        elements.testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });

        elements.testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    nextTestimonial() {
        this.currentIndex = (this.currentIndex + 1) % elements.testimonials.length;
        this.showTestimonial(this.currentIndex);
    }

    prevTestimonial() {
        this.currentIndex = this.currentIndex === 0 
            ? elements.testimonials.length - 1 
            : this.currentIndex - 1;
        this.showTestimonial(this.currentIndex);
    }

    goToTestimonial(index) {
        this.currentIndex = index;
        this.showTestimonial(this.currentIndex);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextTestimonial();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for older browsers
            this.addAnimationClasses();
        }
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.options);

        this.observeElements();
    }

    observeElements() {
        const animatedElements = document.querySelectorAll(
            '[data-aos], .service-card, .feature-item, .step, .testimonial'
        );

        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }

    animateElement(element) {
        const animationType = element.getAttribute('data-aos') || 'fade-in-up';
        
        element.style.opacity = '0';
        element.style.transform = this.getInitialTransform(animationType);
        
        // Trigger animation after a small delay
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }

    getInitialTransform(animationType) {
        const transforms = {
            'fade-up': 'translateY(30px)',
            'fade-down': 'translateY(-30px)',
            'fade-left': 'translateX(-30px)',
            'fade-right': 'translateX(30px)',
            'slide-right': 'translateX(-50px)',
            'slide-left': 'translateX(50px)',
            'zoom-in': 'scale(0.8)',
            'zoom-out': 'scale(1.2)'
        };
        
        return transforms[animationType] || 'translateY(30px)';
    }

    addAnimationClasses() {
        // Fallback for browsers without IntersectionObserver
        const elements = document.querySelectorAll('[data-aos]');
        elements.forEach(element => {
            element.classList.add('fade-in-up');
        });
    }
}

// ===== BACK TO TOP FUNCTIONALITY =====
class BackToTop {
    constructor() {
        this.init();
    }

    init() {
        this.handleScroll = throttle(this.handleScroll.bind(this), 16);
        window.addEventListener('scroll', this.handleScroll);
        
        elements.backToTop?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const shouldShow = scrollY > 300;
        
        elements.backToTop?.classList.toggle('visible', shouldShow);
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.preloadCriticalImages();
        this.setupLazyLoading();
        this.optimizeAnimations();
    }

    preloadCriticalImages() {
        const criticalImages = [
            // Add critical image paths here
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading support
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        } else {
            // Fallback for older browsers
            this.loadLazyImages();
        }
    }

    loadLazyImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeAnimations() {
        // Reduce animations for users who prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-base', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
        }
    }
}

// ===== TRENDYOL DİNAMİK LİNK SİSTEMİ =====
const trendyolLinks = {
    '8': 'https://www.trendyol.com/hayali-cizgili/8-fotograf-ozel-tasarim-boyama-kitabi-her-yasa-ozel-cocuk-gelisimi-dogum-gunu-hediye-p-944785721?boutiqueId=61&merchantId=669103&filterOverPriceListings=false&sav=true',
    '12': 'https://www.trendyol.com/hayali-cizgili/12-fotograf-ozel-tasarim-boyama-kitabi-her-yasa-ozel-cocuk-gelisimi-dogum-gunu-hediye-p-944785685?boutiqueId=61&merchantId=669103&filterOverPriceListings=false&sav=true',
    '16': 'https://www.trendyol.com/pd/hayali-cizgili/16-fotograf-ozel-tasarim-boyama-kitabi-her-yasa-ozel-cocuk-gelisimi-dogum-gunu-p-945196071?boutiqueId=61&merchantId=669103&filterOverPriceListings=false&sav=true',
    '20': 'https://www.trendyol.com/pd/hayali-cizgili/20-fotograf-ozel-tasarim-boyama-kitabi-her-yasa-ozel-cocuk-gelisimi-dogum-gunu-hediye-p-945316003?boutiqueId=61&merchantId=669103&filterOverPriceListings=false&sav=true',
    '24': 'https://www.trendyol.com/pd/hayali-cizgili/24-fotograf-ozel-tasarim-boyama-kitabi-her-yasa-ozel-cocuk-gelisimi-dogum-gunu-hediye-p-945316075?boutiqueId=61&merchantId=669103&filterOverPriceListings=false&sav=true'
};

// Trendyol linkini güncelle
function updateTrendyolLink() {
    const pageSelect = document.getElementById('pageSelect');
    const trendyolButton = document.querySelector('.btn-trendyol');
    
    if (pageSelect && trendyolButton) {
        const selectedPages = pageSelect.value;
        const trendyolLink = trendyolLinks[selectedPages];
        
        if (trendyolLink) {
            trendyolButton.setAttribute('onclick', `openTrendyolLink('${selectedPages}')`);
            console.log(`🔗 Trendyol linki güncellendi: ${selectedPages} sayfa`);
        }
    }
}

// Trendyol modalını aç
function openTrendyolLink(pages) {
    showTrendyolModal(pages);
}

// Trendyol modalını göster
function showTrendyolModal(pages = null) {
    if (!pages) {
        const pageSelect = document.getElementById('pageSelect');
        pages = pageSelect ? pageSelect.value : '8';
    }
    
    // Fiyatları hesapla
    const pageSelect = document.getElementById('pageSelect');
    const quantity = document.getElementById('quantity');
    const selectedOption = pageSelect.options[pageSelect.selectedIndex];
    const unitPrice = parseInt(selectedOption.getAttribute('data-price'));
    const qty = parseInt(quantity.value);
    const whatsappTotal = unitPrice * qty;
    // 8 sayfa için 150 TL, diğerleri için 100 TL fark
    const is8Pages = pages === '8';
    const trendyolTotal = whatsappTotal + (is8Pages ? 150 : 100);
    
    // Modal fiyatlarını güncelle
    document.getElementById('modalWhatsappPrice').textContent = `₺${whatsappTotal.toLocaleString('tr-TR')},00`;
    document.getElementById('modalTrendyolPrice').textContent = `₺${trendyolTotal.toLocaleString('tr-TR')},00`;
    document.getElementById('whatsappBtnPrice').textContent = `₺${whatsappTotal.toLocaleString('tr-TR')},00`;
    document.getElementById('trendyolBtnPrice').textContent = `₺${trendyolTotal.toLocaleString('tr-TR')},00`;
    
    // Modalı göster
    const modal = document.getElementById('trendyolModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Seçilen sayfa sayısını sakla
    modal.setAttribute('data-pages', pages);
    
    console.log(`📋 Trendyol modal açıldı - ${pages} sayfa için`);
}

// Trendyol modalını kapat
function closeTrendyolModal() {
    const modal = document.getElementById('trendyolModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    console.log(`❌ Trendyol modal kapatıldı`);
}

// WhatsApp ile devam et
function continueWithWhatsApp() {
    const pageSelect = document.getElementById('pageSelect');
    const quantity = document.getElementById('quantity');
    const selectedOption = pageSelect.options[pageSelect.selectedIndex];
    const pages = selectedOption.value;
    const qty = quantity.value;
    
    const message = `Merhabalar, ${pages} sayfalık Boyama kitabından almak istiyorum.`;
    
    window.open(`https://wa.me/908503466172?text=${message}`, '_blank');
    closeTrendyolModal();
    console.log(`📱 WhatsApp'a yönlendirildi - ${pages} sayfa, ${qty} adet`);
}

// Trendyol ile devam et
function continueWithTrendyol() {
    const modal = document.getElementById('trendyolModal');
    const pages = modal.getAttribute('data-pages');
    const link = trendyolLinks[pages];
    
    if (link) {
        window.open(link, '_blank');
        console.log(`🛒 Trendyol ${pages} sayfa ürünü açıldı`);
    } else {
        console.error(`❌ ${pages} sayfa için Trendyol linki bulunamadı`);
    }
    
    closeTrendyolModal();
}

// Modal overlay'e tıklayınca kapat
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('trendyolModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                closeTrendyolModal();
            }
        });
        
        // ESC tuşu ile modal kapat
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeTrendyolModal();
            }
        });
    }
});

// Direkt WhatsApp siparişi
function directWhatsAppOrder() {
    const pageSelect = document.getElementById('pageSelect');
    const selectedOption = pageSelect.options[pageSelect.selectedIndex];
    const pages = selectedOption.value;
    
    const message = `Merhabalar, ${pages} sayfalık Boyama kitabından almak istiyorum.`;
    
    window.open(`https://wa.me/908503466172?text=${message}`, '_blank');
    console.log(`📱 Direkt WhatsApp siparişi - ${pages} sayfa`);
}

// Global fonksiyonları erişilebilir yap
window.updateTrendyolLink = updateTrendyolLink;
window.openTrendyolLink = openTrendyolLink;
window.directWhatsAppOrder = directWhatsAppOrder;
// ===== GLOBAL FUNCTIONS FOR HTML =====
window.changeTestimonial = function(direction) {
    if (window.testimonialSlider) {
        if (direction === 1) {
            window.testimonialSlider.nextTestimonial();
        } else {
            window.testimonialSlider.prevTestimonial();
        }
    }
};

window.currentTestimonial = function(index) {
    if (window.testimonialSlider) {
        window.testimonialSlider.goToTestimonial(index);
    }
};

// ===== ERROR HANDLING =====
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }

    handleError(event) {
        console.error('JavaScript Error:', event.error);
        // Could send to analytics service
    }

    handlePromiseRejection(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        // Could send to analytics service
        event.preventDefault();
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for interactive elements
        const interactiveElements = document.querySelectorAll(
            'button, [role="button"], a, input, select, textarea, [tabindex]'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
                        e.preventDefault();
                        element.click();
                    }
                }
            });
        });
    }

    setupFocusManagement() {
        // Improved focus management
        let focusedBeforeModal = null;

        document.addEventListener('focusin', (e) => {
            // Ensure focus is visible
            e.target.setAttribute('data-focus-visible', 'true');
        });

        document.addEventListener('focusout', (e) => {
            e.target.removeAttribute('data-focus-visible');
        });
    }

    setupAriaLabels() {
        // Dynamic ARIA labels
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
    }
}

// ===== ANALYTICS INTEGRATION =====
class Analytics {
    constructor() {
        this.events = [];
        this.init();
    }

    init() {
        this.trackPageLoad();
        this.trackUserInteractions();
        this.trackPerformance();
    }

    trackPageLoad() {
        // Track page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.trackEvent('page_load', { load_time: loadTime });
        });
    }

    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, button, [role="button"]')) {
                this.trackEvent('button_click', {
                    element: e.target.textContent.trim(),
                    location: window.location.pathname
                });
            }
        });

        // Track WhatsApp clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('[href*="wa.me"]')) {
                this.trackEvent('whatsapp_click', {
                    location: window.location.pathname
                });
            }
        });
    }

    trackPerformance() {
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.trackEvent('lcp', { value: lastEntry.startTime });
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((entryList) => {
                const firstInput = entryList.getEntries()[0];
                this.trackEvent('fid', { value: firstInput.processingStart - firstInput.startTime });
            }).observe({ entryTypes: ['first-input'] });
        }
    }

    trackEvent(eventName, data = {}) {
        // Store event for potential batch sending
        this.events.push({
            name: eventName,
            data: data,
            timestamp: Date.now()
        });

        // Send to analytics service (GA4, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        console.log('Analytics Event:', eventName, data);
    }
}

// ===== INITIALIZATION =====
class App {
    constructor() {
        this.components = {};
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize all components
            this.initializeComponents();
            
            console.log('🎨 Artisan website initialized successfully!');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    initializeComponents() {
        // Get DOM elements first
        getElements();
        
        // Initialize typewriter effect
        if (elements.typewriter) {
            const words = [
                'Sanata Dönüştürün',
                'Hediyeye Çevirin',
                'Ölümsüzleştirin',
                'Kalıcı Kılın'
            ];
            new TypeWriter(elements.typewriter, words);
        }

        // Initialize core components
        this.components.navigation = new Navigation();
        this.components.headerController = new HeaderController();
        this.components.scrollAnimations = new ScrollAnimations();
        this.components.backToTop = new BackToTop();
        this.components.performanceOptimizer = new PerformanceOptimizer();
        this.components.errorHandler = new ErrorHandler();
        this.components.accessibilityEnhancements = new AccessibilityEnhancements();
        this.components.analytics = new Analytics();

        // Initialize testimonial slider
        if (elements.testimonials.length > 0) {
            window.testimonialSlider = new TestimonialSlider();
        }
    }
}

// ===== START APPLICATION =====
const app = new App();

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TypeWriter,
        Navigation,
        HeaderController,
        TestimonialSlider,
        ScrollAnimations,
        BackToTop,
        PerformanceOptimizer,
        ErrorHandler,
        AccessibilityEnhancements,
        Analytics,
        App
    };
}
// ===== YENİ OTOMATİK VİDEO SİSTEMİ =====
let videoElement = null;
let autoplayAttempted = false;

// Ana video başlatma fonksiyonu
function initiateVideoAutoplay() {
    videoElement = document.getElementById('hero-video');
    if (!videoElement) return;
    
    console.log('🚀 Otomatik video sistemi başlatılıyor...');
    setupVideoSystem();
}

// Video sistemini kur
function setupVideoSystem() {
    // Video özelliklerini ayarla
    videoElement.volume = 1.0;
    videoElement.muted = false;
    videoElement.loop = true;
    videoElement.autoplay = true;
    
    // Event listener'ları ekle
    videoElement.addEventListener('loadeddata', handleVideoLoaded);
    videoElement.addEventListener('canplay', handleVideoCanPlay);
    videoElement.addEventListener('play', handleVideoPlay);
    videoElement.addEventListener('pause', handleVideoPause);
    videoElement.addEventListener('ended', handleVideoEnded);
    
    // Hemen başlatmaya çalış
    startVideoPlayback();
}

// Video yüklendiğinde
function handleVideoLoaded() {
    console.log('📹 Video verisi yüklendi');
    if (!autoplayAttempted) {
        startVideoPlayback();
    }
}

// Video oynatılabilir durumda
function handleVideoCanPlay() {
    console.log('✅ Video oynatılabilir durumda');
    if (!autoplayAttempted) {
        startVideoPlayback();
    }
}

// Video oynatılıyor
function handleVideoPlay() {
    console.log('🎬 Video oynatılıyor');
    hidePlayButton();
}

// Video durduruldu
function handleVideoPause() {
    console.log('⏸️ Video durduruldu');
    showPlayButton();
}

// Video bitti (loop olduğu için normalde çalışmaz)
function handleVideoEnded() {
    console.log('🔄 Video bitti, yeniden başlatılıyor');
    videoElement.currentTime = 0;
    videoElement.play();
}

// Video oynatmayı başlat
function startVideoPlayback() {
    if (autoplayAttempted || !videoElement) return;
    
    autoplayAttempted = true;
    console.log('🎬 Video oynatma başlatılıyor...');
    
    // Önce sesli deneme
    videoElement.muted = false;
    videoElement.volume = 1.0;
    
    videoElement.play().then(() => {
        console.log('🎉 Video sesli başarıyla başlatıldı!');
        hidePlayButton(); // Play button'u hemen gizle
    }).catch((error) => {
        console.log('⚠️ Sesli başlatma başarısız, sessiz deneme...');
        // Sessiz başlatma
        videoElement.muted = true;
        videoElement.play().then(() => {
            console.log('🔇 Video sessiz başlatıldı');
            hidePlayButton(); // Play button'u hemen gizle
            // Kullanıcı etkileşimi bekle
            document.addEventListener('click', enableVideoSound, { once: true });
        }).catch((error) => {
            console.log('❌ Video başlatılamadı:', error);
        });
    });
}

// Kullanıcı etkileşimi ile sesi aç
function enableVideoSound() {
    if (videoElement && videoElement.muted) {
        videoElement.muted = false;
        videoElement.volume = 1.0;
        console.log('🔊 Kullanıcı etkileşimi ile ses açıldı!');
    }
}

// Kullanıcı video kontrolü (tıklama)
function toggleVideo() {
    if (!videoElement) return;
    
    console.log('👆 Kullanıcı video kontrolüne tıkladı');
    
    if (videoElement.paused) {
        // Video başlat
        videoElement.muted = false;
        videoElement.volume = 1.0;
        videoElement.play().then(() => {
            console.log('▶️ Video kullanıcı tarafından başlatıldı');
        }).catch((error) => {
            console.log('❌ Manuel başlatma hatası:', error);
        });
    } else {
        // Video durdur
        videoElement.pause();
        console.log('⏸️ Video kullanıcı tarafından durduruldu');
    }
}

// UI Kontrol Fonksiyonları
function hidePlayButton() {
    const overlay = document.querySelector('.video-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        console.log('🫥 Play button gizlendi');
    }
}

function showPlayButton() {
    const overlay = document.querySelector('.video-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        console.log('📱 Play button gösteriliyor');
    }
}

function updateVideoUI(playing) {
    if (playing) {
        hidePlayButton();
    } else {
        showPlayButton();
    }
}

// Video player initialization - YENİ SİSTEM
function initVideoPlayer() {
    const video = document.getElementById('hero-video');
    
    if (!video) {
        console.error('❌ Video elementi bulunamadı');
        return;
    }
    
    console.log('🎬 Video player başlatıldı');
    console.log('📂 Video dosyası:', video.src || video.currentSrc || 'Henüz yüklenmedi');
    
    // Autoplay sistemini başlat
    initiateVideoAutoplay();
    
    console.log('✅ Video player hazır');
}

// Global fonksiyonları HTML için erişilebilir yap
window.toggleVideo = toggleVideo;

// Volume control
window.toggleMute = function() {
    const video = document.getElementById('hero-video');
    const volumeIcon = document.getElementById('volume-icon');
    
    if (!video || !volumeIcon) return;
    
    userInteracted = true;
    
    if (video.muted) {
        video.muted = false;
        volumeIcon.classList.remove('fa-volume-mute');
        volumeIcon.classList.add('fa-volume-up');
        console.log('🔊 Video sesi açıldı (manuel)');
    } else {
        video.muted = true;
        volumeIcon.classList.remove('fa-volume-up');
        volumeIcon.classList.add('fa-volume-mute');
        console.log('🔇 Video sesi kapatıldı (manuel)');
    }
};

// Sayfa yüklendiğinde video player'ı başlat - YENİ SİSTEM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM yüklendi, video sistemi başlatılıyor...');
    setTimeout(initVideoPlayer, 1000);
    
    // SVG Icon optimization
    optimizeSVGIcons();
    setTimeout(optimizeSVGIcons, 500); // Second pass for dynamic content
    
    // Initialize typewriter effects for character speech bubbles
    initTypewriterEffects();
});
// ===== TYPEWRITER EFFECT FOR CHARACTER SPEECH BUBBLES =====
class TypewriterEffect {
    constructor(elementId, texts, staticEnd) {
        this.element = document.getElementById(elementId);
        this.texts = texts;
        this.staticEnd = staticEnd;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.init();
    }
    
    init() {
        if (this.element) {
            this.type();
        }
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        const fullText = currentText + " " + this.staticEnd;
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1) + " " + this.staticEnd;
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1) + " " + this.staticEnd;
            this.charIndex++;
        }
        
        let typeSpeedDelay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeedDelay = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
        }
        
        setTimeout(() => this.type(), typeSpeedDelay);
    }
}

// Initialize typewriter effects when DOM is loaded
function initTypewriterEffects() {
    // Mobile character speech bubble texts
    const texts1 = [
        "Sevgiline",
        "Çocuğuna",
        "Arkadaşına",
        "Eşine",
        "Annenize",
        "Babanıza"
    ];
    
    // Mobile character speech bubble texts for song product
    const texts2 = [
        "Sevgilinize",
        "Eşinize",
        "Çocuğunuza",
        "Ailenize",
        "Arkadaşınıza",
        "Kendinize"
    ];
    
    // Web character speech bubble texts
    const webTexts1 = [
        "Çocuğunuza",
        "Sevgilinize",
        "Arkadaşınıza",
        "Eşinize",
        "Annenize",
        "Babanıza"
    ];
    
    // Web character speech bubble texts
    const webTexts2 = [
        "Kızınıza",
        "Oğlunuza",
        "Sevgilinize",
        "Eşinize",
        "Ailenize",
        "Kendinize"
    ];
    
    // Start mobile typewriter effects
    setTimeout(() => {
        new TypewriterEffect('typewriter1', texts1, 'hediye mi almak istiyorsun?');
    }, 1000);
    
    setTimeout(() => {
        new TypewriterEffect('typewriter2', texts2, 'özel şarkı mı istiyorsunuz?');
    }, 1500);
    
    // Start web typewriter effects
    setTimeout(() => {
        new TypewriterEffect('typewriter-web1', webTexts1, 'hediye mi almak istiyorsunuz?');
    }, 1000);
    
    setTimeout(() => {
        new TypewriterEffect('typewriter-web2', webTexts2, 'anı mı bırakmak istiyorsunuz?');
    }, 1500);
}