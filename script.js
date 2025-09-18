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

// ===== SMOOTH SCROLL FUNCTIONALITY =====
function smoothScroll(target, duration = 800) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;

    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// ===== NAVIGATION FUNCTIONALITY =====
class Navigation {
    constructor() {
        this.header = document.getElementById('header');
        this.navToggle = document.querySelector('.nav-toggle');
        this.nav = document.querySelector('.nav');
        this.navOverlay = document.querySelector('.nav-overlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        this.scrollThreshold = 100;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Overlay click to close menu
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    smoothScroll(href);
                    this.closeMobileMenu();
                }
            });
        });

        // Scroll handling with throttling
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 10));

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.nav?.contains(e.target) && !this.navToggle?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        document.body.classList.add('menu-open');
        this.nav?.classList.add('nav-open');
        this.navOverlay?.classList.add('overlay-visible');
        
        // Prevent background scroll
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        document.body.classList.remove('menu-open');
        this.nav?.classList.remove('nav-open');
        this.navOverlay?.classList.remove('overlay-visible');
        
        // Restore background scroll
        document.body.style.overflow = '';
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        if (this.header) {
            if (scrollTop > this.scrollThreshold) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }
    }
}

// ===== BACK TO TOP FUNCTIONALITY =====
class BackToTop {
    constructor() {
        this.backToTopBtn = document.getElementById('backToTop');
        this.scrollThreshold = 300;
        this.init();
    }

    init() {
        if (!this.backToTopBtn) return;
        
        this.backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });

        window.addEventListener('scroll', throttle(() => {
            this.toggleVisibility();
        }, 100));

        // Initial check
        this.toggleVisibility();
    }

    toggleVisibility() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > this.scrollThreshold) {
            this.backToTopBtn.classList.add('visible');
        } else {
            this.backToTopBtn.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        // Unobserve after animation to improve performance
                        this.observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);

            // Observe elements with animation classes
            const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right, .bounce-in, .zoom-in');
            animatedElements.forEach(element => {
                this.observer.observe(element);
            });
        }
    }
}

// ===== TESTIMONIALS CAROUSEL =====
class TestimonialsCarousel {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial');
        this.dots = document.querySelectorAll('.dot');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        this.init();
    }

    init() {
        if (this.testimonials.length === 0) return;

        this.bindEvents();
        this.showTestimonial(0);
        this.startAutoplay();
    }

    bindEvents() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showTestimonial(index);
                this.resetAutoplay();
            });
        });

        // Pause autoplay on hover
        const testimonialContainer = document.querySelector('.testimonials-container');
        if (testimonialContainer) {
            testimonialContainer.addEventListener('mouseenter', () => {
                this.pauseAutoplay();
            });

            testimonialContainer.addEventListener('mouseleave', () => {
                this.startAutoplay();
            });
        }
    }

    showTestimonial(index) {
        // Hide all testimonials
        this.testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });

        // Remove active class from all dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current testimonial
        if (this.testimonials[index]) {
            this.testimonials[index].classList.add('active');
        }

        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }

        this.currentIndex = index;
    }

    nextTestimonial() {
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.showTestimonial(nextIndex);
    }

    startAutoplay() {
        if (this.testimonials.length <= 1) return;
        
        this.autoplayInterval = setInterval(() => {
            this.nextTestimonial();
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
        this.startAutoplay();
    }
}

// ===== FORM HANDLING =====
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Add form validation here
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        this.showLoadingState(form);

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            this.showSuccessState(form);
        }, 2000);
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Bu alan zorunludur.');
                isValid = false;
            } else {
                this.hideFieldError(field);
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        let errorElement = field.parentNode.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    hideFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showLoadingState(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Gönderiliyor...';
        }
    }

    showSuccessState(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Gönderildi ✓';
            submitBtn.classList.add('success');
            
            setTimeout(() => {
                submitBtn.textContent = 'Gönder';
                submitBtn.classList.remove('success');
            }, 3000);
        }

        // Reset form
        form.reset();
    }
}

