/**
 * Hayali Çizgili - Gelişmiş Buton ve İkon Animasyonları
 * Butonları ve ikonları daha canlı ve interaktif hale getiren JavaScript kodları
 * Güncellenmiş Versiyon - 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tüm butonları ve ikonları geliştir
    enhanceButtons();
    enhanceSocialIcons();
    addPulseAnimation();
    addHoverAnimations();
    addMobileInteractivity();
    
    // Yeni gelişmiş animasyonlar
    addMagneticEffect();
    addMorphAnimations();
    enhancedRippleEffect();
    addMicroInteractions();
    enhancedTouchFeedback();
    addMobileGestures();
    optimizePerformance();
    
    // Yeni buton stillerini uygula
    applyGradientButtons();
    applyGlowButtons();
    applyOutlineButtons();
    applyGlassButtons();
    
    // Buton animasyonlarını geliştir
    enhanceButtonAnimations();
});

/**
 * Butonları daha interaktif hale getirme
 */
function enhanceButtons() {
    // CTA butonlar için
    const ctaButtons = document.querySelectorAll('.cta-button a, .cta-primary, .cta-secondary');
    
    ctaButtons.forEach(button => {
        // Parıltı efekti ekle
        button.addEventListener('mouseenter', function() {
            this.classList.add('hover-effect');
            
            // Buton içerisindeki ikonu hareketlendir
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(3px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
            
            // İkonu eski haline getir
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(0)';
            }
        });
        
        // Dalgalanma efekti için click olayı ekle
        button.addEventListener('click', function(e) {
            // Tıklama pozisyonundan dalgalanan bir efekt
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            // Animasyon bitince elementi kaldır
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
    
    // Otomatik nabız efekti ekleyip bazı CTA butonlarına dikkat çek
    const primaryCTAs = document.querySelectorAll('.cta-primary');
    if (primaryCTAs.length > 0) {
        // Sayfada ilk gördüğümüz primary CTA'ya nabız efekti ekle
        setTimeout(() => {
            const firstCTA = primaryCTAs[0];
            firstCTA.classList.add('pulse-animation');
            
            // 5 saniye sonra efekti kaldır
            setTimeout(() => {
                firstCTA.classList.remove('pulse-animation');
            }, 5000);
        }, 2000);
    }
    
    // Butonlara modern stil sınıfları ekle
    const modernButtons = document.querySelectorAll('.cta-primary');
    modernButtons.forEach((button, index) => {
        // Her beşinci butona farklı bir stil ekle
        if (index % 5 === 0) {
            button.classList.add('btn-neumorphic');
        } else if (index % 5 === 1) {
            button.classList.add('btn-3d');
        } else if (index % 5 === 2) {
            button.classList.add('btn-glass');
        } else if (index % 5 === 3) {
            button.classList.add('btn-glow');
        } else {
            button.classList.add('btn-gradient');
        }
        
        // Glow efekti ekle
        button.classList.add('glow-effect');
    });
}

/**
 * Sosyal medya ikonlarını geliştirme
 */
function enhanceSocialIcons() {
    const socialIcons = document.querySelectorAll('.social-icons a');
    
    socialIcons.forEach(icon => {
        // Platform spesifik sınıfları ekle
        const iconElement = icon.querySelector('i');
        if (!iconElement) return;
        
        const iconClass = iconElement.className;
        
        if (iconClass.includes('instagram')) {
            icon.classList.add('instagram');
        } else if (iconClass.includes('facebook')) {
            icon.classList.add('facebook');
        } else if (iconClass.includes('twitter')) {
            icon.classList.add('twitter');
        } else if (iconClass.includes('whatsapp')) {
            icon.classList.add('whatsapp');
        }
        
        // Hover animasyonu
        icon.addEventListener('mouseenter', function() {
            if (iconElement) {
                iconElement.style.transform = 'scale(1.2)';
            }
            
            // Işık efektini göster
            this.classList.add('light-effect');
        });
        
        icon.addEventListener('mouseleave', function() {
            if (iconElement) {
                iconElement.style.transform = 'scale(1)';
            }
            
            // Işık efektini kaldır
            this.classList.remove('light-effect');
        });
        
        // Tıklama efekti
        icon.addEventListener('click', function() {
            this.classList.add('clicked');
            
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 500);
        });
    });
    
    // Sosyal medya ikonlarına modern stil sınıfları ekle
    const footerSocialIcons = document.querySelector('.footer-social .social-icons');
    if (footerSocialIcons) {
        footerSocialIcons.classList.add('social-icons-neumorphic');
    }
}

/**
 * Nabız animasyonu ekleme
 */
function addPulseAnimation() {
    // CSS keyframe animasyonu için stil ekle
    const style = document.createElement('style');
    style.textContent = `
        @keyframes button-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 6px 20px rgba(209, 193, 230, 0.4); }
            50% { transform: scale(1.03); box-shadow: 0 8px 25px rgba(209, 193, 230, 0.6); }
        }
        
        .pulse-animation {
            animation: button-pulse 1.5s ease-in-out infinite !important;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            width: 100px;
            height: 100px;
            transform: scale(0);
            animation: ripple 0.8s linear;
            pointer-events: none;
            z-index: 0;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .light-effect::before {
            opacity: 1 !important;
            transform: scale(1.2);
            animation: pulse-light 1.5s ease infinite !important;
        }
        
        .clicked {
            animation: click-scale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        
        @keyframes click-scale {
            0% { transform: scale(1); }
            50% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
        
        /* Mikro-etkileşimler için animasyonlar */
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes tada {
            0% { transform: scale(1); }
            10%, 20% { transform: scale(0.9) rotate(-3deg); }
            30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
            40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
            100% { transform: scale(1) rotate(0); }
        }
        
        @keyframes swing {
            20% { transform: rotate(15deg); }
            40% { transform: rotate(-10deg); }
            60% { transform: rotate(5deg); }
            80% { transform: rotate(-5deg); }
            100% { transform: rotate(0deg); }
        }
        
        .bounce { animation: bounce 0.8s ease; }
        .shake { animation: shake 0.8s ease; }
        .tada { animation: tada 0.8s ease; }
        .swing { transform-origin: top center; animation: swing 0.8s ease; }
        
        /* Gelişmiş dalgalanma efekti */
        .enhanced-ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            width: 100px;
            height: 100px;
            margin-top: -50px;
            margin-left: -50px;
            transform: scale(0);
            animation: enhanced-ripple 0.8s ease-out var(--delay, 0ms);
            pointer-events: none;
            z-index: 0;
        }
        
        @keyframes enhanced-ripple {
            to {
                transform: scale(var(--scale, 3));
                opacity: 0;
            }
        }
        
        /* Dokunmatik etkileşim için CSS */
        .touch-active {
            transform: scale(0.95) translateY(2px);
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .touch-ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.5);
            width: 100px;
            height: 100px;
            transform: scale(0);
            animation: touch-ripple 0.8s ease-out;
            pointer-events: none;
            z-index: 10;
        }
        
        @keyframes touch-ripple {
            to {
                transform: scale(3);
                opacity: 0;
            }
        }
        
        /* Swipe efektleri */
        .swipe-right-effect {
            animation: swipeRight 0.3s ease-out;
        }
        
        .swipe-left-effect {
            animation: swipeLeft 0.3s ease-out;
        }
        
        @keyframes swipeRight {
            0% { transform: translateX(0) rotate(0); }
            50% { transform: translateX(30px) rotate(3deg); }
            100% { transform: translateX(0) rotate(0); }
        }
        
        @keyframes swipeLeft {
            0% { transform: translateX(0) rotate(0); }
            50% { transform: translateX(-30px) rotate(-3deg); }
            100% { transform: translateX(0) rotate(0); }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Gelişmiş hover animasyonları
 */
function addHoverAnimations() {
    // Buton animasyonları için destek ekle (destekleyen cihazlarda)
    if (window.matchMedia('(hover: hover)').matches) {
        const buttons = document.querySelectorAll('button, .cta-button a, .cta-primary, .cta-secondary');
        
        buttons.forEach(button => {
            // Mouse takip eden parlaklık efekti
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Parlama efekti için özel bir CSS değişkeni ekle
                this.style.setProperty('--x-pos', `${x}px`);
                this.style.setProperty('--y-pos', `${y}px`);
                this.classList.add('glow-effect');
            });
            
            button.addEventListener('mouseleave', function() {
                this.classList.remove('glow-effect');
            });
        });
        
        // CSS ekle
        const style = document.createElement('style');
        style.textContent = `
            .glow-effect {
                background-image: radial-gradient(circle at var(--x-pos, center) var(--y-pos, center), rgba(255,255,255,0.2) 0%, transparent 50%);
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Mobil cihazlar için özel etkileşimler
 */
function addMobileInteractivity() {
    // Dokunmatik cihazlar için özel efektler
    if (window.matchMedia('(hover: none)').matches) {
        // Dokunma efektleri
        const interactiveElements = document.querySelectorAll('.cta-button a, .cta-primary, .cta-secondary, .social-icons a');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-effect');
            });
            
            element.addEventListener('touchend', function() {
                // Hafif gecikme ile efekti kaldır
                setTimeout(() => {
                    this.classList.remove('touch-effect');
                }, 300);
            });
        });
        
        // CSS ekle
        const style = document.createElement('style');
        style.textContent = `
            .touch-effect {
                transform: scale(0.95) translateY(2px) !important;
                transition: transform 0.2s ease-out !important;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Manyetik hover efekti
 */
function addMagneticEffect() {
    // Hover desteği olan cihazlarda çalış
    if (window.matchMedia('(hover: hover)').matches) {
        const buttons = document.querySelectorAll('.cta-primary, .cta-secondary, .cta-button a');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Manyetik çekim efekti - hareket miktarını sınırla
                const moveX = x * 0.2;
                const moveY = y * 0.2;
                
                this.style.transform = `translate(${moveX}px, ${moveY}px)`;
                
                // İçindeki ikonu daha fazla hareket ettir
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = `translate(${moveX * 2}px, ${moveY * 2}px)`;
                }
            });
            
            button.addEventListener('mouseleave', function() {
                // Pozisyonu yumuşak bir şekilde sıfırla
                this.style.transition = 'transform 0.5s ease-out';
                this.style.transform = 'translate(0, 0)';
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transition = 'transform 0.5s ease-out';
                    icon.style.transform = 'translate(0, 0)';
                }
                
                // Transition'ı sıfırla
                setTimeout(() => {
                    this.style.transition = '';
                    if (icon) icon.style.transition = '';
                }, 500);
            });
        });
    }
}

/**
 * Morph animasyonları
 */
function addMorphAnimations() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (menuToggle) {
        // Mevcut ikonu SVG ile değiştir
        const icon = menuToggle.querySelector('i');
        if (icon) {
            const iconClass = icon.className;
            const isBars = iconClass.includes('fa-bars');
            
            // SVG ikonu oluştur
            const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgIcon.setAttribute('viewBox', '0 0 100 100');
            svgIcon.setAttribute('width', '24');
            svgIcon.setAttribute('height', '24');
            svgIcon.classList.add('menu-icon-svg');
            
            // Hamburger çizgileri
            const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path1.setAttribute('d', 'M20,30 L80,30');
            path1.classList.add('menu-line', 'line-1');
            
            const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path2.setAttribute('d', 'M20,50 L80,50');
            path2.classList.add('menu-line', 'line-2');
            
            const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path3.setAttribute('d', 'M20,70 L80,70');
            path3.classList.add('menu-line', 'line-3');
            
            svgIcon.appendChild(path1);
            svgIcon.appendChild(path2);
            svgIcon.appendChild(path3);
            
            // İkonu değiştir
            icon.parentNode.replaceChild(svgIcon, icon);
            
            // CSS ekle
            const style = document.createElement('style');
            style.textContent = `
                .menu-icon-svg {
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                }
                
                .menu-line {
                    fill: none;
                    stroke: var(--color-text);
                    stroke-width: 6;
                    stroke-linecap: round;
                    transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
                }
                
                .mobile-menu-toggle.active .line-1 {
                    transform: translateY(20px) rotate(45deg);
                    stroke: var(--color-primary);
                }
                
                .mobile-menu-toggle.active .line-2 {
                    opacity: 0;
                }
                
                .mobile-menu-toggle.active .line-3 {
                    transform: translateY(-20px) rotate(-45deg);
                    stroke: var(--color-primary);
                }
            `;
            document.head.appendChild(style);
            
            // Tıklama olayı ekle
            menuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        }
    }
}

/**
 * Gelişmiş dalgalanma efekti
 */
function enhancedRippleEffect() {
    const buttons = document.querySelectorAll('.cta-button a, .cta-primary, .cta-secondary, .btn-3d, .btn-glass, .btn-neumorphic, .btn-glow, .btn-gradient, .btn-outline');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Butonun rengini al
            const computedStyle = window.getComputedStyle(this);
            const bgColor = computedStyle.backgroundColor;
            const rgbValues = bgColor.match(/\d+/g);
            
            // Çoklu dalgalanma efekti
            for (let i = 0; i < 3; i++) {
                const ripple = document.createElement('span');
                ripple.classList.add('enhanced-ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                // Farklı boyutlar ve gecikmeler
                ripple.style.setProperty('--scale', 2 + i * 0.5);
                ripple.style.setProperty('--delay', `${i * 100}ms`);
                
                // Buton rengine göre ripple rengini ayarla
                if (rgbValues && rgbValues.length >= 3) {
                    ripple.style.backgroundColor = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0.5)`;
                } else {
                    // Eğer renk alınamazsa, buton sınıfına göre renk belirle
                    if (this.classList.contains('btn-primary') || this.classList.contains('cta-primary')) {
                        ripple.style.backgroundColor = 'rgba(248, 195, 205, 0.5)'; // Primary renk
                    } else if (this.classList.contains('btn-secondary') || this.classList.contains('cta-secondary')) {
                        ripple.style.backgroundColor = 'rgba(165, 222, 241, 0.5)'; // Secondary renk
                    } else {
                        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // Varsayılan beyaz
                    }
                }
                
                this.appendChild(ripple);
                
                // Animasyon bitince elementi kaldır
                setTimeout(() => {
                    ripple.remove();
                }, 800 + i * 100);
            }
        });
    });
}

