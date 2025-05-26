/**
 * Finans Sistemi - Ana Uygulama
 * Uygulama başlatma ve yönetim
 */

import Config from './config.js';
import Router from './router.js';
import storageService from '../services/storage.js';
import { initializeCategories } from '../modules/categories.js';
import { showNotification } from '../utils/helpers.js';

class FinanceApp {
    constructor() {
        this.config = Config;
        this.isInitialized = false;
        this.currentUser = null;
        this.router = null;
    }

    /**
     * Uygulamayı başlat
     */
    async init() {
        try {
            console.log('Finans uygulaması başlatılıyor...');
            
            // Loading ekranını göster
            this.showLoadingScreen();
            
            // Veritabanını başlat
            await storageService.init();
            console.log('Veritabanı başarıyla başlatıldı');
            
            // Router'ı başlat
            this.router = new Router();
            await this.router.init();
            
            // Temel verileri yükle
            await this.loadInitialData();
            
            // Event listener'ları ekle
            this.setupEventListeners();
            
            // Service Worker'ı kaydet
            await this.registerServiceWorker();
            
            // Tema ayarlarını uygula
            this.applyTheme();
            
            // Otomatik yedeklemeyi başlat
            this.startAutoBackup();
            
            this.isInitialized = true;
            console.log('Uygulama başarıyla başlatıldı');
            
            // Loading ekranını gizle
            this.hideLoadingScreen();
            
            // Ana sayfaya yönlendir
            this.router.navigate('/dashboard');
            
        } catch (error) {
            console.error('Uygulama başlatma hatası:', error);
            this.showError('Uygulama başlatılamadı. Lütfen sayfayı yenileyin.');
        }
    }

    /**
     * İlk verileri yükle
     */
    async loadInitialData() {
        try {
            // Kategoriler yoksa varsayılanları ekle
            const categories = await storageService.getAll('categories');
            if (categories.length === 0) {
                await initializeCategories();
                console.log('Varsayılan kategoriler oluşturuldu');
            }
            
            // Kullanıcı ayarlarını yükle
            const settings = await storageService.get('settings', 'userPreferences');
            if (settings) {
                this.applySettings(settings.value);
            }
            
        } catch (error) {
            console.error('İlk veri yükleme hatası:', error);
        }
    }

