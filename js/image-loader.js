/**
 * Hayali Çizgili - Görsel Yükleme Script
 * Bu script, ürün görsellerinin doğru bir şekilde yüklenmesini sağlar
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Görsel yükleyici başlatıldı...');
    
    // Tüm ürün görsellerini seç
    const productImages = document.querySelectorAll('.product-image img');
    
    // Her görsel için
    productImages.forEach((img, index) => {
        // Görselin mevcut yolunu al
        const originalSrc = img.getAttribute('src');
        
        // Önbellek sorunlarını aşmak için zaman damgası ekle
        const timeStamp = new Date().getTime();
        const newSrc = originalSrc + '?v=' + timeStamp;
        
        console.log(`Görsel yükleniyor: ${newSrc}`);
        
        // Yükleme hatası olduğunda yeniden dene
        img.onerror = function() {
            console.log(`Görsel yüklenemedi, yeniden deneniyor: ${originalSrc}`);
            setTimeout(() => {
                img.src = newSrc;
            }, 500);
        };
        
        // Yükleme başarılı olduğunda bildir
        img.onload = function() {
            console.log(`Görsel başarıyla yüklendi: ${newSrc}`);
            img.style.opacity = 1;
        };
        
        // Yeni src ile görsel yüklemeyi başlat
        img.src = newSrc;
        
        // Görsel için geçiş efekti
        img.style.opacity = 0;
        img.style.transition = 'opacity 0.5s ease-in-out';
    });
});