/**
 * Mikro-etkileşimler
 */
function addMicroInteractions() {
    // Sosyal medya ikonları için
    const socialIcons = document.querySelectorAll('.social-icons a');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            const iconElement = this.querySelector('i');
            if (iconElement) {
                // Rastgele bir animasyon seç
                const animations = ['bounce', 'shake', 'tada', 'swing'];
                const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
                
                iconElement.classList.add(randomAnimation);
                
                // Animasyon bitince sınıfı kaldır
                setTimeout(() => {
                    iconElement.classList.remove(randomAnimation);
                }, 1000);
            }
        });
    });
    
    // Özellik kartları için
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.classList.add('pulse-animation');
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.classList.remove('pulse-animation');
            }
        });
    });
}

/**
 * Gelişmiş dokunmatik geri bildirim
 */
function enhancedTouchFeedback() {
    if ('ontouchstart' in window) {
        const interactiveElements = document.querySelectorAll(
            '.cta-button a, .cta-primary, .cta-secondary, .social-icons a, .mobile-menu-toggle, .bottom-nav a'
        );
        
        interactiveElements.forEach(element => {
            // Dokunma başlangıcında
            element.addEventListener('touchstart', function(e) {
                // Haptic feedback (titreşim) - destekleyen cihazlarda
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
                
                this.classList.add('touch-active');
                
                // Dokunma pozisyonuna göre dalgalanma efekti
                const rect = this.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const y = e.touches[0].clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.classList.add('touch-ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                this.appendChild(ripple);
                
                // Animasyon bitince elementi kaldır
                setTimeout(() => {
                    ripple.remove();
                }, 800);
            });
            
            // Dokunma bitiminde
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 300);
            });
        });
        
        // Alt navigasyon için özel stil
        const style = document.createElement('style');
        style.textContent = `
            .bottom-nav a.touch-active {
                background-color: rgba(248, 195, 205, 0.2);
                border-radius: 12px;
            }
            
            .bottom-nav a.touch-active i {
                transform: translateY(-5px);
                color: var(--color-primary);
            }
            
            .bottom-nav a.touch-active span {
                color: var(--color-primary);
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Mobil gesture desteği
 */
function addMobileGestures() {
    // Ürün kartları için swipe desteği
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        let startX, startY, endX, endY;
        let isMoving = false;
        
        card.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isMoving = true;
            
            // Animasyon başlangıcı
            this.style.transition = 'none';
        });
        
        card.addEventListener('touchmove', function(e) {
            if (!isMoving) return;
            
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
            
            // Yatay hareket miktarı
            const diffX = endX - startX;
            
            // Yatay hareketi sınırla
            if (Math.abs(diffX) < 50) {
                this.style.transform = `translateX(${diffX}px) rotate(${diffX * 0.1}deg)`;
            }
        });
        
        card.addEventListener('touchend', function() {
            isMoving = false;
            this.style.transition = 'transform 0.3s ease-out';
            
            // Pozisyonu sıfırla
            this.style.transform = 'translateX(0) rotate(0)';
            
            // Swipe yönüne göre aksiyon
            if (endX && startX) {
                const diffX = endX - startX;
                
                if (diffX > 100) {
                    // Sağa swipe - önceki ürün
                    this.classList.add('swipe-right-effect');
                    setTimeout(() => this.classList.remove('swipe-right-effect'), 300);
                } else if (diffX < -100) {
                    // Sola swipe - sonraki ürün
                    this.classList.add('swipe-left-effect');
                    setTimeout(() => this.classList.remove('swipe-left-effect'), 300);
                }
            }
            
            startX = null;
            startY = null;
            endX = null;
            endY = null;
        });
    });
}

/**
 * Performans optimizasyonu
 */
function optimizePerformance() {
    // Cihaz performansını kontrol et
    const isLowPerformance = window.navigator.deviceMemory < 4 ||
                            window.navigator.hardwareConcurrency < 4 ||
                            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isLowPerformance) {
        // Düşük performanslı cihazlar için animasyonları basitleştir
        document.documentElement.classList.add('low-performance');
        
        // Bazı animasyonları devre dışı bırak
        const style = document.createElement('style');
        style.textContent = `
            .low-performance .animated-element {
                animation: none !important;
            }
            
            .low-performance .enhanced-ripple {
                display: none !important;
            }
            
            .low-performance .btn-neumorphic,
            .low-performance .btn-glass,
            .low-performance .btn-3d,
            .low-performance .btn-glow,
            .low-performance .btn-gradient {
                transition: transform 0.3s ease !important;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
                background: var(--color-primary) !important;
            }
            
            .low-performance .social-icons a::before {
                display: none !important;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .low-performance .btn-glass {
                backdrop-filter: none;
                -webkit-backdrop-filter: none;
            }
            
            .low-performance .wave-divider {
                display: none !important;
            }
            
            .low-performance .parallax-bg {
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // Animasyon sayısını azalt
        const animatedElements = document.querySelectorAll('.hero-element, .float-animation, .rotate-animation, .pulse-animation, .shine-animation');
        animatedElements.forEach(element => {
            element.style.animation = 'none';
        });
    }
}

