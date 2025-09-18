/* ===========================================
   MOBILE PERFORMANCE OPTIMIZATION
   =========================================== */

class MobilePerformanceOptimizer {
    constructor() {
        this.loadStartTime = performance.now();
        this.metrics = {};
        this.isLowEndDevice = this.detectLowEndDevice();
        this.init();
    }
    
    /**
     * Initialize performance optimization
     */
    init() {
        
        
        // Measure core vitals
        this.measureCoreWebVitals();
        
        // Optimize for low-end devices
        if (this.isLowEndDevice) {
            this.optimizeForLowEndDevice();
        }
        
        // Setup intersection observers
        this.setupIntersectionObservers();
        
        // Lazy load non-critical scripts
        this.lazyLoadScripts();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Memory management
        this.setupMemoryManagement();
        
        
    }
    
    /**
     * Detect low-end device
     */
    detectLowEndDevice() {
        // Check device memory
        if (navigator.deviceMemory && navigator.deviceMemory < 4) {
            return true;
        }
        
        // Check CPU cores
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            return true;
        }
        
        // Check connection speed
        if (navigator.connection) {
            const connection = navigator.connection;
            if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Measure Core Web Vitals
     */
    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay (FID)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    
                });
            }).observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.cls = clsValue;
                
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    /**
     * Optimize for low-end devices
     */
    optimizeForLowEndDevice() {
        
        
        // Reduce animation complexity
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        
        // Disable expensive effects
        const expensiveElements = document.querySelectorAll('.parallax, .blur-effect');
        expensiveElements.forEach(el => {
            el.style.transform = 'none';
            el.style.filter = 'none';
        });
        
        // Reduce image quality
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.imageRendering = 'optimizeSpeed';
        });
    }
    
    /**
     * Setup intersection observers for performance
     */
    setupIntersectionObservers() {
        // Intersection observer for animations
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                } else if (!this.isLowEndDevice) {
                    entry.target.classList.remove('animate');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe animation elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            animationObserver.observe(el);
        });
        
        // Video lazy loading
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    if (video.dataset.src) {
                        video.src = video.dataset.src;
                        video.load();
                        videoObserver.unobserve(video);
                    }
                }
            });
        });
        
        document.querySelectorAll('video[data-src]').forEach(video => {
            videoObserver.observe(video);
        });
    }
    
    /**
     * Lazy load non-critical scripts
     */
    lazyLoadScripts() {
        const scripts = [
            {
                src: 'analytics.js',
                condition: () => window.gtag !== undefined,
                priority: 'low'
            },
            {
                src: 'social-widgets.js',
                condition: () => document.querySelector('.social-widget'),
                priority: 'low'
            }
        ];
        
        scripts.forEach(script => {
            if (script.condition()) {
                this.loadScript(script.src, script.priority);
            }
        });
    }
    
    /**
     * Load script with priority
     */
    loadScript(src, priority = 'normal') {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            if (priority === 'low') {
                script.loading = 'lazy';
            }
            
            script.onload = resolve;
            script.onerror = reject;
            
            if (priority === 'high') {
                document.head.appendChild(script);
            } else {
                // Load after main thread is free
                requestIdleCallback(() => {
                    document.head.appendChild(script);
                });
            }
        });
    }
    
    /**
     * Optimize animations
     */
    optimizeAnimations() {
        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            return;
        }
        
        // Use requestAnimationFrame for smooth animations
        let ticking = false;
        const animationElements = document.querySelectorAll('[data-animation]');
        
        const updateAnimations = () => {
            animationElements.forEach(el => {
                if (el.getBoundingClientRect().top < window.innerHeight) {
                    el.style.willChange = 'transform';
                } else {
                    el.style.willChange = 'auto';
                }
            });
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    /**
     * Setup memory management
     */
    setupMemoryManagement() {
        // Clean up observers on page unload
        window.addEventListener('beforeunload', () => {
            // Disconnect all observers
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
            }
            
            // Clear timers
            clearTimeout(this.debounceTimer);
            clearInterval(this.memoryCheckInterval);
        });
        
        // Monitor memory usage (if available)
        if (performance.memory) {
            this.memoryCheckInterval = setInterval(() => {
                const memoryInfo = performance.memory;
                const usage = memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize;
                
                if (usage > 0.9) {
                    
                    this.freeMemory();
                }
            }, 30000);
        }
    }
    
    /**
     * Free memory
     */
    freeMemory() {
        // Remove unused images from DOM
        const hiddenImages = document.querySelectorAll('img:not([src])');
        hiddenImages.forEach(img => {
            if (!img.getBoundingClientRect().top < window.innerHeight) {
                img.remove();
            }
        });
        
        // Trigger garbage collection (if available)
        if (window.gc) {
            window.gc();
        }
        
        
    }
    
    /**
     * Debounce utility
     */
    debounce(func, wait) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }
    
    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            loadTime: performance.now() - this.loadStartTime,
            isLowEndDevice: this.isLowEndDevice
        };
    }
    
    /**
     * Report metrics
     */
    reportMetrics() {
        const metrics = this.getMetrics();
        
        
        // Send to analytics (if available)
        if (window.gtag) {
            window.gtag('event', 'performance_metrics', {
                custom_parameter: JSON.stringify(metrics)
            });
        }
        
        return metrics;
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobilePerformanceOptimizer = new MobilePerformanceOptimizer();
    });
} else {
    window.mobilePerformanceOptimizer = new MobilePerformanceOptimizer();
}

// Report metrics after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.mobilePerformanceOptimizer) {
            window.mobilePerformanceOptimizer.reportMetrics();
        }
    }, 1000);
});