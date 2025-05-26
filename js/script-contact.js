// Hayali Çizgili - İletişim Sayfası JavaScript Fonksiyonları

document.addEventListener('DOMContentLoaded', function() {
    // DOM tamamen yüklendiğinde çalışacak kodlar
    
    // ===== İletişim Formu Doğrulama ve Gönderme =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Formun normal gönderimini engelle
            
            // Form alanlarını al
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const consentInput = document.getElementById('consent');
            
            // Doğrulama için hata mesajları
            let errors = [];
            
            // Ad Soyadı doğrulama
            if (!nameInput.value.trim()) {
                errors.push('Adınız ve soyadınız gereklidir.');
                nameInput.classList.add('error');
            } else {
                nameInput.classList.remove('error');
            }
            
            // E-posta doğrulama
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                errors.push('Geçerli bir e-posta adresi giriniz.');
                emailInput.classList.add('error');
            } else {
                emailInput.classList.remove('error');
            }
            
            // Telefon doğrulama (opsiyonel)
            if (phoneInput.value.trim()) {
                const phoneRegex = /^[0-9\s\+\-\(\)]{10,15}$/;
                if (!phoneRegex.test(phoneInput.value.trim())) {
                    errors.push('Geçerli bir telefon numarası giriniz.');
                    phoneInput.classList.add('error');
                } else {
                    phoneInput.classList.remove('error');
                }
            }
            
            // Konu doğrulama
            if (!subjectInput.value || subjectInput.value === '') {
                errors.push('Lütfen bir konu seçiniz.');
                subjectInput.classList.add('error');
            } else {
                subjectInput.classList.remove('error');
            }
            
            // Mesaj doğrulama
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                errors.push('Mesajınız en az 10 karakter olmalıdır.');
                messageInput.classList.add('error');
            } else {
                messageInput.classList.remove('error');
            }
            
            // Onay kutusu doğrulama
            if (!consentInput.checked) {
                errors.push('Kişisel verilerinizin işlenmesine izin vermeniz gerekmektedir.');
                consentInput.classList.add('error');
            } else {
                consentInput.classList.remove('error');
            }
            
            // Hata varsa göster
            if (errors.length > 0) {
                showFormErrors(errors);
                return;
            }
            
            // Form verilerini topla
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                subject: subjectInput.value,
                message: messageInput.value.trim(),
                consent: consentInput.checked
            };
            
            // Form gönderimi simülasyonu
            simulateFormSubmission(formData);
        });
    }
    
    // Hata mesajlarını göster
    function showFormErrors(errors) {
        // Varsa önceki hata mesajlarını temizle
        const existingErrorContainer = document.querySelector('.form-errors');
        if (existingErrorContainer) {
            existingErrorContainer.remove();
        }
        
        // Hata mesajları için konteyner oluştur
        const errorContainer = document.createElement('div');
        errorContainer.className = 'form-errors';
        errorContainer.style.backgroundColor = '#ffebee';
        errorContainer.style.color = '#f44336';
        errorContainer.style.padding = '1rem';
        errorContainer.style.borderRadius = 'var(--radius-md)';
        errorContainer.style.marginBottom = '1.5rem';
        
        // Hata başlığı
        const errorTitle = document.createElement('h4');
        errorTitle.textContent = 'Lütfen aşağıdaki hataları düzeltin:';
        errorTitle.style.marginBottom = '0.5rem';
        errorTitle.style.fontSize = '1rem';
        errorContainer.appendChild(errorTitle);
        
        // Hata listesi
        const errorList = document.createElement('ul');
        errorList.style.paddingLeft = '1.5rem';
        errorList.style.marginBottom = '0';
        
        errors.forEach(error => {
            const errorItem = document.createElement('li');
            errorItem.textContent = error;
            errorItem.style.fontSize = '0.9rem';
            errorItem.style.marginBottom = '0.3rem';
            errorList.appendChild(errorItem);
        });
        
        errorContainer.appendChild(errorList);
        
        // Hata konteynerini formun başına ekle
        contactForm.insertBefore(errorContainer, contactForm.firstChild);
        
        // Sayfayı hata mesajlarına kaydır
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Form gönderimi simülasyonu
    function simulateFormSubmission(formData) {
        // Gönderme butonunu devre dışı bırak ve yükleniyor göster
        const submitButton = contactForm.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Gönderiliyor...';
        
        // Form gönderimini simüle et (gerçek uygulamada burada API çağrısı yapılır)
        setTimeout(() => {
            // Başarılı gönderim simülasyonu
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            // Formu temizle
            contactForm.reset();
            
            // Başarı mesajı göster
            showSuccessMessage();
            
            // Konsola form verilerini yazdır (gerçek uygulamada kaldırılabilir)
            console.log('Form verileri:', formData);
        }, 2000); // 2 saniye simüle edilmiş gecikme
    }
    
    // Başarı mesajı göster
    function showSuccessMessage() {
        // Varsa önceki hata mesajlarını temizle
        const existingErrorContainer = document.querySelector('.form-errors');
        if (existingErrorContainer) {
            existingErrorContainer.remove();
        }
        
        // Başarı mesajı için konteyner oluştur
        const successContainer = document.createElement('div');
        successContainer.className = 'form-success';
        successContainer.style.backgroundColor = '#e8f5e9';
        successContainer.style.color = '#4caf50';
        successContainer.style.padding = '1rem';
        successContainer.style.borderRadius = 'var(--radius-md)';
        successContainer.style.marginBottom = '1.5rem';
        successContainer.style.textAlign = 'center';
        
        // Başarı mesajı
        const successMessage = document.createElement('p');
        successMessage.textContent = 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.';
        successMessage.style.marginBottom = '0';
        successMessage.style.fontSize = '1rem';
        successContainer.appendChild(successMessage);
        
        // Başarı konteynerini formun başına ekle
        contactForm.insertBefore(successContainer, contactForm.firstChild);
        
        // Sayfayı başarı mesajına kaydır
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // 5 saniye sonra başarı mesajını kaldır
        setTimeout(() => {
            successContainer.style.opacity = '0';
            successContainer.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                successContainer.remove();
            }, 500);
        }, 5000);
    }
    
    // ===== SSS Akordeon Menü =====
    const accordionItems = document.querySelectorAll('.mobile-accordion-item');
    
    if (accordionItems.length) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.mobile-accordion-header');
            
            header.addEventListener('click', function() {
                // Diğer tüm öğeleri kapat
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Bu öğeyi aç/kapat
                item.classList.toggle('active');
            });
        });
    }
});