/**
 * Gradient butonları uygula
 */
function applyGradientButtons() {
    const gradientButtons = document.querySelectorAll('.btn-gradient');
    
    gradientButtons.forEach((button, index) => {
        // Farklı gradient varyasyonları ekle
        if (index % 4 === 0) {
            button.classList.add('btn-gradient-primary');
        } else if (index % 4 === 1) {
            button.classList.add('btn-gradient-secondary');
        } else if (index % 4 === 2) {
            button.classList.add('btn-gradient-tertiary');
        } else {
            button.classList.add('btn-gradient-mixed');
        }
        
        // Hover efekti için mouse takibi
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Gradient pozisyonunu mouse'a göre ayarla
            const gradientPos = Math.floor((x / rect.width) * 100);
            this.style.backgroundPosition = `${gradientPos}% 0%`;
        });
    });
}

/**
 * Glow butonları uygula
 */
function applyGlowButtons() {
    const glowButtons = document.querySelectorAll('.btn-glow');
    
    glowButtons.forEach((button, index) => {
        // Farklı glow varyasyonları ekle
        if (index % 3 === 0) {
            button.classList.add('btn-glow-primary');
        } else if (index % 3 === 1) {
            button.classList.add('btn-glow-secondary');
        } else {
            button.classList.add('btn-glow-tertiary');
        }
        
        // Glow efektini mouse pozisyonuna göre ayarla
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--x', `${x}px`);
            this.style.setProperty('--y', `${y}px`);
        });
    });
}

