/**
 * Hayali Çizgili - Etkileşimli Buton JavaScript
 * Ripple efektleri, mouse tracking ve gelişmiş etkileşimler
 */

class InteractiveButtons {
  constructor() {
    this.init();
  }

  init() {
    this.setupRippleEffect();
    this.setupMouseTracking();
    this.setupTouchFeedback();
    this.setupLoadingStates();
    this.setupKeyboardNavigation();
    this.setupIntersectionObserver();
  }

  /**
   * Ripple efekti kurulumu
   */
  setupRippleEffect() {
    const rippleButtons = document.querySelectorAll('.interactive-btn--ripple');
    
    rippleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.createRipple(e);
      });
    });
  }

  /**
   * Ripple efekti oluşturma
   */
  createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    // Önceki ripple'ları temizle
    const existingRipples = button.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());

    // Yeni ripple oluştur
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    button.appendChild(ripple);

    // Animasyon bitince ripple'ı kaldır
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Mouse tracking efekti kurulumu
   */
  setupMouseTracking() {
    const trackingButtons = document.querySelectorAll('.interactive-btn--mouse-track');
    
    trackingButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        this.updateMousePosition(e);
      });

      button.addEventListener('mouseleave', () => {
        button.style.setProperty('--mouse-x', '50%');
        button.style.setProperty('--mouse-y', '50%');
      });
    });
  }

  /**
   * Mouse pozisyonu güncelleme
   */
  updateMousePosition(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    button.style.setProperty('--mouse-x', `${x}%`);
    button.style.setProperty('--mouse-y', `${y}%`);
  }

  /**
   * Touch feedback kurulumu
   */
  setupTouchFeedback() {
    const touchButtons = document.querySelectorAll('.interactive-btn');
    
    touchButtons.forEach(button => {
      // Touch start
      button.addEventListener('touchstart', (e) => {
        button.classList.add('touch-active');
        this.vibrate();
      }, { passive: true });

      // Touch end
      button.addEventListener('touchend', () => {
        setTimeout(() => {
          button.classList.remove('touch-active');
        }, 150);
      }, { passive: true });

      // Touch cancel
      button.addEventListener('touchcancel', () => {
        button.classList.remove('touch-active');
      }, { passive: true });
    });
  }

  /**
   * Haptic feedback (vibration)
   */
  vibrate() {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // 50ms titreşim
    }
  }

  /**
   * Loading state yönetimi
   */
  setupLoadingStates() {
    const loadingButtons = document.querySelectorAll('[data-loading]');
    
    loadingButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (button.classList.contains('interactive-btn--loading')) {
          e.preventDefault();
          return;
        }

        this.setLoadingState(button, true);
        
        // Simulated async operation
        setTimeout(() => {
          this.setLoadingState(button, false);
        }, 2000);
      });
    });
  }

  /**
   * Loading state ayarlama
   */
  setLoadingState(button, isLoading) {
    if (isLoading) {
      button.classList.add('interactive-btn--loading');
      button.setAttribute('aria-busy', 'true');
      button.disabled = true;
      
      // Orijinal metni sakla
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent;
      }
      button.textContent = 'Yükleniyor...';
    } else {
      button.classList.remove('interactive-btn--loading');
      button.setAttribute('aria-busy', 'false');
      button.disabled = false;
      
      // Orijinal metni geri yükle
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
      }
    }
  }

  /**
   * Keyboard navigation kurulumu
   */
  setupKeyboardNavigation() {
    const buttons = document.querySelectorAll('.interactive-btn');
    
    buttons.forEach(button => {
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.simulateClick(button);
        }
      });
    });
  }

  /**
   * Click simülasyonu
   */
  simulateClick(button) {
    button.classList.add('touch-active');
    
    // Ripple efekti varsa tetikle
    if (button.classList.contains('interactive-btn--ripple')) {
      const rect = button.getBoundingClientRect();
      const fakeEvent = {
        currentTarget: button,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      };
      this.createRipple(fakeEvent);
    }

    setTimeout(() => {
      button.classList.remove('touch-active');
      button.click();
    }, 150);
  }

  /**
   * Intersection Observer kurulumu (animasyonlar için)
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Pulse butonları gözlemle
    const pulseButtons = document.querySelectorAll('.interactive-btn--pulse');
    pulseButtons.forEach(button => {
      observer.observe(button);
    });
  }

  /**
   * Buton tipini dinamik olarak değiştirme
   */
  changeButtonType(button, newType) {
    // Mevcut tip sınıflarını kaldır
    const typeClasses = [
      'interactive-btn--primary',
      'interactive-btn--secondary',
      'interactive-btn--pulse',
      'interactive-btn--ripple',
      'interactive-btn--glow',
      'interactive-btn--mouse-track',
      'interactive-btn--3d',
      'interactive-btn--gradient-shift',
      'interactive-btn--heartbeat',
      'interactive-btn--shine'
    ];

    typeClasses.forEach(cls => button.classList.remove(cls));
    
    // Yeni tip ekle
    button.classList.add(`interactive-btn--${newType}`);
    
    // Yeni tip için event listener'ları yeniden kur
    this.setupButtonType(button, newType);
  }

  /**
   * Belirli buton tipi için event listener kurulumu
   */
  setupButtonType(button, type) {
    switch (type) {
      case 'ripple':
        button.addEventListener('click', (e) => this.createRipple(e));
        break;
      case 'mouse-track':
        button.addEventListener('mousemove', (e) => this.updateMousePosition(e));
        button.addEventListener('mouseleave', () => {
          button.style.setProperty('--mouse-x', '50%');
          button.style.setProperty('--mouse-y', '50%');
        });
        break;
    }
  }

  /**
   * Performance monitoring
   */
  monitorPerformance() {
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            console.log(`Button animation: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure'] });
    }
  }

  /**
   * Accessibility check
   */
  checkAccessibility() {
    const buttons = document.querySelectorAll('.interactive-btn');
    
    buttons.forEach(button => {
      // Minimum size check
      const rect = button.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        console.warn('Button too small for touch targets:', button);
      }

      // Color contrast check (simplified)
      const styles = getComputedStyle(button);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;
      
      if (bgColor === textColor) {
        console.warn('Poor color contrast detected:', button);
      }

      // ARIA attributes check
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        console.warn('Button missing accessible label:', button);
      }
    });
  }

  /**
   * Utility: Debounce function
   */
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

  /**
   * Utility: Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.interactiveButtons = new InteractiveButtons();
  
  // Development mode checks
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.interactiveButtons.checkAccessibility();
    window.interactiveButtons.monitorPerformance();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractiveButtons;
}