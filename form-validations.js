/**
 * Hayali Çizgili - Form Validation System
 * Tüm form kontrollerini ve validation'ları yönetir
 */

class FormValidator {
    constructor() {
        this.init();
    }

    init() {
        // WhatsApp form validation'larını başlat
        this.setupWhatsAppValidations();
        
        // E-posta validation'larını başlat
        this.setupEmailValidations();
        
        // Telefon validation'larını başlat
        this.setupPhoneValidations();
        
        // File upload validation'larını başlat
        this.setupFileUploadValidations();
    }

    // WhatsApp validation sistemi
    setupWhatsAppValidations() {
        // WhatsApp butonlarına click event'i ekle
        document.querySelectorAll('a[href*="wa.me"], .whatsapp-btn, .btn-buy-now').forEach(button => {
            button.addEventListener('click', (e) => {
                this.validateWhatsAppOrder(e, button);
            });
        });
    }

    // E-posta validation
    setupEmailValidations() {
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateEmail(e.target);
            });
            
            input.addEventListener('input', (e) => {
                this.clearValidationError(e.target);
            });
        });
    }

    // Telefon validation
    setupPhoneValidations() {
        document.querySelectorAll('input[type="tel"], input[name*="phone"]').forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validatePhone(e.target);
            });
            
            input.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
                this.clearValidationError(e.target);
            });
        });
    }

    // File upload validation
    setupFileUploadValidations() {
        document.querySelectorAll('input[type="file"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.validateFileUpload(e.target);
            });
        });
    }

    // WhatsApp sipariş validation
    validateWhatsAppOrder(event, button) {
        let isValid = true;
        let errorMessages = [];

        // Ürün sayfasındaysak, seçimleri kontrol et
        if (window.location.pathname.includes('urun')) {
            const pageSelect = document.getElementById('pageSelect');
            const quantity = document.getElementById('quantity');
            
            if (pageSelect && !pageSelect.value) {
                errorMessages.push('Lütfen sayfa sayısını seçiniz.');
                isValid = false;
            }
            
            if (quantity && (quantity.value < 1 || quantity.value > 10)) {
                errorMessages.push('Adet 1-10 arasında olmalıdır.');
                isValid = false;
            }
        }

        // Hata varsa işlemi durdur
        if (!isValid) {
            event.preventDefault();
            this.showErrorModal(errorMessages);
            return false;
        }

        // Başarılı validation - analytics track et
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_order_attempt', {
                validation_passed: true,
                button_location: button.closest('section')?.id || 'unknown'
            });
        }

        return true;
    }

    // E-posta validation
    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.showValidationError(input, 'Geçerli bir e-posta adresi giriniz.');
            return false;
        }
        
        this.clearValidationError(input);
        return true;
    }

    // Telefon validation
    validatePhone(input) {
        const phone = input.value.replace(/\D/g, '');
        
        // Türk telefon numarası validation
        if (phone && phone.length !== 11 && phone.length !== 10) {
            this.showValidationError(input, 'Geçerli bir telefon numarası giriniz. (0XXX XXX XX XX)');
            return false;
        }
        
        if (phone && !phone.startsWith('05') && phone.length === 11) {
            this.showValidationError(input, 'Cep telefonu numarası 05 ile başlamalıdır.');
            return false;
        }
        
        this.clearValidationError(input);
        return true;
    }

    // Telefon numarası formatla
    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 11) {
            value = value.substring(0, 11);
        }
        
        // Format: 0XXX XXX XX XX
        if (value.length >= 7) {
            value = value.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
        } else if (value.length >= 4) {
            value = value.replace(/(\d{4})(\d{3})/, '$1 $2');
        }
        
        input.value = value;
    }

    // File upload validation
    validateFileUpload(input) {
        const files = input.files;
        const maxSize = 25 * 1024 * 1024; // 25MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
        let errorMessages = [];

        Array.from(files).forEach((file, index) => {
            // Dosya boyutu kontrolü
            if (file.size > maxSize) {
                errorMessages.push(`${file.name}: Dosya boyutu 25MB'dan küçük olmalıdır.`);
            }
            
            // Dosya tipi kontrolü
            if (!allowedTypes.includes(file.type)) {
                errorMessages.push(`${file.name}: Sadece JPG, PNG ve HEIC formatları kabul edilir.`);
            }
            
            // Dosya sayısı kontrolü
            if (files.length > 20) {
                errorMessages.push('Maksimum 20 dosya yükleyebilirsiniz.');
            }
        });

        if (errorMessages.length > 0) {
            this.showErrorModal(errorMessages);
            input.value = ''; // Dosya seçimini temizle
            return false;
        }

        return true;
    }

    // Validation hatası göster
    showValidationError(input, message) {
        this.clearValidationError(input);
        
        input.classList.add('validation-error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-message';
        errorDiv.textContent = message;
        
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }

    // Validation hatasını temizle
    clearValidationError(input) {
        input.classList.remove('validation-error');
        
        const existingError = input.parentNode.querySelector('.validation-message');
        if (existingError) {
            existingError.remove();
        }
    }

    // Hata modal'ı göster
    showErrorModal(messages) {
        // Modal oluştur
        const modal = document.createElement('div');
        modal.className = 'validation-modal';
        modal.innerHTML = `
            <div class="validation-modal-content">
                <div class="validation-modal-header">
                    <h3><i class="fas fa-exclamation-triangle"></i> Dikkat</h3>
                    <button class="validation-modal-close">&times;</button>
                </div>
                <div class="validation-modal-body">
                    <ul>
                        ${messages.map(msg => `<li>${msg}</li>`).join('')}
                    </ul>
                </div>
                <div class="validation-modal-footer">
                    <button class="btn-modal-ok">Tamam</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Modal kapatma event'leri
        modal.querySelector('.validation-modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        modal.querySelector('.btn-modal-ok').addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // ESC tuşu ile kapama
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
            }
        });
    }

    // Modal'ı kapat
    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    // Form submission validation
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                this.showValidationError(input, 'Bu alan zorunludur.');
                isValid = false;
            }
            
            if (input.type === 'email' && !this.validateEmail(input)) {
                isValid = false;
            }
            
            if (input.type === 'tel' && !this.validatePhone(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
}

// CSS stilleri ekle
const validationStyles = `
<style>
.validation-error {
    border: 2px solid #e74c3c !important;
    background-color: #fdf2f2 !important;
}

.validation-message {
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.validation-message::before {
    content: "⚠️";
    font-size: 0.8rem;
}

.validation-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: modalFadeIn 0.3s ease;
}

.validation-modal-content {
    background: white;
    border-radius: 15px;
    max-width: 500px;
    width: 90%;
    max-height: 80%;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: modalSlideIn 0.3s ease;
}

.validation-modal-header {
    padding: 25px 25px 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.validation-modal-header h3 {
    margin: 0;
    color: #e74c3c;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.2rem;
}

.validation-modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.validation-modal-close:hover {
    background: #f5f5f5;
    color: #333;
}

.validation-modal-body {
    padding: 20px 25px;
}

.validation-modal-body ul {
    margin: 0;
    padding-left: 20px;
    list-style-type: none;
}

.validation-modal-body li {
    margin-bottom: 10px;
    position: relative;
    padding-left: 25px;
}

.validation-modal-body li::before {
    content: "✗";
    color: #e74c3c;
    font-weight: bold;
    position: absolute;
    left: 0;
}

.validation-modal-footer {
    padding: 15px 25px 25px;
    text-align: center;
}

.btn-modal-ok {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-modal-ok:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

@keyframes modalFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes modalSlideIn {
    from { 
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
    }
    to { 
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@media (max-width: 768px) {
    .validation-modal-content {
        width: 95%;
        margin: 20px;
    }
    
    .validation-modal-header,
    .validation-modal-body,
    .validation-modal-footer {
        padding-left: 20px;
        padding-right: 20px;
    }
}
</style>
`;

// Sayfa yüklendiğinde validation sistemini başlat
document.addEventListener('DOMContentLoaded', function() {
    // CSS stillerini ekle
    document.head.insertAdjacentHTML('beforeend', validationStyles);
    
    // Form validator'ı başlat
    window.formValidator = new FormValidator();
    
    // Global form validation fonksiyonu
    window.validateAndSubmit = function(form) {
        return window.formValidator.validateForm(form);
    };
    
    console.log('✅ Form Validation System initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}