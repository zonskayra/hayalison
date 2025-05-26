/**
 * Kimlik Doğrulama Sistemi
 * Supabase Auth ile kullanıcı giriş/kayıt işlemleri
 */

class AuthManager {
    constructor() {
        this.supabase = window.supabaseManager;
        this.currentUser = null;
        this.authStateListeners = [];
        
        // Auth durumu değişikliklerini dinle
        this.supabase.onAuthStateChange((event, session) => {
            this.handleAuthStateChange(event, session);
        });
        
        // Sayfa yüklendiğinde mevcut kullanıcıyı kontrol et
        this.checkCurrentUser();
    }

    /**
     * Mevcut kullanıcıyı kontrol et
     */
    async checkCurrentUser() {
        const user = await this.supabase.getCurrentUser();
        if (user) {
            this.currentUser = user;
            this.showMainApp();
        } else {
            this.showAuthPage();
        }
    }

    /**
     * Auth durumu değişikliklerini işle
     */
    handleAuthStateChange(event, session) {
        console.log('Auth state changed:', event, session);
        
        switch (event) {
            case 'SIGNED_IN':
                this.currentUser = session.user;
                this.showMainApp();
                this.notifyAuthListeners('signed_in', session.user);
                break;
                
            case 'SIGNED_OUT':
                this.currentUser = null;
                this.showAuthPage();
                this.clearLocalData();
                this.notifyAuthListeners('signed_out', null);
                break;
                
            case 'TOKEN_REFRESHED':
                console.log('Token refreshed');
                break;
        }
    }

    /**
     * Auth state listeners'ları bilgilendir
     */
    notifyAuthListeners(event, user) {
        this.authStateListeners.forEach(listener => {
            try {
                listener(event, user);
            } catch (error) {
                console.error('Auth listener error:', error);
            }
        });
    }

    /**
     * Auth state listener ekle
     */
    addAuthStateListener(callback) {
        this.authStateListeners.push(callback);
    }

