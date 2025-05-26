// Hayali Çizgili - Ana Sayfa JavaScript Fonksiyonları

document.addEventListener('DOMContentLoaded', function() {
    // DOM tamamen yüklendiğinde çalışacak kodlar
    
    // Sadece ana sayfada çalıştır
    const isHomePage = 
        window.location.pathname === '/' || 
        window.location.pathname.endsWith('index.html') || 
        window.location.pathname.endsWith('/tr/') || 
        window.location.pathname.endsWith('/en/');
    
    // ===== Animasyonlar =====
    function setupAnimations() {
        if (typeof gsap === 'undefined') {
            console.log("GSAP kütüphanesi yüklenemedi.");
            return;
        }
        
        // Ana sayfada değilse animasyonları çalıştırma
        if (!isHomePage) {
            return;
        }
        
        // Cihaz performansını kontrol et
        const isLowPerformanceDevice = window.navigator.hardwareConcurrency < 4 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Düşük performanslı cihazlar için daha basit animasyonlar
        const animationDuration = isLowPerformanceDevice ? 0.5 : 1;
        const useComplexAnimations = !isLowPerformanceDevice;
        
        // Her animasyon için element kontrolü yap
        
        // Hero bölümü için çizgi çizimi efekti
        if (document.querySelector(".path")) {
            gsap.from(".path", {
                strokeDashoffset: 1000,
                duration: animationDuration * 2,
                ease: "power2.out",
                stagger: 0.3
            });
        }
        
        // Gökkuşağı grupları için rastgele animasyonlar
        if (document.querySelector(".rainbow-group")) {
            gsap.to(".rainbow-group", {
                rotation: "random(-15, 15)",
                duration: "random(8, 12)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 1
            });
        }
        
        // Gökkuşağı animasyonu - Parlama efekti
        if (document.querySelector(".rainbow")) {
            gsap.to(".rainbow", {
                opacity: "random(0.3, 0.7)",
                duration: "random(1, 2)",
                repeat: -1,
                yoyo: true,
                stagger: 0.1,
                ease: "sine.inOut"
            });
        }
        
        // Gezegenler animasyonu - Rastgele dönme ve zıplama
        if (document.querySelector(".planet-group")) {
            gsap.to(".planet-group", {
                rotation: "random(-20, 20)",
                duration: "random(5, 10)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.7
            });
        }
        
        // Gezegen animasyonu - Dönme
        if (document.querySelector(".planet")) {
            gsap.to(".planet", {
                rotation: 360,
                duration: "random(15, 25)",
                repeat: -1,
                ease: "none",
                transformOrigin: "center center",
                stagger: 2
            });
            
            // Gezegen animasyonu - Hareket
            gsap.to(".planet", {
                y: "random(-10, -5)",
                x: "random(-5, 5)",
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.5
            });
        }
        
        // Boya fırçası animasyonu - Rastgele boyama hareketi
        if (document.querySelector(".brush")) {
            gsap.to(".brush", {
                rotation: "random(-20, 20)",
                x: "random(10, 30)",
                y: "random(-10, 10)",
                duration: "random(1, 3)",
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                transformOrigin: "bottom center",
                stagger: 0.7
            });
        }
        
        // Top animasyonu - Rastgele zıplama
        if (document.querySelector(".ball")) {
            gsap.to(".ball", {
                y: "random(-25, -10)",
                x: "random(-10, 10)",
                rotation: "random(-10, 10)",
                duration: "random(0.8, 1.5)",
                repeat: -1,
                yoyo: true,
                ease: "bounce.out",
                stagger: 0.3
            });
        }
        
        // Kelebek animasyonu - Rastgele uçuş
        if (document.querySelector(".butterfly")) {
            gsap.to(".butterfly", {
                x: "random(-70, 70)",
                y: "random(-50, 50)",
                rotation: "random(-25, 25)",
                duration: "random(3, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 1
            });
        }
        
        // Geometrik şekiller animasyonu
        if (document.querySelector(".shape")) {
            gsap.to(".shape", {
                rotation: "random(-30, 30)",
                scale: "random(0.8, 1.2)",
                duration: "random(3, 5)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.5
            });
        }
        
        // Yıldızlar animasyonu
        if (document.querySelector(".star")) {
            gsap.to(".star", {
                rotation: "random(-20, 20)",
                scale: "random(0.9, 1.1)",
                opacity: "random(0.3, 0.7)",
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.3
            });
        }
        
        // Glow efekti animasyonu
        if (document.querySelector("[filter]")) {
            gsap.to("[filter]", {
                attr: { stdDeviation: "random(3, 8)" },
                duration: "random(2, 5)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.2
            });
        }
        
        // ScrollTrigger ile animasyonlar
        if (typeof ScrollTrigger !== 'undefined') {
            // About bölümü için
            if (document.querySelector("#about")) {
                gsap.from("#about .section-header", {
                    scrollTrigger: {
                        trigger: "#about",
                        start: "top 80%"
                    },
                    y: 30,
                    opacity: 0,
                    duration: animationDuration
                });
            }
            
            // Info bölümü için
            if (document.querySelector("#info")) {
                gsap.from("#info .info-item", {
                    scrollTrigger: {
                        trigger: "#info",
                        start: "top 90%"
                    },
                    y: 20,
                    opacity: 0,
                    duration: animationDuration * 0.7,
                    stagger: 0.2
                });
            }
            
            // Features bölümü için
            if (document.querySelector("#features")) {
                gsap.from("#features .feature-card", {
                    scrollTrigger: {
                        trigger: "#features",
                        start: "top 85%"
                    },
                    y: 30,
                    opacity: 0,
                    duration: animationDuration * 0.8,
                    stagger: 0.15
                });
            }
            
            // Testimonials bölümü için
            if (document.querySelector("#testimonials")) {
                gsap.from("#testimonials .section-header", {
                    scrollTrigger: {
                        trigger: "#testimonials",
                        start: "top 80%"
                    },
                    y: 20,
                    opacity: 0,
                    duration: animationDuration * 0.6
                });
            }
            
            // CTA bölümü için
            if (document.querySelector("#cta")) {
                gsap.from("#cta", {
                    scrollTrigger: {
                        trigger: "#cta",
                        start: "top 85%"
                    },
                    y: 30,
                    opacity: 0,
                    duration: animationDuration
                });
            }
        }
    }
    
    // ===== Testimonials Carousel =====
    function setupTestimonialsCarousel() {
        const testimonialsContainer = document.querySelector('.testimonials-carousel');
        if (!testimonialsContainer) return;
        
        const testimonials = testimonialsContainer.querySelectorAll('.testimonial-card');
        if (testimonials.length <= 1) return;
        
        const dotsContainer = testimonialsContainer.querySelector('.carousel-dots');
        const controlsContainer = testimonialsContainer.querySelector('.carousel-controls');
        let prevButton, nextButton, dots;
        
        // Nokta göstergeleri oluştur
        if (dotsContainer) {
            testimonials.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('carousel-dot');
                dot.dataset.index = index;
                if (index === 0) dot.classList.add('active');
                dotsContainer.appendChild(dot);
            });
            
            dots = dotsContainer.querySelectorAll('.carousel-dot');
        }
        
        // Kontrol butonları
        if (controlsContainer) {
            prevButton = controlsContainer.querySelector('.prev');
            nextButton = controlsContainer.querySelector('.next');
        }
        
        // Aktif yorumu güncelle
        function updateActiveTestimonial(index) {
            testimonials.forEach(testimonial => testimonial.classList.remove('active'));
            testimonials[index].classList.add('active');
            
            if (dots) {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
            }
        }
        
        // İlk yorumu aktif et
        updateActiveTestimonial(0);
        
        // Önceki yoruma geç
        function goToPrevSlide() {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateActiveTestimonial(currentIndex);
        }
        
        // Sonraki yoruma geç
        function goToNextSlide() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateActiveTestimonial(currentIndex);
        }
        
        // Nokta göstergelerine tıklandığında
        if (dots) {
            dots.forEach(dot => {
                dot.addEventListener('click', function() {
                    clearInterval(slideInterval); // Otomatik kaydırmayı durdur
                    currentIndex = parseInt(this.dataset.index);
                    updateActiveTestimonial(currentIndex);
                    slideInterval = setInterval(autoSlide, autoSlideInterval); // Otomatik kaydırmayı yeniden başlat
                });
            });
        }
        
        // Kontrol butonlarına tıklandığında
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                clearInterval(slideInterval); // Otomatik kaydırmayı durdur
                goToPrevSlide();
                slideInterval = setInterval(autoSlide, autoSlideInterval); // Otomatik kaydırmayı yeniden başlat
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                clearInterval(slideInterval); // Otomatik kaydırmayı durdur
                goToNextSlide();
                slideInterval = setInterval(autoSlide, autoSlideInterval); // Otomatik kaydırmayı yeniden başlat
            });
        }
        
        // Otomatik kaydırma
        let currentIndex = 0;
        const autoSlideInterval = 2000; // 2 saniye (kullanıcının isteği: 1-2 saniye)
        
        function autoSlide() {
            goToNextSlide();
        }
        
        // Otomatik kaydırmayı başlat
        let slideInterval = setInterval(autoSlide, autoSlideInterval);
        
        // Kullanıcı etkileşiminde otomatik kaydırmayı durdur ve yeniden başlat
        testimonialsContainer.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        testimonialsContainer.addEventListener('mouseleave', function() {
            slideInterval = setInterval(autoSlide, autoSlideInterval);
        });
        
        // Dokunmatik cihazlar için
        testimonialsContainer.addEventListener('touchstart', function() {
            clearInterval(slideInterval);
        }, { passive: true });
        
        testimonialsContainer.addEventListener('touchend', function() {
            slideInterval = setInterval(autoSlide, autoSlideInterval);
        }, { passive: true });
    }
    
    // ===== Fonksiyonları Çalıştır =====
    // Animasyonları asenkron olarak başlat (sayfa yükleme performansı için)
    setTimeout(setupAnimations, 100);
    
    // Testimonials carousel'ı başlat
    setupTestimonialsCarousel();
});