    /**
     * Event listener'ları ayarla
     */
    setupEventListeners() {
        // Offline/Online durumu
        window.addEventListener('online', () => {
            showNotification('İnternet bağlantısı yeniden kuruldu', 'success');
            this.syncData();
        });
        
        window.addEventListener('offline', () => {
            showNotification('İnternet bağlantısı kesildi', 'warning');
        });
        
        // Sayfa kapatılırken
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = 'Kaydedilmemiş değişiklikleriniz var. Çıkmak istediğinize emin misiniz?';
            }
        });
        
        // Klavye kısayolları
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S: Kaydet
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveCurrentForm();
            }
            
            // Ctrl/Cmd + N: Yeni işlem
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.router.navigate('/transaction/new');
            }
            
            // Esc: Modal kapat
            if (e.key === 'Escape') {
                this.closeActiveModal();
            }
        });
        
        // Tema değişimi
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.getThemePreference() === 'system') {
                this.applyTheme();
            }
        });
    }

    /**
     * Service Worker kaydet
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/finans/service-worker.js');
                console.log('Service Worker kayıt edildi:', registration.scope);
                
                // Güncelleme kontrolü
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showNotification('Yeni güncelleme mevcut. Sayfayı yenileyin.', 'info');
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker kayıt hatası:', error);
            }
        }
    }

    /**
     * Tema uygula
     */
    applyTheme() {
        const theme = this.getThemePreference();
        const isDark = theme === 'dark' || 
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        
        // Meta theme-color güncelle
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = isDark ? '#1a1a1a' : '#ffffff';
        }
    }

    /**
     * Tema tercihini al
     */
    getThemePreference() {
        const stored = localStorage.getItem(this.config.storage.prefix + 'theme');
        return stored || this.config.theme.default;
    }

    /**
     * Otomatik yedekleme başlat
     */
    startAutoBackup() {
        if (this.config.backup.autoBackup) {
            setInterval(async () => {
                try {
                    await this.createBackup('auto');
                    console.log('Otomatik yedekleme tamamlandı');
                } catch (error) {
                    console.error('Otomatik yedekleme hatası:', error);
                }
            }, this.config.backup.interval);
        }
    }

    /**
     * Yedekleme oluştur
     */
    async createBackup(type = 'manual') {
        try {
            const backupData = await storageService.exportData();
            
            await storageService.add('backups', {
                date: new Date().toISOString(),
                type: type,
                data: backupData,
                size: JSON.stringify(backupData).length
            });
            
            // Eski yedekleri temizle
            await this.cleanOldBackups();
            
            if (type === 'manual') {
                showNotification('Yedekleme başarıyla oluşturuldu', 'success');
            }
            
            return backupData;
        } catch (error) {
            console.error('Yedekleme hatası:', error);
            if (type === 'manual') {
                showNotification('Yedekleme oluşturulamadı', 'error');
            }
            throw error;
        }
    }

    /**
     * Eski yedekleri temizle
     */
    async cleanOldBackups() {
        const backups = await storageService.getAll('backups');
        
        if (backups.length > this.config.backup.maxBackups) {
            // Tarihe göre sırala (eskiden yeniye)
            backups.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Fazla olanları sil
            const toDelete = backups.slice(0, backups.length - this.config.backup.maxBackups);
            
            for (const backup of toDelete) {
                await storageService.delete('backups', backup.id);
            }
        }
    }

    /**
     * Veri senkronizasyonu
     */
    async syncData() {
        if (!navigator.onLine) return;
        
        try {
            // TODO: API ile senkronizasyon
            console.log('Veri senkronizasyonu başlatıldı');
        } catch (error) {
            console.error('Senkronizasyon hatası:', error);
        }
    }

    /**
     * Loading ekranı göster
     */
    showLoadingScreen() {
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.style.display = 'flex';
        }
    }

    /**
     * Loading ekranı gizle
     */
    hideLoadingScreen() {
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Hata göster
     */
    showError(message) {
        showNotification(message, 'error');
        console.error(message);
    }

    /**
     * Kaydedilmemiş değişiklik kontrolü
     */
    hasUnsavedChanges() {
        const forms = document.querySelectorAll('form[data-changed="true"]');
        return forms.length > 0;
    }

    /**
     * Aktif formu kaydet
     */
    saveCurrentForm() {
        const activeForm = document.querySelector('form[data-changed="true"]');
        if (activeForm) {
            const submitButton = activeForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        }
    }

    /**
     * Aktif modalı kapat
     */
    closeActiveModal() {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Ayarları uygula
     */
    applySettings(settings) {
        if (settings.theme) {
            localStorage.setItem(this.config.storage.prefix + 'theme', settings.theme);
            this.applyTheme();
        }
        
        if (settings.locale) {
            this.setLocale(settings.locale);
        }
        
        if (settings.notifications !== undefined) {
            this.config.notifications.enabled = settings.notifications;
        }
    }

    /**
     * Dil ayarla
     */
    setLocale(locale) {
        if (this.config.locale.supported.includes(locale)) {
            document.documentElement.lang = locale;
            localStorage.setItem(this.config.storage.prefix + 'locale', locale);
            // TODO: Dil dosyalarını yükle ve uygula
        }
    }

    /**
     * Uygulamayı sıfırla
     */
    async reset() {
        if (confirm('Tüm verileriniz silinecek. Emin misiniz?')) {
            try {
                await storageService.deleteDatabase();
                localStorage.clear();
                sessionStorage.clear();
                location.reload();
            } catch (error) {
                console.error('Sıfırlama hatası:', error);
                showNotification('Uygulama sıfırlanamadı', 'error');
            }
        }
    }
}

// Singleton instance
const app = new FinanceApp();

// Global erişim için
window.FinanceApp = app;

// DOMContentLoaded'da başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

export default app;
