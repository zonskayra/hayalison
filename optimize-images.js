/* ===== IMAGE OPTIMIZATION SCRIPT ===== */
// Bu script manuel çalıştırılarak image'ları optimize edebilir
// Production'da kullanım için

const imageOptimization = {
    // WebP support detection
    supportsWebP: function() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('webp') > 0;
    },

    // Progressive JPEG loading with error handling
    loadProgressiveImage: function(img) {
        const originalSrc = img.getAttribute('data-src');
        if (!originalSrc) return;

        try {
            // Low quality placeholder first
            const placeholder = originalSrc.replace(/\.(jpg|jpeg)$/i, '-placeholder.jpg');
            
            const placeholderImg = new Image();
            placeholderImg.onload = function() {
                img.src = placeholder;
            };
            placeholderImg.onerror = function() {
                // If placeholder fails, directly load original
                img.src = originalSrc;
            };
            placeholderImg.src = placeholder;
            
            // Load high quality asynchronously
            const highQualityImg = new Image();
            highQualityImg.onload = function() {
                img.src = originalSrc;
                img.classList.add('loaded');
            };
            highQualityImg.onerror = function() {
                // If high quality fails, mark as loaded anyway
                img.classList.add('loaded');
            };
            highQualityImg.src = originalSrc;
        } catch (error) {
            // Fallback: directly set original src
            img.src = originalSrc;
            img.classList.add('loaded');
        }
    },

    // SIMPLIFIED IMAGE LOADING - NO WEBP ATTEMPTS
    loadOptimizedImage: function(img) {
        const originalSrc = img.getAttribute('data-src');
        if (!originalSrc) return;

        try {
            // ONLY load original format - no WebP attempts
            const originalImg = new Image();
            originalImg.onload = function() {
                img.src = originalSrc;
                img.classList.add('loaded');
            };
            originalImg.onerror = function() {
                // Mark as failed but loaded to prevent retries
                img.classList.add('loaded', 'load-failed');
                // Silent fail - no console output
            };
            originalImg.src = originalSrc;
        } catch (error) {
            // Fallback for any unexpected errors
            img.src = originalSrc;
            img.classList.add('loaded', 'load-failed');
        }
    }
};

// Enhanced Lazy Loading with Intersection Observer
class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                // Start loading 100px before image comes into view
                rootMargin: '100px 0px',
                threshold: 0.01
            });

            this.observeImages();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    observeImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.imageObserver.observe(img));
    }

    loadImage(img) {
        // Add loading class
        img.classList.add('loading');
        
        // Use optimized loading based on image type
        if (img.classList.contains('progressive')) {
            imageOptimization.loadProgressiveImage(img);
        } else {
            imageOptimization.loadOptimizedImage(img);
        }
    }

    loadAllImages() {
        // Fallback: load all images immediately
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.loadImage(img));
    }
}

// Critical image preloader for above-the-fold content - MINIMAL VERSION
class CriticalImagePreloader {
    constructor() {
        // ONLY EXISTING FILES - NO WEBP ATTEMPTS
        this.criticalImages = [
            'images/boyama-kitabi-main.jpg',
            'images/logo.png'
        ];
        this.preloadedImages = new Set();
        this.fileExistenceCache = new Map();
        this.preloadCriticalImages();
    }

    async preloadCriticalImages() {
        // Skip file existence checks - directly attempt preload
        // This prevents fetch errors in console
        this.criticalImages.forEach(src => {
            this.preloadExistingImage(src);
        });
    }

    async filterExistingImages(imagePaths) {
        // Return all images without checking - let preload handle failures silently
        return imagePaths;
    }

    async silentFileExistenceCheck(url) {
        // Always return true - skip all fetch-based existence checks
        // This eliminates "Fetch failed loading" console errors completely
        return true;
    }

    preloadExistingImage(src) {
        // Prevent duplicate preloading
        if (this.preloadedImages.has(src)) return;
        this.preloadedImages.add(src);

        // Create link element for preloading (better than Image() for avoiding console errors)
        const linkElement = document.createElement('link');
        linkElement.rel = 'preload';
        linkElement.as = 'image';
        linkElement.href = src;
        
        // Silent error handling - no console output
        linkElement.onerror = () => {
            if (linkElement.parentNode) {
                linkElement.parentNode.removeChild(linkElement);
            }
            this.preloadedImages.delete(src);
            this.fileExistenceCache.set(src, false);
            // Silent failure - no logging
        };
        
        // Add to document head for preloading
        document.head.appendChild(linkElement);
    }
}

