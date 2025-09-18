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
        // role is redundant for <nav>; keeping aria-label only
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

// ===== ÇİÇEKSEPETİ DİNAMİK LİNK SİSTEMİ =====
const ciceksepetiLinks = {
    '8': 'https://www.ciceksepeti.com/8-fotograf-ozel-tasarim-boyama-kitabi-her-yasa-ozel-cocuk-gelisimi-dogum-gunu-hediye-kcm4642802',
    '12': 'https://www.ciceksepeti.com/12-fotograf-ozel-tasarim-boyama-kitabi-her-yasa-ozel-cocuk-gelisimi-dogum-gunu-hediye-kcm64084183'
};

// Çiçeksepeti linkini güncelle
function updateCiceksepetiLink() {
    const pageSelect = document.getElementById('pageSelect');
    const ciceksepetiButton = document.getElementById('ciceksepetiBtn');
    
    if (pageSelect && ciceksepetiButton) {
        const selectedPages = pageSelect.value;
        const ciceksepetiLink = ciceksepetiLinks[selectedPages];
        
        if (ciceksepetiLink) {
            // 8 ve 12 sayfa için butonu göster
            ciceksepetiButton.style.display = 'inline-flex';
            ciceksepetiButton.setAttribute('onclick', `openCiceksepetiLink('${selectedPages}')`);
        } else {
            // Diğer sayfa sayıları için butonu gizle
            ciceksepetiButton.style.display = 'none';
        }
    }
}

// Çiçeksepeti linkini aç (modal sistemi ile)
function openCiceksepetiLink(pages) {
    showCiceksepetiModal(pages);
}