/**
 * Outline butonları uygula
 */
function applyOutlineButtons() {
    const outlineButtons = document.querySelectorAll('.btn-outline');
    
    outlineButtons.forEach((button, index) => {
        // Farklı outline varyasyonları ekle
        if (index % 3 === 0) {
            button.classList.add('btn-outline-primary');
        } else if (index % 3 === 1) {
            button.classList.add('btn-outline-secondary');
        } else {
            button.classList.add('btn-outline-tertiary');
        }
    });
}

/**
 * Cam butonları uygula
 */
function applyGlassButtons() {
    const glassButtons = document.querySelectorAll('.btn-glass');
    
    glassButtons.forEach((button, index) => {
        // Farklı cam varyasyonları ekle
        if (index % 3 === 0) {
            button.classList.add('btn-glass-primary');
        } else if (index % 3 === 1) {
            button.classList.add('btn-glass-secondary');
        } else {
            button.classList.add('btn-glass-tertiary');
        }
    });
}

/**
 * Buton animasyonlarını geliştir
 */
function enhanceButtonAnimations() {
    const allButtons = document.querySelectorAll('button, .cta-button a, .cta-primary, .cta-secondary, .btn-3d, .btn-glass, .btn-neumorphic, .btn-glow, .btn-gradient, .btn-outline');
    
    allButtons.forEach(button => {
        // Rastgele mikro animasyonlar ekle
        button.addEventListener('mouseenter', function() {
            // Buton içindeki ikonu bul
            const icon = this.querySelector('i');
            if (icon) {
                // Rastgele bir animasyon seç
                const animations = ['bounce', 'shake', 'tada', 'swing'];
                const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
                
                icon.classList.add(randomAnimation);
                
                // Animasyon bitince sınıfı kaldır
                setTimeout(() => {
                    icon.classList.remove(randomAnimation);
                }, 1000);
            }
        });
        
        // Buton metni için hover efekti
        const buttonText = button.textContent.trim();
        if (buttonText.length > 0 && !button.querySelector('.button-text-wrapper')) {
            // Mevcut metni temizle
            button.innerHTML = '';
            
            // Metin wrapper'ı oluştur
            const textWrapper = document.createElement('span');
            textWrapper.classList.add('button-text-wrapper');
            
            // Her harf için span oluştur
            [...buttonText].forEach((char, index) => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.style.transitionDelay = `${index * 30}ms`;
                textWrapper.appendChild(charSpan);
            });
            
            button.appendChild(textWrapper);
        }
    });
}