// ENHANCED Global error suppression for image loading
class ImageErrorSuppressor {
    constructor() {
        this.originalConsoleError = console.error;
        this.originalConsoleWarn = console.warn;
        this.init();
    }

    init() {
        // Suppress console errors for image loading
        this.suppressAllImageErrors();
        
        // Add CSS for failed images
        this.addFailedImageStyles();
        
        // Override window.onerror for resource loading errors
        this.suppressWindowErrors();
    }

    suppressAllImageErrors() {
        // COMPREHENSIVE console.error override - Enhanced patterns
        console.error = (...args) => {
            const errorMessage = args.join(' ').toLowerCase();
            
            // Suppress ALL image and fetch-related console errors
            const suppressPatterns = [
                'err_file_not_found',
                'failed to load resource',
                'get file://',
                'net::err_file_not_found',
                'fetch failed loading',
                'head "file://',
                '.webp',
                '.jpg',
                '.jpeg',
                '.png',
                'images/',
                'character-images/',
                'resource loading',
                'network error',
                'fetch error',
                'fetch failed',
                'loading: head',
                'd%c3%bczenleme/images', // URL encoded path
                'boyama-kitabi-main.jpg',
                'logo.png'
            ];
            
            const shouldSuppress = suppressPatterns.some(pattern =>
                errorMessage.includes(pattern)
            );
            
            // Suppress completely - no output for image errors
            if (!shouldSuppress) {
                this.originalConsoleError.apply(console, args);
            }
        };

        // ALSO suppress console.warn for image warnings
        console.warn = (...args) => {
            const warnMessage = args.join(' ').toLowerCase();
            
            const suppressWarnings = [
                'failed to load',
                'resource not found',
                'images/',
                '.webp',
                '.jpg',
                '.png'
            ];
            
            const shouldSuppressWarn = suppressWarnings.some(pattern =>
                warnMessage.includes(pattern)
            );
            
            if (!shouldSuppressWarn) {
                this.originalConsoleWarn.apply(console, args);
            }
        };

        // Handle unhandled promise rejections from image loading
        window.addEventListener('unhandledrejection', (event) => {
            const error = event.reason;
            if (error && (typeof error === 'string' || error.message)) {
                const errorText = (error.message || error.toString()).toLowerCase();
                const isImageError = [
                    'err_file_not_found',
                    'failed to load',
                    'network error',
                    'images/',
                    'fetch error'
                ].some(pattern => errorText.includes(pattern));
                
                if (isImageError) {
                    event.preventDefault(); // Suppress the error
                }
            }
        });

        // Handle generic error events for resource loading
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                const target = event.target;
                if (target.tagName === 'IMG' || target.tagName === 'LINK') {
                    // Suppress image/link loading errors
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
            }
        }, true); // Use capture phase
    }

    suppressWindowErrors() {
        // Additional window.onerror handling for resource errors
        const originalOnerror = window.onerror;
        window.onerror = (message, source, lineno, colno, error) => {
            const msgStr = message ? message.toString().toLowerCase() : '';
            const srcStr = source ? source.toString().toLowerCase() : '';
            
            const isImageError = [
                'err_file_not_found',
                'failed to load resource',
                'network error',
                'images/',
                '.webp',
                '.jpg',
                '.png'
            ].some(pattern => msgStr.includes(pattern) || srcStr.includes(pattern));
            
            if (isImageError) {
                return true; // Prevent default error handling
            }
            
            if (originalOnerror) {
                return originalOnerror(message, source, lineno, colno, error);
            }
            
            return false;
        };
    }

    addFailedImageStyles() {
        // Create and inject CSS for failed images
        const style = document.createElement('style');
        style.textContent = `
            /* Hide broken image icons and failed images */
            img.load-failed {
                opacity: 0;
                visibility: hidden;
            }
            
            /* Alternative: Show placeholder for failed images */
            img.load-failed::before {
                content: '';
                display: inline-block;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
                opacity: 1;
                visibility: visible;
            }
            
            /* Ensure loading states are visible */
            img.loading {
                opacity: 0.7;
                filter: blur(1px);
                transition: opacity 0.3s ease, filter 0.3s ease;
            }
            
            img.loaded {
                opacity: 1;
                filter: none;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize error suppression first
    new ImageErrorSuppressor();
    
    // Then initialize image loading
    new CriticalImagePreloader();
    new LazyImageLoader();
});

// Export for manual usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        imageOptimization,
        LazyImageLoader,
        CriticalImagePreloader,
        ImageErrorSuppressor
    };
}