// Trendyol linkini güncelle
function updateTrendyolLink() {
    const pageSelect = document.getElementById('pageSelect');
    const trendyolButton = document.querySelector('.btn-trendyol');
    
    if (pageSelect && trendyolButton) {
        const selectedPages = pageSelect.value;
        const trendyolLink = trendyolLinks[selectedPages];
        
        if (trendyolLink) {
            trendyolButton.setAttribute('onclick', `openTrendyolLink('${selectedPages}')`);
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
    // Tüm sayfa seçenekleri için 150 TL fark
    const trendyolTotal = whatsappTotal + 150;
    
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
    
}

// Trendyol modalını kapat
function closeTrendyolModal() {
    const modal = document.getElementById('trendyolModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
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
}

// Trendyol ile devam et
function continueWithTrendyol() {
    const modal = document.getElementById('trendyolModal');
    const pages = modal.getAttribute('data-pages');
    const link = trendyolLinks[pages];
    
    if (link) {
        window.open(link, '_blank');
    } else {
    }
    
    closeTrendyolModal();
}

// ===== ÇİÇEKSEPETİ MODAL SİSTEMİ =====
// ÇiçekSepeti modalını aç
function openCiceksepetiModal(pages) {
    showCiceksepetiModal(pages);
}

// ÇiçekSepeti modalını göster
function showCiceksepetiModal(pages = null) {
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
    // 8 ve 12 sayfa için 100 TL fark
    const ciceksepetiTotal = whatsappTotal + 100;
    
    // Modal fiyatlarını güncelle
    document.getElementById('modalWhatsappPriceCicek').textContent = `₺${whatsappTotal.toLocaleString('tr-TR')},00`;
    document.getElementById('modalCiceksepetiPrice').textContent = `₺${ciceksepetiTotal.toLocaleString('tr-TR')},00`;
    document.getElementById('whatsappBtnPriceCicek').textContent = `₺${whatsappTotal.toLocaleString('tr-TR')},00`;
    document.getElementById('ciceksetepiBtnPrice').textContent = `₺${ciceksepetiTotal.toLocaleString('tr-TR')},00`;
    
    // Modalı göster
    const modal = document.getElementById('ciceksepetiModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Seçilen sayfa sayısını sakla
    modal.setAttribute('data-pages', pages);
    
}

// ÇiçekSepeti modalını kapat
function closeCiceksepetiModal() {
    const modal = document.getElementById('ciceksepetiModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ÇiçekSepeti ile devam et
function continueWithCiceksepeti() {
    const modal = document.getElementById('ciceksepetiModal');
    const pages = modal.getAttribute('data-pages');
    const link = ciceksepetiLinks[pages];
    
    if (link) {
        window.open(link, '_blank');
    } else {
    }
    
    closeCiceksepetiModal();
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
    
    // ÇiçekSepeti Modal Event Listeners
    const ciceksepetiModal = document.getElementById('ciceksepetiModal');
    if (ciceksepetiModal) {
        ciceksepetiModal.addEventListener('click', function(e) {
            if (e.target === ciceksepetiModal || e.target.classList.contains('modal-overlay')) {
                closeCiceksepetiModal();
            }
        });
        
        // ESC tuşu ile ÇiçekSepeti modal kapat
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && ciceksepetiModal.classList.contains('active')) {
                closeCiceksepetiModal();
            }
        });
    }
});

// Version seçimi için global değişken
window.selectedVersion = 'standard'; // Varsayılan olarak standart

// Version seçim fonksiyonu
function selectVersion(version) {
    window.selectedVersion = version;
    
    // Tüm version kartlarından active class'ı kaldır
    document.querySelectorAll('.version-card').forEach(card => {
        card.classList.remove('active', 'selected');
        card.setAttribute('aria-pressed', 'false');
    });
    
    // Seçilen karta active class ekle
    const selectedCard = document.querySelector(`.version-card[data-version="${version}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active', 'selected');
        selectedCard.setAttribute('aria-pressed', 'true');
    }
    
    // Dropdown'daki fiyatları güncelle
    updateDropdownPrices(version);
    
    // Satın alma butonlarını göster/gizle
    updatePurchaseButtons(version);
    
    // Fiyatları güncelle
    if (typeof window.updatePrice === 'function') {
        window.updatePrice();
    } else if (typeof updatePrice === 'function') {
        updatePrice();
    }
    
}

// Satın alma butonlarını güncelleme fonksiyonu
function updatePurchaseButtons(version) {
    const alternativePurchase = document.querySelector('.alternative-purchase');
    const trendyolBtn = document.querySelector('.btn-trendyol');
    const ciceksepetiBtn = document.querySelector('#ciceksepetiBtn');
    const dividerText = document.querySelector('.divider-text');
    
    if (version === 'premium') {
        // Fotoğraflı versiyonda Trendyol ve Çiçeksepeti butonlarını gizle
        if (alternativePurchase) {
            alternativePurchase.style.display = 'none';
        }
    } else {
        // Standart versiyonda butonları göster
        if (alternativePurchase) {
            alternativePurchase.style.display = 'block';
        }
        // Çiçeksepeti butonunu kontrol et (sayfa sayısına göre)
        if (typeof updateCiceksepetiLink === 'function') {
            updateCiceksepetiLink();
        }
    }
}

// Dropdown fiyatlarını güncelleme fonksiyonu
function updateDropdownPrices(version) {
    const pageSelect = document.getElementById('pageSelect');
    if (!pageSelect) return;
    
    const standardPrices = {8: 450, 12: 500, 16: 550, 20: 600, 24: 650};
    const premiumPrices = {8: 750, 12: 850, 16: 950, 20: 1050, 24: 1150};
    
    const prices = version === 'premium' ? premiumPrices : standardPrices;
    
    // Her option'ı güncelle
    Array.from(pageSelect.options).forEach(option => {
        const pages = parseInt(option.value);
        const price = prices[pages];
        if (price) {
            option.text = `${pages} Sayfa - ₺${price.toLocaleString('tr-TR')},00`;
            option.setAttribute('data-price', price);
        }
    });
    
}

// Fiyat verileri
const priceData = {
    standard: {
        name: 'Standart Boyama Kitabı',
        prices: {
            8: 450,
            12: 500,
            16: 550,
            20: 600,
            24: 650
        }
    },
    premium: {
        name: 'Fotoğraflı Boyama Kitabı',
        prices: {
            8: 750,
            12: 850,
            16: 950,
            20: 1050,
            24: 1150
        }
    }
};

// Direkt WhatsApp siparişi
function directWhatsAppOrder() {
    const pageSelect = document.getElementById('pageSelect');
    const quantity = document.getElementById('quantity');
    const selectedOption = pageSelect.options[pageSelect.selectedIndex];
    const pages = parseInt(selectedOption.value);
    const qty = quantity ? parseInt(quantity.value) : 1;
    
    // Sayfa kontrolü - urun2.html masal kitabı sayfası mı?
    const isStoryBookPage = window.location.pathname.includes('urun2.html') || document.title.includes('Masal Kitabı');
    
    if (isStoryBookPage) {
        // MASAL KİTABI İÇİN ÖZEL MESAJ
        const storyBookPrices = { 8: 550, 12: 600, 16: 650, 20: 700, 24: 750 };
        const unitPrice = storyBookPrices[pages];
        const totalPrice = unitPrice * qty;
        
        const message = `Merhaba! Kişiye özel masal kitabı sipariş etmek istiyorum.

📕 Ürün: Kişiye Özel Masal Kitabı
📄 Sayfa Sayısı: ${pages} sayfa
🔢 Adet: ${qty}
💰 Toplam: ₺${totalPrice.toLocaleString('tr-TR')},00
📦 Ücretsiz kargo
📕 Ücretsiz kapak tasarımı
✨ Ne zaman isterseniz kelimeleri gönderebilirsiniz, ben hemen masalını yazmaya başlarım 😊

Sipariş detayları için görüşelim.`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/908503466172?text=${encodedMessage}`, '_blank');
        return;
    }
    
    // BOYAMA KİTABI İÇİN MEVCUT MESAJ (urun1.html)
    // Seçilen versiyona göre fiyat al
    const versionData = window.selectedVersion === 'premium' ? priceData.premium : priceData.standard;
    const unitPrice = versionData.prices[pages];
    const standardPrice = priceData.standard.prices[pages];
    const totalPrice = unitPrice * qty;
    
    // Version bilgisini al
    const versionName = window.selectedVersion === 'premium' ? 'Fotoğraflı' : 'Standart';
    const versionDescription = window.selectedVersion === 'premium'
        ? '(Sol sayfada fotoğraflarım, sağ sayfada boyama çizimi olacak şekilde)'
        : '(Sadece boyama sayfaları - renksiz çizim)';
    
    // Fiyat detayları
    const priceDifference = unitPrice - standardPrice;
    const priceBreakdown = window.selectedVersion === 'premium'
        ? `
💵 Birim Fiyat: ₺${unitPrice} (Standart: ₺${standardPrice} + Fotoğraf eklentisi: ₺${priceDifference})`
        : `
💵 Birim Fiyat: ₺${unitPrice}`;
    
    // Detaylı mesaj oluştur
    const message = `🎨 Merhaba Hayali Çizgili,

Kişiye Özel Boyama Kitabı siparişi vermek istiyorum:

📚 Versiyon: ${versionName} ${versionDescription}
📄 Sayfa Sayısı: ${pages} sayfa
🔢 Adet: ${qty}${priceBreakdown}
💰 Toplam Tutar: ₺${totalPrice}

${window.selectedVersion === 'premium'
    ? '📸 Not: Fotoğraflarımı size göndereceğim, sol sayfada fotoğraf, sağ sayfada boyama olacak şekilde hazırlanmasını istiyorum.'
    : '✏️ Not: Klasik boyama kitabı istiyorum, sadece boyama sayfaları olsun.'}

Lütfen sipariş detayları hakkında bilgi verir misiniz?`;
    
    // URL encode the message
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/908503466172?text=${encodedMessage}`, '_blank');
}

// Global fonksiyonları erişilebilir yap
window.updateTrendyolLink = updateTrendyolLink;
window.updateCiceksepetiLink = updateCiceksepetiLink;
window.openTrendyolLink = openTrendyolLink;
window.openCiceksepetiLink = openCiceksepetiLink;
window.openCiceksepetiModal = openCiceksepetiModal;
window.closeCiceksepetiModal = closeCiceksepetiModal;
window.continueWithCiceksepeti = continueWithCiceksepeti;
window.directWhatsAppOrder = directWhatsAppOrder;
window.selectVersion = selectVersion;
window.updateDropdownPrices = updateDropdownPrices;
window.updatePurchaseButtons = updatePurchaseButtons;
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
        // Could send to analytics service
    }

    handlePromiseRejection(event) {
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
            
            
        } catch (error) {
            
        }
    }

    initializeComponents() {
        // Get DOM elements first
        getElements();
        
        // Initialize typewriter effect
        
        if (elements.typewriter) {
            
            // Use the working TypewriterEffect class instead
            const words = [
                'Sanata Dönüştürün',
                'Hediyeye Çevirin',
                'Ölümsüzleştirin',
                'Kalıcı Kılın'
            ];
            // Clear any existing content
            elements.typewriter.textContent = '';
            new TypewriterEffect('typewriter', words, '');
            
        } else {
            
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
                
            })
            .catch(registrationError => {
                
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
    
    
    setupVideoSystem();
}

// Video sistemini kur
function setupVideoSystem() {
    // Video özelliklerini ayarla
    videoElement.volume = 1.0;
    videoElement.muted = true;
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
    
    if (!autoplayAttempted) {
        startVideoPlayback();
    }
}

// Video oynatılabilir durumda
function handleVideoCanPlay() {
    
    if (!autoplayAttempted) {
        startVideoPlayback();
    }
}

// Video oynatılıyor
function handleVideoPlay() {
    
    hidePlayButton();
}

// Video durduruldu
function handleVideoPause() {
    
    showPlayButton();
}

// Video bitti (loop olduğu için normalde çalışmaz)
function handleVideoEnded() {
    
    videoElement.currentTime = 0;
    videoElement.play();
}

// Video oynatmayı başlat
function startVideoPlayback() {
    if (autoplayAttempted || !videoElement) return;
    
    autoplayAttempted = true;
    
    
    // Sessiz başlatma (autoplay uyumluluğu için)
    videoElement.muted = true;
    videoElement.volume = 1.0;

    videoElement.play().then(() => {
        
        hidePlayButton(); // Play button'u hemen gizle
        // Kullanıcı etkileşimi ile sesi aç
        document.addEventListener('click', enableVideoSound, { once: true });
    }).catch((error) => {
        
    });
}

// Kullanıcı etkileşimi ile sesi aç
function enableVideoSound() {
    if (videoElement && videoElement.muted) {
        videoElement.muted = false;
        videoElement.volume = 1.0;
        
    }
}

// Basit ses açma/kapama fonksiyonu
function toggleVideo() {
    const videoEl = document.getElementById('hero-video');
    if (!videoEl) {
        
        return;
    }
    
    
    
    // Video her zaman çalır durumda, sadece ses açma/kapama
    if (videoEl.muted) {
        // Sesi aç
        videoEl.muted = false;
        videoEl.volume = 1.0;
        
        showSoundFeedback('🔊', 'Ses Açıldı');
    } else {
        // Sesi kapat
        videoEl.muted = true;
        
        showSoundFeedback('🔇', 'Ses Kapatıldı');
    }
}

// Basit ses feedback gösterme fonksiyonu
function showSoundFeedback(icon, text) {
    // Mevcut feedback'i temizle
    const existingFeedback = document.querySelector('.sound-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Yeni feedback elementi oluştur
    const feedback = document.createElement('div');
    feedback.className = 'sound-feedback';
    feedback.innerHTML = `
        <div class="sound-icon">${icon}</div>
        <div class="sound-text">${text}</div>
    `;
    
    // Feedback için basit stil ekle
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: 600;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        backdrop-filter: blur(10px);
        animation: fadeInOut 1.5s ease-in-out forwards;
    `;
    
    // Animasyon CSS'ini ekle
    if (!document.querySelector('#sound-feedback-style')) {
        const style = document.createElement('style');
        style.id = 'sound-feedback-style';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(feedback);
    
    // 1.5 saniye sonra temizle
    setTimeout(() => {
        if (feedback && feedback.parentNode) {
            feedback.remove();
        }
    }, 1500);
}

// UI Kontrol Fonksiyonları
function hidePlayButton() {
    const overlay = document.querySelector('.video-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        
    }
}

function showPlayButton() {
    const overlay = document.querySelector('.video-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        
    }
}

function updateVideoUI(playing) {
    if (playing) {
        hidePlayButton();
    } else {
        showPlayButton();
    }
}

// Video player initialization - ENHANCED SAFETY
function initVideoPlayer() {
    const video = document.getElementById('hero-video');
    
    if (!video) {
        
        return;
    }
    
    
    
    
    // Autoplay sistemini başlat
    initiateVideoAutoplay();
    
    
}

// Global fonksiyonları HTML için erişilebilir yap
window.toggleVideo = toggleVideo;


// Enhanced Hero Video Autoplay Function - SHOWCASE ITEM COMPATIBLE
function forceHeroVideoAutoplay() {
    const heroVideo = document.getElementById('hero-video');
    if (!heroVideo) {
        
        return;
    }

    
    
    // Browser autoplay requirements
    heroVideo.muted = true;
    heroVideo.loop = true;
    heroVideo.autoplay = true;
    heroVideo.playsInline = true;
    
    // Multiple attempts for different browser behaviors
    const startVideo = () => {
        heroVideo.play().then(() => {
            
        }).catch(err => {
            
            // Fallback attempts
            setTimeout(() => {
                heroVideo.play().catch(e => {
                    // Failed autoplay attempt
                }); 
            }, 500);
        });
    };

    // Immediate start attempt
    startVideo();
    
    // Additional attempts for stubborn browsers
    setTimeout(startVideo, 100);
    setTimeout(startVideo, 500);
}

// Sayfa yüklendiğinde video player'ı başlat - YENİ SİSTEM
document.addEventListener('DOMContentLoaded', () => {
    
    
    // Enhanced Hero Video Autoplay - IMMEDIATE
    forceHeroVideoAutoplay();
    
    setTimeout(initVideoPlayer, 1000);
    
    
    // SVG Icon optimization
    optimizeSVGIcons();
    setTimeout(optimizeSVGIcons, 500); // Second pass for dynamic content
    
    // Initialize typewriter effects for character speech bubbles
    initTypewriterEffects();
    
    // Initialize Product Carousel
    initializeProductCarousel();

    // A11y: Play button keyboard support (Enter/Space)
    const playBtn = document.querySelector('.play-button');
    if (playBtn) {
        playBtn.addEventListener('keydown', (e) => {
            const key = e.key || e.code;
            if (key === 'Enter' || key === ' ') {
                e.preventDefault();
                try {
                    toggleVideo();
                } catch (err) {
                    
                }
            }
        });
    }
});

// Additional autoplay triggers for maximum compatibility
window.addEventListener('load', () => {
    // Secondary autoplay attempt after full page load
    setTimeout(forceHeroVideoAutoplay, 200);
});

// Intersection Observer for viewport-based autoplay (fallback)
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target.querySelector('#hero-video');
                if (video && video.paused) {
                    video.play().catch(e => {
                        // Intersection autoplay failed
                    }); 
                }
            }
        });
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            observer.observe(heroSection);
        }
    });
}
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

