/* ===== DESKTOP PERFORMANCE OPTIMIZATION SYSTEM ===== */
/* Advanced performance enhancements for desktop/large screen devices */

class DesktopPerformance {
    constructor() {
        this.isDesktop = window.innerWidth >= 1024;
        this.isHighDPI = window.devicePixelRatio > 1;
        this.perfObserver = null;
        this.lastScrollTime = 0;
        this.ticking = false;
        
        this.init();
    }

    init() {
        if (!this.isDesktop) return;
        
        console.log('🖥️ Desktop Performance System başlatılıyor...');
        
        // Core desktop optimizations
        this.setupHighDPISupport();
        this.setupLargeImageOptimization();
        this.setupScrollOptimization();
        this.setupMouseOptimizations();
        this.setupKeyboardNavigation();
        this.setupDesktopAnalytics();
        this.setupLazyLoadingAdvanced();
        this.setupCriticalResourceHints();
        
        console.log('✅ Desktop Performance System aktif');
    }

    // ===== HIGH-DPI DISPLAY SUPPORT =====
    setupHighDPISupport() {
        if (!this.isHighDPI) return;
        
        console.log('🔍 High-DPI display desteği aktifleştiriliyor...');
        
        // Retina image replacement
        document.querySelectorAll('img[data-src-2x]').forEach(img => {
            if (this.isHighDPI) {
                img.src = img.dataset.src2x;
                img.srcset = `${img.dataset.src2x} 2x`;
            }
        });
        
        // Canvas high-DPI optimization
        this.optimizeCanvasForHighDPI();
        
        // SVG optimization for retina
        this.optimizeSVGForRetina();
    }

    optimizeCanvasForHighDPI() {
        document.querySelectorAll('canvas').forEach(canvas => {
            const ctx = canvas.getContext('2d');
            const devicePixelRatio = window.devicePixelRatio || 1;
            const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                                    ctx.mozBackingStorePixelRatio ||
                                    ctx.msBackingStorePixelRatio ||
                                    ctx.oBackingStorePixelRatio ||
                                    ctx.backingStorePixelRatio || 1;

            const ratio = devicePixelRatio / backingStoreRatio;

            if (devicePixelRatio !== backingStoreRatio) {
                const oldWidth = canvas.width;
                const oldHeight = canvas.height;

                canvas.width = oldWidth * ratio;
                canvas.height = oldHeight * ratio;

                canvas.style.width = oldWidth + 'px';
                canvas.style.height = oldHeight + 'px';

                ctx.scale(ratio, ratio);
            }
        });
    }

    optimizeSVGForRetina() {
        document.querySelectorAll('svg').forEach(svg => {
            if (!svg.hasAttribute('width') || !svg.hasAttribute('height')) {
                const bbox = svg.getBBox();
                svg.setAttribute('width', bbox.width);
                svg.setAttribute('height', bbox.height);
            }
        });
    }

    // ===== LARGE FORMAT IMAGE OPTIMIZATION =====
    setupLargeImageOptimization() {
        console.log('🖼️ Large format image optimization aktifleştiriliyor...');
        
        // Progressive image loading for large screens
        this.setupProgressiveImageLoading();
        
        // 4K image support
        this.setup4KImageSupport();
        
        // WebP fallback for large images
        this.setupWebPFallback();
    }

    setupProgressiveImageLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadProgressiveImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        document.querySelectorAll('img[data-src-progressive]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    loadProgressiveImage(img) {
        const lowRes = img.dataset.srcLowres;
        const highRes = img.dataset.srcProgressive;
        
        if (lowRes) {
            img.src = lowRes;
            img.classList.add('loading');
        }
        
        const highResImg = new Image();
        highResImg.onload = () => {
            img.src = highRes;
            img.classList.remove('loading');
            img.classList.add('loaded');
        };
        highResImg.src = highRes;
    }

    setup4KImageSupport() {
        if (window.innerWidth >= 2560) {
            document.querySelectorAll('img[data-src-4k]').forEach(img => {
                img.src = img.dataset.src4k;
                img.loading = 'lazy';
            });
        }
    }