// ===== LAZY LOADING =====
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            });

            this.images.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            this.images.forEach(img => {
                this.loadImage(img);
            });
        }
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        img.onload = () => {
            img.classList.add('loaded');
        };

        img.src = src;
        img.removeAttribute('data-src');
    }
}

// ===== MODAL FUNCTIONALITY =====
class Modal {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.init();
    }

    init() {
        // Modal triggers
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                this.openModal(modalId);
            });
        });

        // Close buttons
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeActiveModal();
            });
        });

        // Close on overlay click
        this.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeActiveModal();
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.add('active');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';

        // Focus first focusable element
        const focusableElement = modal.querySelector('input, textarea, button, [tabindex]');
        if (focusableElement) {
            setTimeout(() => focusableElement.focus(), 100);
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }

    closeActiveModal() {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            this.closeModal(activeModal);
        }
    }
}

// ===== TYPEWRITER EFFECT =====
class TypewriterEffect {
    constructor(elementId, texts, suffix = '') {
        this.element = document.getElementById(elementId);
        this.texts = texts;
        this.suffix = suffix;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        if (this.element) {
            this.init();
        }
    }

    init() {
        this.element.style.borderRight = '2px solid #007bff';
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1) + ' ' + this.suffix;
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1) + ' ' + this.suffix;
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? 100 : 150;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before next text
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typewriter effects
function initTypewriters() {
    // Mobile character speech bubble texts
    const texts1 = [
        "Çocuğuna",
        "Sevgilisine",
        "Arkadaşına",
        "Eşine",
        "Annesine",
        "Babasına"
    ];
    
    // Mobile character speech bubble texts
    const texts2 = [
        "Kızına",
        "Oğluna",
        "Sevgilisine",
        "Eşine",
        "Ailesine",
        "Kendine"
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

// ===== BASIT VE GÜVENİLİR CAROUSEL SİSTEMİ =====
class ProductShowcaseCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.items = container.querySelectorAll('.showcase-item');
        this.indicators = container.querySelectorAll('.indicator');
        
        // Basit state management
        this.currentIndex = 0;
        this.isAnimating = false;
        this.isMobile = window.innerWidth <= 768;
        
        // Touch tracking
        this.touchStartX = 0;
        this.touchStartTime = 0;
        this.isDragging = false;
        this.minSwipeDistance = 50;
        
        // Autoplay - 10 saniye her slide
        this.autoplayInterval = null;
        this.autoplayDelay = 10000; // 10 saniye
        
        this.init();
    }
    
    init() {
        if (!this.container || !this.track || this.items.length === 0) return;
        
        this.setupEventListeners();
        this.goToSlide(0);
        this.startAutoplay();
    }
    
    setupEventListeners() {
        // Desktop Indicator tıklama - her zaman çalışsın
        this.indicators.forEach((indicator, index) => {
            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (this.isAnimating) return;
                
                this.goToSlide(index);
                this.resetAutoplay();
            };
            
            // Desktop için click eventi
            indicator.addEventListener('click', handleClick);
            
            // Keyboard support
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick(e);
                }
            });
        });
        
        // Mobile için sadece otomatik geçiş - manual kontrol yok
        if (this.isMobile) {
            this.setupVideoAutoAdvance();
        }
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.goToSlide(this.currentIndex);
        });
        
        // Hover pause (desktop only)
        if (!this.isMobile) {
            this.container.addEventListener('mouseenter', () => {
                this.pauseAutoplay();
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.startAutoplay();
            });
        }
    }
    
    setupTouchEvents() {
        this.container.addEventListener('touchstart', (e) => {
            if (this.isAnimating) return;
            
            this.touchStartX = e.touches[0].clientX;
            this.touchStartTime = Date.now();
            this.isDragging = true;
            this.pauseAutoplay();
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndTime = Date.now();
            const deltaX = this.touchStartX - touchEndX;
            const deltaTime = touchEndTime - this.touchStartTime;
            
            this.isDragging = false;
            
            // Sadece hızlı swipe'lara respond et
            if (Math.abs(deltaX) > this.minSwipeDistance && deltaTime < 300) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            this.resetAutoplay();
        }, { passive: true });
    }
    
    setupVideoAutoAdvance() {
        // Video bittiğinde otomatik geçiş için event listener'lar
        this.items.forEach((item, index) => {
            const video = item.querySelector('video');
            if (video) {
                video.addEventListener('ended', () => {
                    // Sadece aktif slide'daki video bittiğinde geç
                    if (index === this.currentIndex && !this.isDragging && !this.isAnimating) {
                        setTimeout(() => {
                            this.nextSlide();
                        }, 1000); // 1 saniye bekle sonra geç
                    }
                });
            }
        });
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.items.length || this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        
        // Animation
        const translateX = -index * 33.33;
        this.track.style.transform = `translateX(${translateX}%)`;
        this.track.style.transition = 'transform 0.3s ease';
        
        // Update indicators
        this.indicators.forEach((indicator, i) => {
            const isActive = i === index;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-pressed', isActive.toString());
            indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
            indicator.setAttribute('aria-label', `Ürün ${i + 1}${isActive ? ' (şu anda aktif)' : ''}`);
        });
        
        // Update items
        this.items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
            this.handleVideoState(item, i === index);
        });
        
        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }
    
    handleVideoState(item, isActive) {
        const video = item.querySelector('video');
        const img = item.querySelector('img');
        
        if (!video) return;
        
        if (isActive) {
            // Aktif slide - video hazırla
            video.preload = 'auto';
            video.load();
            
            if (this.isMobile) {
                // Mobile - sadece video göster, kontroller tamamen gizli
                video.controls = false;
                video.setAttribute('playsinline', 'true');
                video.setAttribute('webkit-playsinline', 'true');
                video.muted = true; // Sessiz oynat
                
                if (!video.hasAttribute('data-mobile-handler')) {
                    video.setAttribute('data-mobile-handler', 'true');
                }
                
                // Her slide geçişinde videoyu otomatik başlat
                setTimeout(() => {
                    video.currentTime = 0;
                    video.play().catch(() => {
                        // Autoplay failed - ignore, video will start when possible
                    });
                }, 100);
                
            } else {
                // Desktop - hover sistemi kalsın (görsel → video geçişi)
                video.controls = false; // Desktop'ta kontroller gizli
                
                if (!item.hasAttribute('data-desktop-handler')) {
                    item.addEventListener('mouseenter', () => {
                        if (video.readyState >= 2) {
                            video.currentTime = 0;
                            video.play().catch(() => {});
                        }
                    });
                    
                    item.addEventListener('mouseleave', () => {
                        video.pause();
                        video.currentTime = 0;
                    });
                    
                    item.setAttribute('data-desktop-handler', 'true');
                }
            }
        } else {
            // Aktif olmayan slide - video durdur
            video.pause();
            video.currentTime = 0;
            
            if (this.isMobile) {
                video.controls = false;
                video.muted = true;
            }
        }
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            if (!this.isDragging && !this.isAnimating) {
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
        setTimeout(() => this.startAutoplay(), 1000); // 1 saniye bekle
    }
    
    destroy() {
        this.pauseAutoplay();
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

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    getElements();
    
    // Initialize all modules
    new Navigation();
    new BackToTop();
    new AnimationObserver();
    new TestimonialsCarousel();
    new FormHandler();
    new LazyLoader();
    new Modal();
    
    // Initialize typewriter effects
    initTypewriters();
    
    // Initialize product carousel
    initializeProductCarousel();
    
    // Optimize SVG icons
    optimizeSVGIcons();
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const loadTime = navigation.loadEventEnd - navigation.fetchStart;
                
                // Track load time for analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_load_time', {
                        event_category: 'Performance',
                        value: Math.round(loadTime)
                    });
                }
            }, 100);
        });
    }
});