// ===== PRODUCT SHOWCASE CAROUSEL FUNCTIONALITY =====
class ProductShowcaseCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.items = container.querySelectorAll('.showcase-item');
        this.indicators = container.querySelectorAll('.indicator');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 saniye (mobil için biraz daha uzun)
        
        // Touch/swipe properties
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.isDragging = false;
        this.minSwipeDistance = 50;
        this.isAnimating = false;
        this.hasUserInteracted = false;
        
        // Performance optimizations
        this.useIntersectionObserver = 'IntersectionObserver' in window;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }
    
    init() {
        if (!this.container || !this.track || this.items.length === 0) {
            
            return;
        }
        
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.preloadVideos();
        this.startAutoplay();
        
        // Set initial active state
        this.goToSlide(0);
        
        
    }
    
    setupIntersectionObserver() {
        if (!this.useIntersectionObserver) return;
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Carousel görünür olduğunda autoplay'i başlat
                    this.startAutoplay();
                } else {
                    // Carousel görünür olmadığında autoplay'i durdur (performance)
                    this.pauseAutoplay();
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.observer.observe(this.container);
    }
    
    preloadVideos() {
        // İlk 2 video'yu preload et (performance)
        this.items.forEach((item, index) => {
            const video = item.querySelector('video');
            if (video && index < 2) {
                video.preload = 'metadata';
                video.load();
            }
        });
    }
    
    setupEventListeners() {
        // Enhanced Indicator click events with mobile optimization
        this.indicators.forEach((indicator, index) => {
            // Mobile-first approach: use touchend for better responsiveness
            if (this.isMobile) {
                indicator.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.isDragging || this.isAnimating) return;
                    this.goToSlide(index);
                    this.resetAutoplay();
                }, { passive: false });
                
                // Prevent click event on mobile to avoid double firing
                indicator.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, { passive: false });
            } else {
                // Desktop click events
                indicator.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (this.isAnimating) return;
                    this.goToSlide(index);
                    this.resetAutoplay();
                });
            }
            
            // Keyboard support for indicators
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (this.isAnimating) return;
                    this.goToSlide(index);
                    this.resetAutoplay();
                }
            });
        });
        
        // Container hover pause/resume (desktop only)
        if (!this.isMobile) {
            this.container.addEventListener('mouseenter', () => {
                this.pauseAutoplay();
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.startAutoplay();
            });
        }
        
        // Enhanced Video hover events (desktop only)
        if (!this.isMobile) {
            this.items.forEach((item, index) => {
                const video = item.querySelector('video');
                const img = item.querySelector('img');
                
                if (video && img) {
                    let hoverTimeout;
                    
                    item.addEventListener('mouseenter', () => {
                        // Delay video start to prevent accidental triggers
                        hoverTimeout = setTimeout(() => {
                            if (video.readyState >= 2) { // Video loaded
                                video.currentTime = 0;
                                video.play().catch(e => {
                                    // Video play error
                                });
                            }
                        }, 300);
                    });
                    
                    item.addEventListener('mouseleave', () => {
                        clearTimeout(hoverTimeout);
                        video.pause();
                        video.currentTime = 0;
                    });
                }
            });
        }
        
        // Enhanced Keyboard navigation with focus management
        this.container.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.prevSlide();
                    this.resetAutoplay();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    this.nextSlide();
                    this.resetAutoplay();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    this.resetAutoplay();
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.items.length - 1);
                    this.resetAutoplay();
                    break;
            }
        });
        
        // Advanced Touch/Swipe support
        this.setupTouchEvents();
        
        // Visibility change handling (performance)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.startAutoplay();
            }
        });
        
        // Window resize handling
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.isMobile = window.innerWidth <= 768;
                this.updateLayout();
            }, 150);
        });
    }
    
    setupTouchEvents() {
        if (!('ontouchstart' in window)) return;
        
        this.container.addEventListener('touchstart', (e) => {
            if (this.isAnimating) return;
            
            this.isDragging = true;
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.pauseAutoplay();
            
            // Add visual feedback
            this.container.style.cursor = 'grabbing';
            
            // Hide swipe hint after first interaction
            this.hideSwipeHint();
        }, { passive: true });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!this.isDragging || this.isAnimating) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - this.touchStartX;
            const deltaY = currentY - this.touchStartY;
            
            // Prevent vertical scrolling if horizontal swipe is detected
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                e.preventDefault();
                
                // Optional: Show preview of next/prev slide during drag
                const percentage = (deltaX / this.container.offsetWidth) * 100;
                const currentTransform = -this.currentIndex * 33.33;
                const newTransform = currentTransform + (percentage * 0.3); // Dampening factor
                
                this.track.style.transform = `translateX(${newTransform}%)`;
                this.track.style.transition = 'none';
            }
        }, { passive: false });
        
        this.container.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = this.touchStartX - this.touchEndX;
            const deltaY = this.touchStartY - this.touchEndY;
            
            // Reset visual feedback
            this.container.style.cursor = '';
            this.track.style.transition = '';
            
            // Hide swipe hint after interaction
            this.hideSwipeHint();
            
            // Determine if it's a horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            } else {
                // Snap back to current slide
                this.goToSlide(this.currentIndex);
            }
            
            this.resetAutoplay();
        }, { passive: true });
        
        // Handle touch cancel (e.g., phone call during swipe)
        this.container.addEventListener('touchcancel', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.container.style.cursor = '';
                this.track.style.transition = '';
                this.goToSlide(this.currentIndex);
                this.resetAutoplay();
            }
        });
    }
    
    hideSwipeHint() {
        // Mark carousel as interacted to hide swipe hint
        this.container.classList.add('interacted');
        
        const swipeHint = this.container.querySelector('.swipe-hint');
        if (swipeHint) {
            swipeHint.style.display = 'none';
        }
    }
    
    updateLayout() {
        // Re-calculate positions on orientation change
        this.goToSlide(this.currentIndex);
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.items.length || this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        
        // Enhanced transform with better easing for mobile
        const translateX = -index * 33.33;
        this.track.style.transform = `translateX(${translateX}%)`;
        this.track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Update indicators with enhanced accessibility
        this.indicators.forEach((indicator, i) => {
            const isActive = i === index;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-pressed', isActive.toString());
            indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
            
            // Update aria-label for screen readers
            const ariaLabel = `Ürün ${i + 1}${isActive ? ' (şu anda aktif)' : ''}`;
            indicator.setAttribute('aria-label', ariaLabel);
        });
        
        // Update items active state with enhanced video handling
        this.items.forEach((item, i) => {
            const isActive = i === index;
            const video = item.querySelector('video');
            const img = item.querySelector('img');
            
            item.classList.toggle('active', isActive);
            
            if (video && img) {
                if (isActive) {
                    // Aktif slide'da video'yu hazırla
                    if (video.preload !== 'metadata') {
                        video.preload = 'metadata';
                        video.load();
                    }
                    
                    // Mobile'da user interaction sonrası video oynat
                    if (this.isMobile && !this.hasUserInteracted) {
                        // İlk user interaction'ı bekle
                        const playVideo = () => {
                            if (video.readyState >= 2) {
                                video.play().catch(() => {
                                    // Autoplay failed, video will remain as image
                                });
                            }
                            document.removeEventListener('touchend', playVideo, { once: true });
                        };
                        document.addEventListener('touchend', playVideo, { once: true });
                        this.hasUserInteracted = true;
                    } else if (!this.isMobile) {
                        // Desktop'da hover ile oynat
                        item.addEventListener('mouseenter', () => {
                            if (video.readyState >= 2) {
                                video.play().catch(() => {
                                    // Video play error - ignore
                                });
                            }
                        });
                        item.addEventListener('mouseleave', () => {
                            video.pause();
                            video.currentTime = 0;
                        });
                    }
                } else {
                    // Aktif olmayan slide'larda video'yu durdur
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
        
        // Performance: lazy load adjacent images
        this.lazyLoadAdjacentImages(index);
        
        // Reset animation flag after transition (reduced delay for better responsiveness)
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
        
        // Analytics tracking
        this.trackSlideChange(index);
    }
    
    lazyLoadAdjacentImages(currentIndex) {
        const prevIndex = (currentIndex - 1 + this.items.length) % this.items.length;
        const nextIndex = (currentIndex + 1) % this.items.length;
        
        [prevIndex, nextIndex].forEach(index => {
            const item = this.items[index];
            const video = item.querySelector('video[data-src]');
            const img = item.querySelector('img[data-src]');
            
            if (video && video.dataset.src) {
                video.src = video.dataset.src;
                delete video.dataset.src;
            }
            
            if (img && img.dataset.src) {
                img.src = img.dataset.src;
                delete img.dataset.src;
            }
        });
    }
    
    trackSlideChange(index) {
        // Simple analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'carousel_slide_change', {
                slide_index: index,
                slide_title: this.items[index].querySelector('h4')?.textContent || 'Unknown'
            });
        }
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
        if (this.autoplayInterval) return; // Already running
        
        // Don't start autoplay if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            
            return;
        }
        
        this.autoplayInterval = setInterval(() => {
            // Check if carousel is still visible before auto-advancing
            if (this.isElementVisible(this.container)) {
                this.nextSlide();
            }
        }, this.autoplayDelay);
        
        
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
            
        }
    }
    
    resetAutoplay() {
        this.pauseAutoplay();
        // Add small delay before restarting to prevent rapid cycling
        setTimeout(() => {
            this.startAutoplay();
        }, 100);
    }
    
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    destroy() {
        
        
        // Clear autoplay
        this.pauseAutoplay();
        
        // Disconnect intersection observer
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Clean up videos
        this.items.forEach(item => {
            const video = item.querySelector('video');
            if (video) {
                video.pause();
                video.src = '';
                video.load();
            }
        });
        
        // Remove event listeners by cloning nodes (prevents memory leaks)
        this.indicators.forEach(indicator => {
            indicator.replaceWith(indicator.cloneNode(true));
        });
        
        // Set references to null for garbage collection
        this.container = null;
        this.track = null;
        this.items = null;
        this.indicators = null;
    }
}

// Initialize Product Showcase Carousel when DOM is ready
function initializeProductCarousel() {
    const carousel = document.querySelector('.product-showcase-carousel');
    if (carousel) {
        
        window.productCarousel = new ProductShowcaseCarousel(carousel);
    } else {
        
    }
}
// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
});