    setupWebPFallback() {
        // WebP support detection for large images
        const webp = new Image();
        webp.onload = webp.onerror = () => {
            const isWebPSupported = (webp.height === 2);
            document.documentElement.classList.toggle('webp', isWebPSupported);
            
            if (isWebPSupported) {
                document.querySelectorAll('img[data-webp]').forEach(img => {
                    img.src = img.dataset.webp;
                });
            }
        };
        webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    // ===== SCROLL OPTIMIZATION =====
    setupScrollOptimization() {
        console.log('📜 Desktop scroll optimization aktifleştiriliyor...');
        
        // Smooth scroll polyfill for older browsers
        this.setupSmoothScrollPolyfill();
        
        // Scroll performance optimization
        this.setupScrollPerformance();
        
        // Parallax optimization
        this.setupParallaxOptimization();
    }

    setupSmoothScrollPolyfill() {
        if (!('scrollBehavior' in document.documentElement.style)) {
            import('smoothscroll-polyfill').then(smoothscroll => {
                smoothscroll.polyfill();
            });
        }
    }

    setupScrollPerformance() {
        let lastScrollY = 0;
        let scrollDirection = 'down';
        
        const optimizedScroll = () => {
            const currentScrollY = window.scrollY;
            scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
            lastScrollY = currentScrollY;
            
            // Header scroll behavior
            const header = document.querySelector('.web-header');
            if (header) {
                header.classList.toggle('scrolled', currentScrollY > 100);
                header.classList.toggle('scroll-up', scrollDirection === 'up' && currentScrollY > 300);
                header.classList.toggle('scroll-down', scrollDirection === 'down');
            }
            
            // Parallax elements optimization
            document.querySelectorAll('[data-parallax]').forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(currentScrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            this.ticking = false;
        };

        window.addEventListener('scroll', () => {
            this.lastScrollTime = Date.now();
            
            if (!this.ticking) {
                requestAnimationFrame(optimizedScroll);
                this.ticking = true;
            }
        }, { passive: true });
    }

    setupParallaxOptimization() {
        // Intersection Observer for parallax elements
        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                element.classList.toggle('in-viewport', entry.isIntersecting);
            });
        });

        document.querySelectorAll('[data-parallax]').forEach(element => {
            parallaxObserver.observe(element);
        });
    }

    // ===== MOUSE OPTIMIZATIONS =====
    setupMouseOptimizations() {
        console.log('🖱️ Mouse interaction optimizations aktifleştiriliyor...');
        
        // Advanced hover effects
        this.setupAdvancedHoverEffects();
        
        // Mouse tracking for parallax
        this.setupMouseParallax();
        
        // Cursor customization
        this.setupCursorCustomization();
    }

    setupAdvancedHoverEffects() {
        // Magnetic buttons effect
        document.querySelectorAll('.web-btn, .web-card').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                e.target.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            element.addEventListener('mousemove', (e) => {
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.1;
                const moveY = y * 0.1;
                
                e.target.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
            });
            
            element.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateX(0) translateY(0)';
            });
        });
    }

    setupMouseParallax() {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            
            document.querySelectorAll('[data-mouse-parallax]').forEach(element => {
                const speed = element.dataset.mouseParallax || 50;
                const x = mouseX * speed;
                const y = mouseY * speed;
                
                element.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    }

    setupCursorCustomization() {
        // Custom cursor for interactive elements
        document.querySelectorAll('a, button, .web-btn, .clickable').forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.style.cursor = 'pointer';
            });
            
            element.addEventListener('mouseleave', () => {
                document.body.style.cursor = 'default';
            });
        });
    }

    // ===== KEYBOARD NAVIGATION =====
    setupKeyboardNavigation() {
        console.log('⌨️ Keyboard navigation system aktifleştiriliyor...');
        
        // Tab navigation enhancement
        this.setupTabNavigation();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Focus management
        this.setupFocusManagement();
    }

    setupTabNavigation() {
        // Enhanced tab navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('user-is-tabbing');
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + H: Ana sayfaya git
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                window.location.href = '/';
            }
            
            // Alt + C: İletişim sayfası
            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Alt + P: Ürünler sayfası
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Escape: Modal/overlay kapatma
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal, .overlay').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
    }

    setupFocusManagement() {
        // Skip links for accessibility
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Ana içeriğe atla';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--web-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1001;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // ===== DESKTOP ANALYTICS =====
    setupDesktopAnalytics() {
        console.log('📊 Desktop analytics tracking aktifleştiriliyor...');
        
        // Desktop-specific user behavior tracking
        this.trackDesktopBehavior();
        
        // Performance metrics
        this.trackDesktopPerformance();
        
        // Screen resolution tracking
        this.trackScreenMetrics();
    }

    trackDesktopBehavior() {
        // Mouse idle detection
        let mouseIdleTimer;
        document.addEventListener('mousemove', () => {
            clearTimeout(mouseIdleTimer);
            mouseIdleTimer = setTimeout(() => {
                this.logEvent('desktop_mouse_idle', { duration: 5000 });
            }, 5000);
        });
        
        // Scroll depth tracking
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                
                if (maxScrollDepth % 25 === 0) {
                    this.logEvent('desktop_scroll_depth', { depth: maxScrollDepth });
                }
            }
        });
    }

    trackDesktopPerformance() {
        // Core Web Vitals for desktop
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.logEvent('desktop_lcp', { value: lastEntry.startTime });
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    this.logEvent('desktop_fid', { value: entry.processingStart - entry.startTime });
                });
            }).observe({ entryTypes: ['first-input'] });
        }
    }

    trackScreenMetrics() {
        const screenData = {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            pixelRatio: window.devicePixelRatio,
            colorDepth: screen.colorDepth
        };
        
        this.logEvent('desktop_screen_metrics', screenData);
    }

    // ===== ADVANCED LAZY LOADING =====
    setupLazyLoadingAdvanced() {
        console.log('🔄 Advanced lazy loading aktifleştiriliyor...');
        
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Image lazy loading
                    if (element.tagName === 'IMG' && element.dataset.src) {
                        element.src = element.dataset.src;
                        element.classList.add('lazy-loaded');
                    }
                    
                    // Background image lazy loading
                    if (element.dataset.bgSrc) {
                        element.style.backgroundImage = `url(${element.dataset.bgSrc})`;
                        element.classList.add('bg-loaded');
                    }
                    
                    // Iframe lazy loading
                    if (element.tagName === 'IFRAME' && element.dataset.src) {
                        element.src = element.dataset.src;
                    }
                    
                    lazyObserver.unobserve(element);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('[data-src], [data-bg-src]').forEach(element => {
            lazyObserver.observe(element);
        });
    }

    // ===== CRITICAL RESOURCE HINTS =====
    setupCriticalResourceHints() {
        console.log('⚡ Critical resource hints aktifleştiriliyor...');
        
        // Preload critical fonts
        this.preloadFonts();
        
        // Prefetch likely navigation targets
        this.prefetchNavigation();
        
        // Preconnect to external domains
        this.preconnectDomains();
    }

    preloadFonts() {
        const fonts = [
            '/fonts/inter-var.woff2',
            '/fonts/inter-italic.woff2'
        ];
        
        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = font;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    prefetchNavigation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = link.href;
                    document.head.appendChild(prefetchLink);
                    observer.unobserve(link);
                }
            });
        });
        
        document.querySelectorAll('a[href^="/"], a[href^="./"]').forEach(link => {
            observer.observe(link);
        });
    }

    preconnectDomains() {
        const domains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdn.jsdelivr.net'
        ];
        
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    // ===== UTILITY METHODS =====
    logEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            timestamp: Date.now(),
            url: window.location.href,
            platform: 'desktop',
            ...data
        };
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        console.log(`📊 Desktop Event: ${eventName}`, eventData);
    }

    // Public API methods
    isDesktopDevice() {
        return this.isDesktop;
    }

    getPerformanceMetrics() {
        return {
            isHighDPI: this.isHighDPI,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
            connection: navigator.connection?.effectiveType || 'unknown'
        };
    }
}

// Initialize Desktop Performance System
document.addEventListener('DOMContentLoaded', () => {
    window.desktopPerformance = new DesktopPerformance();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DesktopPerformance;
}