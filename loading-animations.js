/**
 * Hayali Çizgili - Loading & Animation System
 * Sayfa geçişleri, loading states ve smooth scroll animasyonları
 */

class LoadingAnimationSystem {
    constructor() {
        this.init();
    }

    init() {
        this.createLoadingOverlay();
        this.setupSmoothScroll();
        this.setupPageTransitions();
        this.setupLoadingStates();
        this.setupHoverEffects();
        this.setupIntersectionObserver();
    }

    // Loading overlay oluştur
    createLoadingOverlay() {
        const loadingHTML = `
            <div id="pageLoader" class="page-loader">
                <div class="loader-content">
                    <div class="spinner">
                        <div class="spinner-circle"></div>
                        <div class="spinner-text">Hayali Çizgili</div>
                    </div>
                    <div class="loading-progress">
                        <div class="progress-bar" id="progressBar"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
        this.showPageLoader();
    }

    // Sayfa loader göster
    showPageLoader() {
        const loader = document.getElementById('pageLoader');
        const progressBar = document.getElementById('progressBar');
        
        if (!loader) return;
        
        let progress = 0;
        let isPageReady = false;
        
        // Gerçek sayfa yüklenme durumunu izle
        const checkPageReady = () => {
            if (document.readyState === 'complete') {
                isPageReady = true;
                // Sayfa hazır olduğunda hızlıca %100'e getir
                progressBar.style.width = '100%';
                setTimeout(() => {
                    this.hidePageLoader();
                }, 300);
            }
        };
        
        // DOMContentLoaded ve load event'lerini dinle
        document.addEventListener('DOMContentLoaded', checkPageReady);
        window.addEventListener('load', checkPageReady);
        
        // İlk kontrol
        if (document.readyState === 'complete') {
            checkPageReady();
            return;
        }
        
        // Adaptif progress bar - daha hızlı
        const interval = setInterval(() => {
            if (isPageReady) {
                clearInterval(interval);
                return;
            }
            
            // Daha hızlı artış
            progress += Math.random() * 25 + 5; // 5-30 arası artış
            if (progress > 85) progress = 85; // Max %85'te dur
            
            progressBar.style.width = progress + '%';
            
        }, 50); // Daha sık güncelleme
        
        // Maximum 2 saniye sonra zorla kapat
        setTimeout(() => {
            if (!isPageReady) {
                clearInterval(interval);
                progressBar.style.width = '100%';
                setTimeout(() => {
                    this.hidePageLoader();
                }, 200);
            }
        }, 2000);
    }

    // Sayfa loader gizle
    hidePageLoader() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('hide');
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    }

    // Smooth scroll setup
    setupSmoothScroll() {
        // Tüm internal link'lere smooth scroll ekle
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            });
        });

        // Back to top button
        this.setupBackToTop();
    }

    // Smooth scroll to element
    smoothScrollTo(element, offset = 80) {
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementTop - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Back to top button setup
    setupBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Sayfa geçiş animasyonları
    setupPageTransitions() {
        // External link'ler için transition
        document.querySelectorAll('a:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([href^="wa.me"])').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Aynı domain'de ise transition göster
                if (href && !href.startsWith('http') && !href.startsWith('//')) {
                    e.preventDefault();
                    this.showPageTransition();
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        });
    }

    // Page transition göster
    showPageTransition() {
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition';
        transitionOverlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-spinner"></div>
                <p>Yükleniyor...</p>
            </div>
        `;
        
        document.body.appendChild(transitionOverlay);
        
        setTimeout(() => {
            transitionOverlay.classList.add('active');
        }, 10);
    }