    /**
     * Email ile kayıt ol
     */
    async signUp(email, password, confirmPassword) {
        try {
            // Şifre kontrolü
            if (password !== confirmPassword) {
                throw new Error('Şifreler eşleşmiyor');
            }

            if (password.length < 6) {
                throw new Error('Şifre en az 6 karakter olmalıdır');
            }

            // Email format kontrolü
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Geçerli bir email adresi giriniz');
            }

            this.showLoading('Kayıt işlemi yapılıyor...');

            const result = await this.supabase.signUp(email, password);
            
            if (result.success) {
                this.showSuccess('Kayıt başarılı! Email adresinizi kontrol edin.');
                return { success: true };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showError(this.getErrorMessage(error.message));
            return { success: false, error: error.message };
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Email ile giriş yap
     */
    async signIn(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email ve şifre gereklidir');
            }

            this.showLoading('Giriş yapılıyor...');

            const result = await this.supabase.signIn(email, password);
            
            if (result.success) {
                this.showSuccess('Giriş başarılı!');
                return { success: true };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showError(this.getErrorMessage(error.message));
            return { success: false, error: error.message };
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Çıkış yap
     */
    async signOut() {
        try {
            this.showLoading('Çıkış yapılıyor...');
            
            const result = await this.supabase.signOut();
            
            if (result.success) {
                this.showSuccess('Başarıyla çıkış yapıldı');
                return { success: true };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showError('Çıkış yapılırken hata oluştu');
            return { success: false, error: error.message };
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Ana uygulamayı göster
     */
    showMainApp() {
        const authContainer = document.getElementById('auth-container');
        const appContainer = document.getElementById('app-container');
        
        if (authContainer) authContainer.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';
        
        // Kullanıcı bilgilerini güncelle
        this.updateUserInfo();
        
        // Verileri yükle
        if (window.app && typeof window.app.loadUserData === 'function') {
            window.app.loadUserData();
        }
    }

    /**
     * Auth sayfasını göster
     */
    showAuthPage() {
        const authContainer = document.getElementById('auth-container');
        const appContainer = document.getElementById('app-container');
        
        if (authContainer) authContainer.style.display = 'flex';
        if (appContainer) appContainer.style.display = 'none';
    }

    /**
     * Kullanıcı bilgilerini güncelle
     */
    updateUserInfo() {
        if (!this.currentUser) return;
        
        const userEmailElements = document.querySelectorAll('.user-email');
        userEmailElements.forEach(element => {
            element.textContent = this.currentUser.email;
        });
    }

    /**
     * Yerel verileri temizle
     */
    clearLocalData() {
        // LocalStorage'daki kullanıcı verilerini temizle
        const keysToRemove = [
            'budgetTracker_transactions',
            'budgetTracker_incomeCategories',
            'budgetTracker_expenseCategories',
            'budgetTracker_settings',
            'budgetTracker_autoExpenses',
            'budgetTracker_expenseTemplates',
            'budgetTracker_expenseTemplateGroups'
        ];
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
    }

    /**
     * Hata mesajını Türkçe'ye çevir
     */
    getErrorMessage(error) {
        const errorMessages = {
            'Invalid login credentials': 'Geçersiz email veya şifre',
            'Email not confirmed': 'Email adresiniz henüz onaylanmamış',
            'User already registered': 'Bu email adresi zaten kayıtlı',
            'Password should be at least 6 characters': 'Şifre en az 6 karakter olmalıdır',
            'Invalid email': 'Geçersiz email adresi',
            'Network error': 'Bağlantı hatası. İnternet bağlantınızı kontrol edin',
            'Too many requests': 'Çok fazla deneme. Lütfen biraz bekleyin'
        };
        
        return errorMessages[error] || error || 'Bilinmeyen bir hata oluştu';
    }

    /**
     * Loading göster
     */
    showLoading(message = 'Yükleniyor...') {
        const loadingElement = document.getElementById('auth-loading');
        const loadingMessage = document.getElementById('auth-loading-message');
        
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }
        
        if (loadingMessage) {
            loadingMessage.textContent = message;
        }
    }

    /**
     * Loading gizle
     */
    hideLoading() {
        const loadingElement = document.getElementById('auth-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    /**
     * Başarı mesajı göster
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Hata mesajı göster
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Bildirim göster
     */
    showNotification(message, type = 'info') {
        // Mevcut bildirimleri temizle
        const existingNotifications = document.querySelectorAll('.auth-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Yeni bildirim oluştur
        const notification = document.createElement('div');
        notification.className = `auth-notification auth-notification-${type}`;
        notification.innerHTML = `
            <div class="auth-notification-content">
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="auth-notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;
        
        // Sayfaya ekle
        document.body.appendChild(notification);
        
        // Animasyon için kısa gecikme
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Otomatik kaldır
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    /**
     * Mevcut kullanıcıyı al
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Kullanıcı giriş yapmış mı kontrol et
     */
    isAuthenticated() {
        return !!this.currentUser;
    }

    /**
     * Auth form'larını başlat
     */
    initAuthForms() {
        // Giriş formu
        const signInForm = document.getElementById('sign-in-form');
        if (signInForm) {
            signInForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('sign-in-email').value;
                const password = document.getElementById('sign-in-password').value;
                
                await this.signIn(email, password);
            });
        }

        // Kayıt formu
        const signUpForm = document.getElementById('sign-up-form');
        if (signUpForm) {
            signUpForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('sign-up-email').value;
                const password = document.getElementById('sign-up-password').value;
                const confirmPassword = document.getElementById('sign-up-confirm-password').value;
                
                await this.signUp(email, password, confirmPassword);
            });
        }

        // Çıkış butonu
        const signOutButtons = document.querySelectorAll('.sign-out-btn');
        signOutButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.signOut();
            });
        });

        // Form geçiş butonları
        const showSignUpBtn = document.getElementById('show-sign-up');
        const showSignInBtn = document.getElementById('show-sign-in');
        
        if (showSignUpBtn) {
            showSignUpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignUpForm();
            });
        }
        
        if (showSignInBtn) {
            showSignInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignInForm();
            });
        }
    }

    /**
     * Kayıt formunu göster
     */
    showSignUpForm() {
        const signInForm = document.getElementById('sign-in-container');
        const signUpForm = document.getElementById('sign-up-container');
        
        if (signInForm) signInForm.style.display = 'none';
        if (signUpForm) signUpForm.style.display = 'block';
    }

    /**
     * Giriş formunu göster
     */
    showSignInForm() {
        const signInForm = document.getElementById('sign-in-container');
        const signUpForm = document.getElementById('sign-up-container');
        
        if (signInForm) signInForm.style.display = 'block';
        if (signUpForm) signUpForm.style.display = 'none';
    }
}

// Global auth manager instance
window.authManager = new AuthManager();
console.log('Auth Manager başarıyla başlatıldı:', window.authManager);

// Sayfa yüklendiğinde auth form'larını başlat
document.addEventListener('DOMContentLoaded', () => {
    window.authManager.initAuthForms();
});