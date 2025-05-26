/**
 * Finans Sistemi - Konfigürasyon Dosyası
 * Tüm uygulama ayarları ve sabitler
 */

const Config = {
    // Uygulama bilgileri
    app: {
        name: 'Hayali Çizgili Finans',
        version: '2.0.0',
        author: 'Hayali Çizgili',
        description: 'Gelir-Gider Takip Sistemi'
    },

    // Veritabanı ayarları
    database: {
        name: 'hayaliCizgiliFinans',
        version: 1,
        stores: {
            transactions: 'transactions',
            categories: 'categories',
            settings: 'settings',
            backups: 'backups'
        }
    },

    // API ayarları
    api: {
        baseUrl: process.env.API_BASE_URL || '',
        timeout: 30000,
        retryAttempts: 3
    },

    // Depolama ayarları
    storage: {
        prefix: 'hc_finans_',
        encryptionKey: process.env.ENCRYPTION_KEY || 'default-key',
        sessionTimeout: 30 * 60 * 1000 // 30 dakika
    },

    // Tema ayarları
    theme: {
        default: 'light',
        colors: {
            primary: '#F8C3CD',
            secondary: '#A5DEF1',
            success: '#4CAF50',
            warning: '#FF9800',
            danger: '#F44336',
            info: '#2196F3'
        }
    },

    // Dil ayarları
    locale: {
        default: 'tr-TR',
        supported: ['tr-TR', 'en-US'],
        currency: {
            'tr-TR': { symbol: '₺', code: 'TRY', decimal: 2 },
            'en-US': { symbol: '$', code: 'USD', decimal: 2 }
        }
    },

    // Kategori varsayılanları
    defaultCategories: {
        income: [
            { name: 'Maaş', icon: 'fa-money-bill', color: '#4CAF50' },
            { name: 'Freelance', icon: 'fa-laptop', color: '#2196F3' },
            { name: 'Yatırım', icon: 'fa-chart-line', color: '#FF9800' },
            { name: 'Kira Geliri', icon: 'fa-home', color: '#9C27B0' },
            { name: 'Diğer', icon: 'fa-plus', color: '#607D8B' }
        ],
        expense: [
            { name: 'Market', icon: 'fa-shopping-cart', color: '#F44336' },
            { name: 'Ulaşım', icon: 'fa-car', color: '#3F51B5' },
            { name: 'Faturalar', icon: 'fa-file-invoice', color: '#009688' },
            { name: 'Kira', icon: 'fa-home', color: '#795548' },
            { name: 'Sağlık', icon: 'fa-heartbeat', color: '#E91E63' },
            { name: 'Eğitim', icon: 'fa-graduation-cap', color: '#673AB7' },
            { name: 'Eğlence', icon: 'fa-gamepad', color: '#00BCD4' },
            { name: 'Giyim', icon: 'fa-tshirt', color: '#CDDC39' },
            { name: 'Diğer', icon: 'fa-ellipsis-h', color: '#9E9E9E' }
        ]
    },

    // Grafik ayarları
    charts: {
        colors: [
            '#F8C3CD', '#A5DEF1', '#D1C1E6', '#FFE5B4',
            '#C7E9C0', '#FFDAB9', '#E6E6FA', '#F0E68C'
        ],
        defaultType: 'doughnut',
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        }
    },

    // Yedekleme ayarları
    backup: {
        autoBackup: true,
        interval: 24 * 60 * 60 * 1000, // 24 saat
        maxBackups: 30,
        compression: true
    },

    // Güvenlik ayarları
    security: {
        sessionTimeout: 30 * 60 * 1000, // 30 dakika
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 dakika
        passwordMinLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true
    },

    // Performans ayarları
    performance: {
        debounceDelay: 300,
        throttleDelay: 1000,
        lazyLoadThreshold: 0.1,
        cacheExpiry: 60 * 60 * 1000, // 1 saat
        maxDataPoints: 1000
    },

    // Bildirim ayarları
    notifications: {
        enabled: true,
        sound: true,
        desktop: true,
        reminders: {
            bills: true,
            budget: true,
            backup: true
        }
    }
};

// Ortam değişkenlerini kontrol et ve üzerine yaz
if (typeof process !== 'undefined' && process.env) {
    Object.keys(process.env).forEach(key => {
        if (key.startsWith('HC_FINANS_')) {
            const configKey = key.replace('HC_FINANS_', '').toLowerCase();
            const keys = configKey.split('_');
            let current = Config;
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = process.env[key];
        }
    });
}

// Değiştirilemez hale getir
Object.freeze(Config);

export default Config;