    // Loading states setup
    setupLoadingStates() {
        // Form submit loading
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn) {
                    this.showButtonLoading(submitBtn);
                }
            });
        });

        // Button loading states
        document.querySelectorAll('.btn-buy-now, .whatsapp-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showButtonLoading(btn, 600); // 1500ms → 600ms
            });
        });
    }

    // Button loading state
    showButtonLoading(button, duration = 800) { // 2000ms → 800ms
        const originalText = button.innerHTML;
        const loadingText = `
            <div class="btn-loading">
                <div class="btn-spinner"></div>
                <span>Yükleniyor...</span>
            </div>
        `;
        
        button.innerHTML = loadingText;
        button.disabled = true;
        button.classList.add('loading');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.classList.remove('loading');
        }, duration);
    }

    // Hover effects
    setupHoverEffects() {
        // Card hover effects
        document.querySelectorAll('.product-card, .luxury-product-card, .feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Button pulse effect
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.animation = 'pulse 0.6s ease-in-out';
            });
            
            btn.addEventListener('animationend', () => {
                btn.style.animation = '';
            });
        });
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Animasyonlu elementleri observe et
        document.querySelectorAll('.product-card, .feature-card, .testimonial-card, .section-title').forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    // Mobile specific optimizations
    setupMobileOptimizations() {
        if (window.innerWidth <= 768) {
            // Touch feedback
            this.setupTouchFeedback();
            
            // Viewport height fix for mobile
            this.fixMobileViewport();
            
            // Disable hover effects on mobile
            this.disableMobileHover();
        }
    }

    // Touch feedback for mobile
    setupTouchFeedback() {
        document.querySelectorAll('button, .btn, a[role="button"]').forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            });
        });
    }

    // Fix mobile viewport height
    fixMobileViewport() {
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVh();
        window.addEventListener('resize', setVh);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVh, 500);
        });
    }

    // Disable hover effects on mobile
    disableMobileHover() {
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) {
                *:hover {
                    transition: none !important;
                    transform: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// CSS stilleri
const animationStyles = `
<style>
/* Page Loader */
.page-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}

.page-loader.hide {
    opacity: 0;
    visibility: hidden;
}

.loader-content {
    text-align: center;
    color: white;
}

.spinner {
    margin-bottom: 30px;
}

.spinner-circle {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

.spinner-text {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 20px;
}

.loading-progress {
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto;
}

.progress-bar {
    height: 100%;
    background: white;
    border-radius: 2px;
    transition: width 0.3s ease;
    width: 0%;
}

/* Page Transition */
.page-transition {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(102, 126, 234, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.page-transition.active {
    opacity: 1;
    visibility: visible;
}

.transition-content {
    text-align: center;
    color: white;
}

.transition-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
}

/* Button Loading */
.btn-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

button.loading {
    pointer-events: none;
    opacity: 0.8;
}

/* Back to Top Enhanced */
.back-to-top {
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

/* Scroll Animations */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-on-scroll.animate-in {
    opacity: 1;
    transform: translateY(0);
}

/* Touch Feedback */
.touch-active {
    background-color: rgba(0, 0, 0, 0.1) !important;
    transform: scale(0.98) !important;
}

/* Mobile Viewport Fix */
.mobile-height {
    height: calc(var(--vh, 1vh) * 100);
}


/* Enhanced Hover Effects */
@media (hover: hover) {
    .luxury-product-card:hover {
        transform: translateY(-15px) scale(1.03);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    }
    
    .feature-badge:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    }
}

/* Keyframes */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

/* Mobile Optimizations */
@media (max-width: 768px) {
    .spinner-circle {
        width: 40px;
        height: 40px;
    }
    
    .spinner-text {
        font-size: 1.2rem;
    }
    
    .loading-progress {
        width: 150px;
    }
    
    .delivery-calendar {
        padding: 8px 12px;
        text-align: center;
    }
    
    .delivery-calendar strong {
        font-size: 0.8rem;
    }
    
    .delivery-calendar small {
        font-size: 0.65rem;
    }
}
</style>
`;

// Sayfa yüklendiğinde sistemi başlat
document.addEventListener('DOMContentLoaded', function() {
    // CSS stillerini ekle
    document.head.insertAdjacentHTML('beforeend', animationStyles);
    
    // Animation sistemini başlat
    window.loadingAnimationSystem = new LoadingAnimationSystem();
    
    // Mobile optimizations
    if (window.innerWidth <= 768) {
        window.loadingAnimationSystem.setupMobileOptimizations();
    }
    
    
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoadingAnimationSystem;
}