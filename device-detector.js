/* ===== CİHAZ ALGILAMA VE CSS YÖNLENDİRME SİSTEMİ ===== */
/* Mobil ve Web görünümlerini tamamen ayıran basil ve güvenilir sistem + Web optimizasyonları */

class DeviceManager {
    constructor() {
        this.isMobile = false;
        this.isTablet = false;
        this.isDesktop = false;
        this.userAgent = navigator.userAgent.toLowerCase();
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.webOptimizationsLoaded = false;
        
        // Initialize immediately
        this.init();
    }
    
    init() {
        
        
        // Detect device type
        this.detectDevice();
        
        // Load appropriate styles
        this.loadStyles();
        
        // Setup DOM content when ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupContent();
            });
        } else {
            this.setupContent();
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        
    }
    
    /**
     * Cihaz algılama
     */
    detectDevice() {
        // Mobile patterns
        const mobilePatterns = [
            /android.*mobile/i,
            /iphone/i,
            /ipod/i,
            /blackberry/i,
            /windows phone/i,
            /mobile/i
        ];
        
        // Tablet patterns 
        const tabletPatterns = [
            /ipad/i,
            /android(?!.*mobile)/i,
            /tablet/i,
            /kindle/i,
            /silk/i,
            /playbook/i
        ];
        
        // Check mobile first
        this.isMobile = mobilePatterns.some(pattern => pattern.test(this.userAgent)) || 
                       (this.screenWidth <= 768 && this.touchDevice);
        
        // Check tablet if not mobile
        if (!this.isMobile) {
            this.isTablet = tabletPatterns.some(pattern => pattern.test(this.userAgent)) ||
                           (this.screenWidth > 768 && this.screenWidth <= 1024 && this.touchDevice);
        }
        
        // Desktop is everything else
        this.isDesktop = !this.isMobile && !this.isTablet;
        
        // Override based on screen size for edge cases
        if (this.screenWidth <= 480) {
            this.isMobile = true;
            this.isTablet = false;
            this.isDesktop = false;
        } else if (this.screenWidth <= 1024 && this.touchDevice) {
            this.isMobile = false;
            this.isTablet = true;
            this.isDesktop = false;
        }
    }
    
    /**
     * CSS dosyalarını yükle
     */
    loadStyles() {
        // Remove existing mobile/web styles
        this.removeExistingStyles();
        
        if (this.isMobile || this.isTablet) {
            this.loadMobileStyles();
        } else {
            this.loadWebStyles();
        }
    }
    
    /**
     * Mevcut stilleri kaldır
     */
    removeExistingStyles() {
        const existingStyles = document.querySelectorAll('link[rel="stylesheet"]');
        existingStyles.forEach(style => {
            if (style.href && (
                style.href.includes('mobile-styles.css') || 
                style.href.includes('web-styles.css') ||
                style.href.includes('styles.css')
            )) {
                style.remove();
            }
        });
    }
    
    /**
     * Mobil stilleri yükle
     */
    loadMobileStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'mobile-styles.css';
        link.id = 'mobile-styles';
        
        link.onload = () => {
            
            this.onStylesLoaded();
        };
        
        link.onerror = () => {
            
            this.loadFallbackStyles();
        };
        
        document.head.appendChild(link);
    }
    
    /**
     * Web stilleri yükle
     */
    loadWebStyles() {
        // Load critical CSS first
        this.loadCriticalWebCSS();
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'web-styles.css';
        link.id = 'web-styles';
        
        link.onload = () => {
            
            this.loadWebOptimizations();
            this.onStylesLoaded();
        };
        
        link.onerror = () => {
            
            this.loadFallbackStyles();
        };
        
        document.head.appendChild(link);
    }
    
    /**
     * Critical Web CSS yükle
     */
    loadCriticalWebCSS() {
        const criticalLink = document.createElement('link');
        criticalLink.rel = 'stylesheet';
        criticalLink.type = 'text/css';
        criticalLink.href = 'web-critical.css';
        criticalLink.id = 'web-critical-styles';
        criticalLink.media = 'all';
        
        criticalLink.onload = () => {
            
        };
        
        document.head.appendChild(criticalLink);
    }
    
    /**
     * Web optimizasyonlarını yükle
     */
    loadWebOptimizations() {
        if (this.webOptimizationsLoaded) return;
        
        
        
        // Load JavaScript optimizations
        this.loadWebPerformanceJS();
        this.loadWebInteractionsJS();
        this.loadWebSEOJS();
        this.loadWebAnalyticsJS();
        
        this.webOptimizationsLoaded = true;
        
    }
    
    /**
     * Web Performance JS yükle
     */
    loadWebPerformanceJS() {
        const script = document.createElement('script');
        script.src = 'web-performance.js';
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => 
        document.head.appendChild(script);
    }
    
    /**
     * Web Interactions JS yükle
     */
    loadWebInteractionsJS() {
        const script = document.createElement('script');
        script.src = 'web-interactions.js';
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => 
        document.head.appendChild(script);
    }
    
    /**
     * Web SEO JS yükle
     */
    loadWebSEOJS() {
        const script = document.createElement('script');
        script.src = 'web-seo.js';
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => 
        document.head.appendChild(script);
    }
    
    /**
     * Web Analytics JS yükle
     */
    loadWebAnalyticsJS() {
        const script = document.createElement('script');
        script.src = 'web-analytics.js';
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => 
        document.head.appendChild(script);
    }
    
    /**
     * Fallback stiller
     */
    loadFallbackStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'styles.css';
        link.id = 'fallback-styles';
        document.head.appendChild(link);
        
        this.onStylesLoaded();
    }
    
    /**
     * DOM içeriğini ayarla
     */
    setupContent() {
        
        
        // Show/hide appropriate content based on device
        if (this.isMobile || this.isTablet) {
            this.showMobileContent();
        } else {
            this.showWebContent();
        }
        
        // Initialize navigation
        this.initializeNavigation();
        
        // Initialize touch gestures for mobile
        if (this.isMobile || this.isTablet) {
            this.initializeTouchGestures();
            this.initializeGallery();
        }
        
        // Initialize iOS fixes for mobile
        if (this.isMobile && this.isIOS()) {
            this.initializeIOSFixes();
        }
        
        
    }
    
    /**
     * Event listeners
     */
    setupEventListeners() {
        // Orientation change detection
        window.addEventListener('orientationchange', this.debounce(() => {
            this.handleOrientationChange();
        }, 500));
        
        // Resize detection
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 300));
    }
    
    /**
     * Orientation değişikliği
     */
    handleOrientationChange() {
        setTimeout(() => {
            this.screenWidth = window.innerWidth;
            this.screenHeight = window.innerHeight;
            
            
            // Re-detect if needed
            this.detectDevice();
            this.loadStyles();
        }, 100);
    }
    
    /**
     * Resize handler
     */
    handleResize() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        
        // Re-detect device if significant change
        const oldType = this.getDeviceType();
        this.detectDevice();
        const newType = this.getDeviceType();
        
        if (oldType !== newType) {
            
            this.loadStyles();
            this.setupContent();
        }
    }
    
    /**
     * Stiller yüklendiğinde
     */
    onStylesLoaded() {
        document.body.classList.add('styles-loaded');
        
        // Add device-specific classes
        document.body.classList.remove('mobile', 'tablet', 'desktop');
        if (this.isMobile) document.body.classList.add('mobile');
        if (this.isTablet) document.body.classList.add('tablet');
        if (this.isDesktop) document.body.classList.add('desktop');
        
        
    }
    
    /**
     * Mobil içerik göster
     */
    showMobileContent() {
        // Hide desktop-only elements
        const desktopOnlyElements = document.querySelectorAll('.desktop-only, .web-only');
        desktopOnlyElements.forEach(el => el.style.display = 'none');
        
        // Show mobile elements
        const mobileElements = document.querySelectorAll('.mobile-only');
        mobileElements.forEach(el => el.style.display = 'block');
        
        
    }
    
    /**
     * Web içerik göster
     */
    showWebContent() {
        // Hide mobile-only elements
        const mobileOnlyElements = document.querySelectorAll('.mobile-only');
        mobileOnlyElements.forEach(el => el.style.display = 'none');
        
        // Show desktop elements
        const desktopElements = document.querySelectorAll('.desktop-only, .web-only');
        desktopElements.forEach(el => el.style.display = 'block');
        
        
    }
    
    /**
     * Navigation başlat
     */
    initializeNavigation() {
        // Mobile hamburger menu
        const hamburger = document.querySelector('.hamburger-menu');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
        
        // Desktop navigation enhancements
        if (this.isDesktop) {
            const navLinks = document.querySelectorAll('.web-nav-link');
            navLinks.forEach(link => {
                link.addEventListener('mouseenter', (e) => {
                    e.target.style.transform = 'translateY(-2px)';
                });
                
                link.addEventListener('mouseleave', (e) => {
                    e.target.style.transform = 'translateY(0)';
                });
            });
        }
    }
    
    /**
     * Touch gestures başlat
     */
    initializeTouchGestures() {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isSwipeDetected = false;
        
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            currentX = touch.clientX;
            currentY = touch.clientY;
            isSwipeDetected = false;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) return;
            
            const touch = e.touches[0];
            currentX = touch.clientX;
            currentY = touch.clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance > 50) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // Horizontal swipe
                    if (deltaX > 0) {
                        this.handleSwipeRight();
                    } else {
                        this.handleSwipeLeft();
                    }
                } else {
                    // Vertical swipe
                    if (deltaY > 0) {
                        this.handleSwipeDown();
                    } else {
                        this.handleSwipeUp();
                    }
                }
                isSwipeDetected = true;
            }
        }, { passive: true });
        
        
    }
    
    /**
     * Swipe handlers
     */
    handleSwipeLeft() {
        
        // Navigate to next page/section
        this.navigateNext();
    }
    
    handleSwipeRight() {
        
        // Navigate to previous page/section
        this.navigatePrevious();
    }
    
    handleSwipeUp() {
        
        // Scroll to top or close modal
    }
    
    handleSwipeDown() {
        
        // Refresh or show menu
    }
    
    /**
     * Gallery navigasyonu
     */
    initializeGallery() {
        const galleryImages = document.querySelectorAll('.gallery img, .product-images img');
        
        galleryImages.forEach(img => {
            img.addEventListener('click', (e) => {
                this.openImageModal(e.target);
            });
        });
        
        
    }
    
    /**
     * iOS spesifik düzeltmeler
     */
    initializeIOSFixes() {
        // iOS viewport height fix
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px');
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
        
        // iOS scroll fix
        document.body.style.webkitOverflowScrolling = 'touch';
        
        
    }
    
    /**
     * Utility functions
     */
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }
    
    getDeviceType() {
        if (this.isMobile) return 'mobile';
        if (this.isTablet) return 'tablet';
        return 'desktop';
    }
    
    openImageModal(img) {
        // Simple modal implementation
        
    }
    
    navigateNext() {
        // Navigate to next section
        
    }
    
    navigatePrevious() {
        // Navigate to previous section  
        
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize device manager
const deviceManager = new DeviceManager();

// Global access
window.deviceManager = deviceManager;

