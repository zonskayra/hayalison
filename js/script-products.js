// Hayali Çizgili - Ürünler Sayfası JavaScript Fonksiyonları

document.addEventListener('DOMContentLoaded', function() {
    // DOM tamamen yüklendiğinde çalışacak kodlar
    
    // ===== Ürün Filtreleme =====
    function setupProductFiltering() {
        const filterButtons = document.querySelectorAll('.filter-button');
        const productCards = document.querySelectorAll('.product-card');
        
        if (!filterButtons.length || !productCards.length) return;
        
        // Filtreleme fonksiyonu
        function filterProducts(category) {
            productCards.forEach(card => {
                // Eğer kategori "all" ise veya kart o kategoriye aitse göster
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    // Animasyon için önce opacity 0 ve transform
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    // Kısa bir gecikme sonra görünür yap (CSS transition için)
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    // Animasyonla gizle
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    // Animasyon tamamlandıktan sonra display none yap
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // CSS transition süresiyle eşleşmeli
                }
            });
        }
        
        // Filtre butonlarına tıklama olayı ekle
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Aktif sınıfını kaldır
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Bu butona aktif sınıfını ekle
                this.classList.add('active');
                
                // Ürünleri filtrele
                const category = this.dataset.filter;
                filterProducts(category);
            });
        });
        
        // Sayfa yüklendiğinde aktif filtreyi uygula
        const activeFilter = document.querySelector('.filter-button.active');
        if (activeFilter) {
            filterProducts(activeFilter.dataset.filter);
        }
    }
    
    // ===== Müşteri Yorumları Karuseli =====
    function setupTestimonialsCarousel() {
        const testimonialsContainer = document.querySelector('#testimonials .testimonials-container');
        if (!testimonialsContainer) return;
        
        const testimonials = testimonialsContainer.querySelectorAll('.testimonial-card');
        if (testimonials.length <= 1) return;
        
        const dotsContainer = document.querySelector('#testimonials .carousel-dots');
        if (!dotsContainer) return;
        
        // Nokta göstergelerini oluştur
        testimonials.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        
        // Aktif yorumu güncelle
        function updateActiveTestimonial(index) {
            // Tüm yorumları gizle
            testimonials.forEach(testimonial => {
                testimonial.style.opacity = '0';
                testimonial.style.transform = 'translateX(20px)';
                testimonial.style.pointerEvents = 'none';
            });
            
            // Aktif yorumu göster
            testimonials[index].style.opacity = '1';
            testimonials[index].style.transform = 'translateX(0)';
            testimonials[index].style.pointerEvents = 'auto';
            
            // Nokta göstergelerini güncelle
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        }
        
        // Nokta göstergelerine tıklandığında
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                updateActiveTestimonial(index);
                
                // Otomatik kaydırmayı durdur ve yeniden başlat
                clearInterval(slideInterval);
                slideInterval = setInterval(autoSlide, autoSlideInterval);
            });
        });
        
        // Otomatik kaydırma
        let currentIndex = 0;
        const autoSlideInterval = 5000; // 5 saniye
        
        function autoSlide() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateActiveTestimonial(currentIndex);
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
    
    // ===== Ürün Kartları Etkileşimleri =====
    function setupProductInteractions() {
        const products = document.querySelectorAll('.product-card');
        if (!products.length) return;
        
        // Dokunmatik cihazları tespit et
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        products.forEach(product => {
            const overlay = product.querySelector('.product-overlay');
            const image = product.querySelector('.product-image img');
            const viewButton = product.querySelector('.view-product');
            
            if (!overlay || !image || !viewButton) return;
            
            if (isTouchDevice) {
                // Dokunmatik cihazlar için
                product.addEventListener('touchstart', function(e) {
                    // Dokunmatik olayın yayılmasını engelleme (sayfa kaydırmayı engellememek için)
                    e.stopPropagation();
                    
                    // Overlay'in mevcut durumunu kontrol et
                    const isVisible = overlay.style.opacity === '1';
                    
                    // Diğer tüm ürün kartlarının overlay'lerini kapat
                    products.forEach(p => {
                        if (p !== product) {
                            const otherOverlay = p.querySelector('.product-overlay');
                            if (otherOverlay) otherOverlay.style.opacity = '0';
                        }
                    });
                    
                    // Bu ürün kartının overlay'ini aç/kapat
                    overlay.style.opacity = isVisible ? '0' : '1';
                    viewButton.style.transform = isVisible ? 'translateY(20px)' : 'translateY(0)';
                }, { passive: true });
            }
        });
    }
    
    // ===== Ürün Karşılaştırma Tablosu Kaydırma İpuçları =====
    function setupComparisonTableScrollHint() {
        const comparisonTable = document.querySelector('.comparison-table-container');
        if (!comparisonTable) return;
        
        // Mobil cihazlarda tablo kaydırılabilir olduğunda ipucu göster
        function checkTableOverflow() {
            if (comparisonTable.scrollWidth > comparisonTable.clientWidth) {
                // Kaydırma ipucu göster
                if (!document.querySelector('.table-scroll-hint')) {
                    const scrollHint = document.createElement('div');
                    scrollHint.className = 'table-scroll-hint';
                    scrollHint.innerHTML = '<i class="fas fa-arrows-left-right"></i> Tabloyu görmek için yatay kaydırın';
                    scrollHint.style.textAlign = 'center';
                    scrollHint.style.fontSize = '0.9rem';
                    scrollHint.style.color = 'var(--color-primary)';
                    scrollHint.style.marginTop = '1rem';
                    scrollHint.style.opacity = '1';
                    scrollHint.style.transition = 'opacity 0.3s ease';
                    
                    comparisonTable.parentNode.insertBefore(scrollHint, comparisonTable.nextSibling);
                    
                    // Kullanıcı tabloyu kaydırdığında ipucunu gizle
                    comparisonTable.addEventListener('scroll', function() {
                        scrollHint.style.opacity = '0';
                        
                        // Animasyon tamamlandıktan sonra elementi kaldır
                        setTimeout(() => {
                            if (scrollHint.parentNode) {
                                scrollHint.parentNode.removeChild(scrollHint);
                            }
                        }, 300);
                    }, { once: true });
                }
            }
        }
        
        // Sayfa yüklendiğinde ve pencere boyutu değiştiğinde kontrol et
        checkTableOverflow();
        window.addEventListener('resize', checkTableOverflow);
    }
    
    // ===== Fonksiyonları Çalıştır =====
    setupProductFiltering();
    setupTestimonialsCarousel();
    setupProductInteractions();
    setupComparisonTableScrollHint();
});