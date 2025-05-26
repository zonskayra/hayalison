/**
 * Finans Sistemi - Yardımcı Fonksiyonlar
 */

import Config from '../core/config.js';

/**
 * Para formatla
 */
export function formatCurrency(amount, locale = Config.locale.default) {
    const currency = Config.locale.currency[locale];
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: currency.decimal,
        maximumFractionDigits: currency.decimal
    }).format(amount);
}

/**
 * Tarih formatla
 */
export function formatDate(date, format = 'short', locale = Config.locale.default) {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (format === 'short') {
        return dateObj.toLocaleDateString(locale);
    } else if (format === 'long') {
        return dateObj.toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else if (format === 'time') {
        return dateObj.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (format === 'datetime') {
        return `${formatDate(dateObj, 'short', locale)} ${formatDate(dateObj, 'time', locale)}`;
    } else if (format === 'relative') {
        return getRelativeTime(dateObj, locale);
    } else if (format === 'input') {
        // HTML input için format
        return dateObj.toISOString().split('T')[0];
    }
    
    return dateObj.toLocaleDateString(locale);
}

/**
 * Göreli zaman hesapla
 */
function getRelativeTime(date, locale = Config.locale.default) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const now = new Date();
    const diff = date - now;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (Math.abs(days) > 30) {
        return formatDate(date, 'short', locale);
    } else if (days !== 0) {
        return rtf.format(days, 'day');
    } else if (hours !== 0) {
        return rtf.format(hours, 'hour');
    } else if (minutes !== 0) {
        return rtf.format(minutes, 'minute');
    } else {
        return rtf.format(seconds, 'second');
    }
}

/**
 * Sayı formatla
 */
export function formatNumber(number, locale = Config.locale.default) {
    return new Intl.NumberFormat(locale).format(number);
}

/**
 * Yüzde formatla
 */
export function formatPercent(value, decimals = 1, locale = Config.locale.default) {
    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100);
}

/**
 * Dosya boyutu formatla
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Debounce fonksiyonu
 */
export function debounce(func, wait = Config.performance.debounceDelay) {
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
 * Throttle fonksiyonu
 */
export function throttle(func, limit = Config.performance.throttleDelay) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * UUID oluştur
 */
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Renk üret (kategori için)
 */
export function generateColor(index) {
    const colors = Config.charts.colors;
    return colors[index % colors.length];
}

/**
 * String'i slug'a çevir
 */
export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[ğ]/g, 'g')
        .replace(/[ü]/g, 'u')
        .replace(/[ş]/g, 's')
        .replace(/[ı]/g, 'i')
        .replace(/[ö]/g, 'o')
        .replace(/[ç]/g, 'c')
        .replace(/[Ğ]/g, 'g')
        .replace(/[Ü]/g, 'u')
        .replace(/[Ş]/g, 's')
        .replace(/[İ]/g, 'i')
        .replace(/[Ö]/g, 'o')
        .replace(/[Ç]/g, 'c')
        .replace(/[^a-z0-9\-]/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

/**
 * Metin kısalt
 */
export function truncate(text, length = 50, suffix = '...') {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
}

/**
 * Array'i gruplara ayır
 */
export function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) result[group] = [];
        result[group].push(item);
        return result;
    }, {});
}

/**
 * Array'i sırala
 */
export function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (order === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });
}

/**
 * Deep clone
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const clonedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
}

/**
 * Deep merge
 */
export function deepMerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    
    return deepMerge(target, ...sources);
}

/**
 * Object mi kontrol et
 */
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * LocalStorage wrapper
 */
export const storage = {
    get(key) {
        try {
            const item = localStorage.getItem(Config.storage.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(Config.storage.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(Config.storage.prefix + key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },
    
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(Config.storage.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

/**
 * Bildirim göster
 */
export function showNotification(message, type = 'info', duration = 3000) {
    // Notification container oluştur
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} notification-enter`;
    
    // Icon
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Container'a ekle
    container.appendChild(notification);
    
    // Animasyon için
    setTimeout(() => {
        notification.classList.remove('notification-enter');
        notification.classList.add('notification-enter-active');
    }, 10);
    
    // Kapat butonu
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));
    
    // Otomatik kapat
    if (duration > 0) {
        setTimeout(() => removeNotification(notification), duration);
    }
    
    // Ses çal
    if (Config.notifications.sound) {
        playNotificationSound(type);
    }
    
    return notification;
}

/**
 * Bildirimi kaldır
 */
function removeNotification(notification) {
    notification.classList.add('notification-exit-active');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Bildirim sesi çal
 */
function playNotificationSound(type) {
    // TODO: Ses dosyaları eklendiğinde implement edilecek
}

/**
 * Confirm dialog
 */
export function confirm(message, title = 'Onay') {
    return new Promise((resolve) => {
        // TODO: Custom confirm dialog implement edilecek
        // Şimdilik native confirm kullan
        resolve(window.confirm(message));
    });
}

/**
 * Prompt dialog
 */
export function prompt(message, defaultValue = '', title = 'Giriş') {
    return new Promise((resolve) => {
        // TODO: Custom prompt dialog implement edilecek
        // Şimdilik native prompt kullan
        resolve(window.prompt(message, defaultValue));
    });
}

/**
 * CSV export
 */
export function exportToCSV(data, filename = 'export.csv') {
    if (!data || !data.length) return;
    
    // Header'ları al
    const headers = Object.keys(data[0]);
    
    // CSV içeriği oluştur
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Virgül veya tırnak içeren değerleri tırnak içine al
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csv += values.join(',') + '\n';
    });
    
    // Download
    downloadFile(csv, filename, 'text/csv');
}

/**
 * JSON export
 */
export function exportToJSON(data, filename = 'export.json') {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, filename, 'application/json');
}

/**
 * Dosya indir
 */
export function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
}

/**
 * Dosya oku
 */
export function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        
        reader.onerror = (e) => {
            reject(new Error('Dosya okunamadı'));
        };
        
        reader.readAsText(file);
    });
}

/**
 * Form verilerini objeye çevir
 */
export function formDataToObject(formData) {
    const obj = {};
    
    for (const [key, value] of formData.entries()) {
        // Array syntax kontrolü (örn: items[])
        if (key.endsWith('[]')) {
            const realKey = key.slice(0, -2);
            if (!obj[realKey]) obj[realKey] = [];
            obj[realKey].push(value);
        } else {
            obj[key] = value;
        }
    }
    
    return obj;
}

/**
 * Element'e animasyon ekle
 */
export function animateElement(element, animationClass, duration = 1000) {
    return new Promise((resolve) => {
        element.classList.add(animationClass);
        
        setTimeout(() => {
            element.classList.remove(animationClass);
            resolve();
        }, duration);
    });
}

/**
 * Lazy load image
 */
export function lazyLoadImage(img) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src;
                image.classList.add('fade-in');
                imageObserver.unobserve(image);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: Config.performance.lazyLoadThreshold
    });
    
    imageObserver.observe(img);
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Title case
 */
export function titleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

/**
 * Parse query string
 */
export function parseQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (const [key, value] of params) {
        result[key] = value;
    }
    
    return result;
}

/**
 * Build query string
 */
export function buildQueryString(params) {
    const searchParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value);
        }
    }
    
    return searchParams.toString();
}
