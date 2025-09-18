/* ===========================================
   IMAGE OPTIMIZATION SYSTEM
   =========================================== */

class ImageOptimizer {
    constructor() {
        this.webpSupported = false; // DISABLED - Prevent console errors
        this.lazyLoadObserver = null;
        this.init();
    }
    
    /**
     * Initialize image optimization
     */
    init() {
        
        
        // Check WebP support
        this.checkWebPSupport().then(supported => {
            this.webpSupported = supported;
            
        });
        
        // Initialize lazy loading
        this.initializeLazyLoading();
        
        // Process existing images
        this.processImages();
        
        // Setup responsive images
        this.setupResponsiveImages();
        
        
    }
    
    /**
     * Check WebP support
     */
    checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    /**
     * Initialize lazy loading
     */
    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.lazyLoadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.lazyLoadObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            // Observe all lazy images
            document.querySelectorAll('img[data-src], picture[data-src]').forEach(img => {
                this.lazyLoadObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
        
        
    }
    
    /**
     * Load image
     */
    loadImage(element) {
        if (element.tagName === 'IMG') {
            // Handle regular img elements
            if (element.dataset.src) {
                element.src = element.dataset.src;
                element.removeAttribute('data-src');
            }
            
            if (element.dataset.srcset) {
                element.srcset = element.dataset.srcset;
                element.removeAttribute('data-srcset');
            }
        } else if (element.tagName === 'PICTURE') {
            // Handle picture elements
            const sources = element.querySelectorAll('source[data-srcset]');
            sources.forEach(source => {
                source.srcset = source.dataset.srcset;
                source.removeAttribute('data-srcset');
            });
            
            const img = element.querySelector('img[data-src]');
            if (img) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        }
        
        element.classList.add('loaded');
        
    }
    
    /**
     * Load all images (fallback)
     */
    loadAllImages() {
        document.querySelectorAll('img[data-src], picture[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }
    
    /**
     * Process existing images
     */
    processImages() {
        const images = document.querySelectorAll('img:not([data-src])');
        
        images.forEach(img => {
            // Add loading attribute
            img.setAttribute('loading', 'lazy');
            
            // Add error handling
            img.addEventListener('error', () => {
                this.handleImageError(img);
            });
            
            // Add load event for optimization
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        });
    }
    
    /**
     * Handle image loading errors
     */
    handleImageError(img) {
        // Show placeholder or fallback
        const placeholder = img.closest('.image-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
            img.style.display = 'none';
        }
        
        
    }
    
    /**
     * Setup responsive images
     */
    setupResponsiveImages() {
        // Convert regular images to responsive
        const images = document.querySelectorAll('img:not([srcset])');
        
        images.forEach(img => {
            this.makeImageResponsive(img);
        });
    }
    
    /**
     * Make image responsive
     */
    makeImageResponsive(img) {
        const src = img.src;
        const alt = img.alt;
        
        if (!src) return;
        
        // Create responsive image structure
        const picture = document.createElement('picture');
        
        // WebP source for modern browsers
        if (this.webpSupported) {
            const webpSource = document.createElement('source');
            webpSource.type = 'image/webp';
            webpSource.srcset = this.generateWebPSrcset(src);
            picture.appendChild(webpSource);
        }
        
        // Original format source
        const originalSource = document.createElement('source');
        originalSource.srcset = this.generateSrcset(src);
        picture.appendChild(originalSource);
        
        // Fallback img
        const fallbackImg = document.createElement('img');
        fallbackImg.src = src;
        fallbackImg.alt = alt;
        fallbackImg.loading = 'lazy';
        fallbackImg.className = img.className;
        
        picture.appendChild(fallbackImg);
        
        // Replace original image
        img.parentNode.replaceChild(picture, img);
    }
    
    /**
     * Generate srcset for different screen sizes
     */
    generateSrcset(src) {
        const baseName = src.substring(0, src.lastIndexOf('.'));
        const extension = src.substring(src.lastIndexOf('.'));
        
        return [
            `${baseName}-400w${extension} 400w`,
            `${baseName}-800w${extension} 800w`,
            `${baseName}-1200w${extension} 1200w`,
            `${src} 1600w`
        ].join(', ');
    }
    
    /**
     * Generate WebP srcset
     */
    generateWebPSrcset(src) {
        const baseName = src.substring(0, src.lastIndexOf('.'));
        
        // WEBP DISABLED - Return empty to prevent 404 errors
        return '';
    }
    
    /**
     * Progressive image loading
     */
    loadProgressively(img, sizes) {
        let currentSize = 0;
        
        const loadNextSize = () => {
            if (currentSize < sizes.length) {
                const tempImg = new Image();
                tempImg.onload = () => {
                    img.src = sizes[currentSize];
                    currentSize++;
                    if (currentSize < sizes.length) {
                        setTimeout(loadNextSize, 100);
                    }
                };
                tempImg.src = sizes[currentSize];
            }
        };
        
        loadNextSize();
    }
    
    /**
     * Preload critical images
     */
    preloadCriticalImages() {
        const criticalImages = [
            'images/logo.png',
            'images/boyama-kitabi-main.jpg',
            'images/hero-image.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
        
        
    }
    
    /**
     * Optimize background images
     */
    optimizeBackgroundImages() {
        const elements = document.querySelectorAll('[data-bg-src]');
        
        elements.forEach(element => {
            if (this.lazyLoadObserver) {
                this.lazyLoadObserver.observe(element);
            }
            
            element.addEventListener('intersect', () => {
                const bgSrc = element.dataset.bgSrc;
                if (bgSrc) {
                    element.style.backgroundImage = `url(${bgSrc})`;
                    element.removeAttribute('data-bg-src');
                }
            });
        });
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageOptimizer = new ImageOptimizer();
    });
} else {
    window.imageOptimizer = new ImageOptimizer();
}

// Export for manual usage
window.ImageOptimizer = ImageOptimizer;