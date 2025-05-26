/**
 * Finans Sistemi - Kategori Modülü
 * Gelir/Gider kategorilerinin yönetimi
 */

import Config from '../core/config.js';
import storageService from '../services/storage.js';
import { showNotification, generateColor } from '../utils/helpers.js';

/**
 * Varsayılan kategorileri başlat
 */
export async function initializeCategories() {
    try {
        // Gelir kategorileri
        for (const category of Config.defaultCategories.income) {
            await addCategory({
                ...category,
                type: 'income'
            });
        }
        
        // Gider kategorileri
        for (const category of Config.defaultCategories.expense) {
            await addCategory({
                ...category,
                type: 'expense'
            });
        }
        
        return true;
    } catch (error) {
        console.error('Kategori başlatma hatası:', error);
        return false;
    }
}

/**
 * Kategori ekle
 */
export async function addCategory(categoryData) {
    try {
        // Validasyon
        if (!categoryData.name || !categoryData.type) {
            throw new Error('Kategori adı ve tipi zorunludur');
        }
        
        // Aynı isimde kategori var mı kontrol et
        const existing = await getCategoryByName(categoryData.name, categoryData.type);
        if (existing) {
            throw new Error('Bu isimde bir kategori zaten mevcut');
        }
        
        // Varsayılan değerler
        const category = {
            name: categoryData.name.trim(),
            type: categoryData.type,
            icon: categoryData.icon || 'fa-tag',
            color: categoryData.color || generateColor(Math.floor(Math.random() * 10)),
            description: categoryData.description || '',
            isActive: categoryData.isActive !== false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Veritabanına ekle
        const id = await storageService.add('categories', category);
        
        return { id, ...category };
    } catch (error) {
        console.error('Kategori ekleme hatası:', error);
        throw error;
    }
}

/**
 * Kategori güncelle
 */
export async function updateCategory(id, updates) {
    try {
        // Mevcut kategoriyi al
        const category = await getCategory(id);
        if (!category) {
            throw new Error('Kategori bulunamadı');
        }
        
        // Aynı isimde başka kategori var mı kontrol et
        if (updates.name && updates.name !== category.name) {
            const existing = await getCategoryByName(updates.name, category.type);
            if (existing) {
                throw new Error('Bu isimde bir kategori zaten mevcut');
            }
        }
        
        // Güncelle
        const updatedCategory = {
            ...category,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        await storageService.update('categories', updatedCategory);
        
        return updatedCategory;
    } catch (error) {
        console.error('Kategori güncelleme hatası:', error);
        throw error;
    }
}

/**
 * Kategori sil
 */
export async function deleteCategory(id) {
    try {
        // Kategori kullanımda mı kontrol et
        const transactions = await storageService.getAll('transactions', {
            index: 'category',
            value: id
        });
        
        if (transactions.length > 0) {
            throw new Error('Bu kategori kullanımda olduğu için silinemez');
        }
        
        await storageService.delete('categories', id);
        
        return true;
    } catch (error) {
        console.error('Kategori silme hatası:', error);
        throw error;
    }
}

/**
 * Tek kategori getir
 */
export async function getCategory(id) {
    try {
        return await storageService.get('categories', id);
    } catch (error) {
        console.error('Kategori getirme hatası:', error);
        return null;
    }
}

/**
 * İsme göre kategori getir
 */
export async function getCategoryByName(name, type) {
    try {
        const categories = await storageService.getAll('categories');
        return categories.find(cat => 
            cat.name.toLowerCase() === name.toLowerCase() && 
            cat.type === type
        );
    } catch (error) {
        console.error('Kategori arama hatası:', error);
        return null;
    }
}

/**
 * Tüm kategorileri getir
 */
export async function getAllCategories(type = null) {
    try {
        let categories = await storageService.getAll('categories');
        
        if (type) {
            categories = categories.filter(cat => cat.type === type);
        }
        
        // Aktif olanları öne al ve isme göre sırala
        return categories.sort((a, b) => {
            if (a.isActive !== b.isActive) {
                return a.isActive ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
    } catch (error) {
        console.error('Kategorileri getirme hatası:', error);
        return [];
    }
}

/**
 * Kategori istatistikleri
 */
export async function getCategoryStatistics(categoryId, startDate = null, endDate = null) {
    try {
        const filters = {
            index: 'category',
            value: categoryId
        };
        
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        
        const transactions = await storageService.getAll('transactions', filters);
        
        const stats = {
            totalAmount: 0,
            transactionCount: transactions.length,
            averageAmount: 0,
            lastTransaction: null,
            monthlyAverage: 0
        };
        
        if (transactions.length > 0) {
            // Toplam tutar
            stats.totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
            
            // Ortalama tutar
            stats.averageAmount = stats.totalAmount / stats.transactionCount;
            
            // Son işlem
            transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            stats.lastTransaction = transactions[0];
            
            // Aylık ortalama
            const firstDate = new Date(transactions[transactions.length - 1].date);
            const lastDate = new Date(transactions[0].date);
            const monthsDiff = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + 
                             (lastDate.getMonth() - firstDate.getMonth()) + 1;
            stats.monthlyAverage = stats.totalAmount / monthsDiff;
        }
        
        return stats;
    } catch (error) {
        console.error('Kategori istatistikleri hatası:', error);
        return null;
    }
}

/**
 * Kategori aktif/pasif yap
 */
export async function toggleCategoryStatus(id) {
    try {
        const category = await getCategory(id);
        if (!category) {
            throw new Error('Kategori bulunamadı');
        }
        
        return await updateCategory(id, { isActive: !category.isActive });
    } catch (error) {
        console.error('Kategori durum değiştirme hatası:', error);
        throw error;
    }
}

/**
 * Toplu kategori içe aktarma
 */
export async function importCategories(categories) {
    const results = {
        success: 0,
        failed: 0,
        errors: []
    };
    
    for (const category of categories) {
        try {
            await addCategory(category);
            results.success++;
        } catch (error) {
            results.failed++;
            results.errors.push({
                category: category.name,
                error: error.message
            });
        }
    }
    
    return results;
}

/**
 * Kategorileri dışa aktar
 */
export async function exportCategories(type = null) {
    try {
        const categories = await getAllCategories(type);
        
        // ID'leri kaldır
        return categories.map(({ id, createdAt, updatedAt, ...category }) => category);
    } catch (error) {
        console.error('Kategori dışa aktarma hatası:', error);
        return [];
    }
}

/**
 * Kategori renk paleti
 */
export const categoryColors = [
    '#F8C3CD', // Pembe
    '#A5DEF1', // Mavi
    '#D1C1E6', // Mor
    '#FFE5B4', // Sarı
    '#C7E9C0', // Yeşil
    '#FFDAB9', // Turuncu
    '#E6E6FA', // Lavanta
    '#F0E68C', // Haki
    '#FFB6C1', // Açık Pembe
    '#87CEEB', // Gökyüzü Mavisi
    '#DDA0DD', // Erik
    '#F0FFF0', // Bal Kabaği
    '#FFE4E1', // Gül Kurusu
    '#B0E0E6', // Toz Mavisi
    '#DFD3E3'  // Lila
];

/**
 * Kategori ikonları
 */
export const categoryIcons = {
    income: [
        'fa-money-bill', 'fa-coins', 'fa-dollar-sign', 'fa-piggy-bank',
        'fa-wallet', 'fa-hand-holding-usd', 'fa-chart-line', 'fa-briefcase',
        'fa-laptop', 'fa-store', 'fa-building', 'fa-home'
    ],
    expense: [
        'fa-shopping-cart', 'fa-shopping-bag', 'fa-basket-shopping', 'fa-cart-plus',
        'fa-utensils', 'fa-coffee', 'fa-hamburger', 'fa-pizza-slice',
        'fa-car', 'fa-bus', 'fa-train', 'fa-plane',
        'fa-home', 'fa-lightbulb', 'fa-water', 'fa-fire',
        'fa-heartbeat', 'fa-pills', 'fa-stethoscope', 'fa-hospital',
        'fa-graduation-cap', 'fa-book', 'fa-pencil', 'fa-school',
        'fa-gamepad', 'fa-film', 'fa-music', 'fa-dumbbell',
        'fa-tshirt', 'fa-shoe-prints', 'fa-gem', 'fa-ring',
        'fa-gift', 'fa-birthday-cake', 'fa-heart', 'fa-star'
    ]
};

/**
 * Varsayılan kategori al
 */
export async function getDefaultCategory(type) {
    try {
        const categories = await getAllCategories(type);
        
        // "Diğer" kategorisini bul
        const otherCategory = categories.find(cat => 
            cat.name.toLowerCase() === 'diğer' && cat.isActive
        );
        
        // Yoksa ilk aktif kategoriyi döndür
        return otherCategory || categories.find(cat => cat.isActive) || categories[0];
    } catch (error) {
        console.error('Varsayılan kategori getirme hatası:', error);
        return null;
    }
}
