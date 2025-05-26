/**
 * Finans Sistemi - Storage Service
 * IndexedDB tabanlı veri depolama servisi
 */

import Config from '../core/config.js';

class StorageService {
    constructor() {
        this.db = null;
        this.dbName = Config.database.name;
        this.version = Config.database.version;
        this.stores = Config.database.stores;
    }

    /**
     * Veritabanını başlat
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                reject(new Error('Veritabanı açılamadı: ' + request.error));
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Veritabanı başarıyla açıldı');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Transactions store
                if (!db.objectStoreNames.contains(this.stores.transactions)) {
                    const transactionStore = db.createObjectStore(this.stores.transactions, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    transactionStore.createIndex('date', 'date', { unique: false });
                    transactionStore.createIndex('type', 'type', { unique: false });
                    transactionStore.createIndex('category', 'category', { unique: false });
                    transactionStore.createIndex('month', 'month', { unique: false });
                    transactionStore.createIndex('year', 'year', { unique: false });
                }

                // Categories store
                if (!db.objectStoreNames.contains(this.stores.categories)) {
                    const categoryStore = db.createObjectStore(this.stores.categories, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    categoryStore.createIndex('type', 'type', { unique: false });
                    categoryStore.createIndex('name', 'name', { unique: false });
                }

                // Settings store
                if (!db.objectStoreNames.contains(this.stores.settings)) {
                    db.createObjectStore(this.stores.settings, {
                        keyPath: 'key'
                    });
                }

                // Backups store
                if (!db.objectStoreNames.contains(this.stores.backups)) {
                    const backupStore = db.createObjectStore(this.stores.backups, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    backupStore.createIndex('date', 'date', { unique: false });
                }
            };
        });
    }

    /**
     * Veri ekle
     */
    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            // Tarih alanlarını işle
            if (data.date && storeName === this.stores.transactions) {
                const date = new Date(data.date);
                data.month = date.getMonth() + 1;
                data.year = date.getFullYear();
                data.timestamp = date.getTime();
            }
            
            const request = store.add(data);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error('Veri eklenemedi: ' + request.error));
            };
        });
    }

    /**
     * Veri güncelle
     */
    async update(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            // Tarih alanlarını işle
            if (data.date && storeName === this.stores.transactions) {
                const date = new Date(data.date);
                data.month = date.getMonth() + 1;
                data.year = date.getFullYear();
                data.timestamp = date.getTime();
            }
            
            const request = store.put(data);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error('Veri güncellenemedi: ' + request.error));
            };
        });
    }

    /**
     * Veri sil
     */
    async delete(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error('Veri silinemedi: ' + request.error));
            };
        });
    }

    /**
     * ID ile veri getir
     */
    async get(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error('Veri getirilemedi: ' + request.error));
            };
        });
    }

    /**
     * Tüm verileri getir
     */
    async getAll(storeName, filters = {}) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const results = [];

            let request;
            
            // Index kullanarak filtreleme
            if (filters.index && filters.value !== undefined) {
                const index = store.index(filters.index);
                request = index.openCursor(IDBKeyRange.only(filters.value));
            } else {
                request = store.openCursor();
            }

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    let shouldInclude = true;

                    // Ek filtreler uygula
                    if (filters.startDate || filters.endDate) {
                        const itemDate = new Date(cursor.value.date);
                        if (filters.startDate && itemDate < new Date(filters.startDate)) {
                            shouldInclude = false;
                        }
                        if (filters.endDate && itemDate > new Date(filters.endDate)) {
                            shouldInclude = false;
                        }
                    }

                    if (shouldInclude) {
                        results.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = () => {
                reject(new Error('Veriler getirilemedi: ' + request.error));
            };
        });
    }

    /**
     * Store'u temizle
     */
    async clear(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error('Store temizlenemedi: ' + request.error));
            };
        });
    }

    /**
     * Veritabanını kapat
     */
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }

    /**
     * Veritabanını sil
     */
    async deleteDatabase() {
        this.close();
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(this.dbName);
            
            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error('Veritabanı silinemedi: ' + request.error));
            };
        });
    }

    /**
     * İstatistikler için özel sorgular
     */
    async getStatistics(year, month = null) {
        const filters = { index: 'year', value: year };
        const transactions = await this.getAll(this.stores.transactions, filters);

        // Ay filtresi uygula
        const filteredTransactions = month 
            ? transactions.filter(t => t.month === month)
            : transactions;

        const stats = {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            transactionCount: filteredTransactions.length,
            categoryBreakdown: {
                income: {},
                expense: {}
            },
            monthlyTrend: {}
        };

        filteredTransactions.forEach(transaction => {
            if (transaction.type === 'income') {
                stats.totalIncome += transaction.amount;
                stats.categoryBreakdown.income[transaction.category] = 
                    (stats.categoryBreakdown.income[transaction.category] || 0) + transaction.amount;
            } else {
                stats.totalExpense += transaction.amount;
                stats.categoryBreakdown.expense[transaction.category] = 
                    (stats.categoryBreakdown.expense[transaction.category] || 0) + transaction.amount;
            }

            // Aylık trend
            const monthKey = `${transaction.year}-${String(transaction.month).padStart(2, '0')}`;
            if (!stats.monthlyTrend[monthKey]) {
                stats.monthlyTrend[monthKey] = { income: 0, expense: 0 };
            }
            stats.monthlyTrend[monthKey][transaction.type] += transaction.amount;
        });

        stats.balance = stats.totalIncome - stats.totalExpense;
        return stats;
    }

    /**
     * Veri dışa aktarma
     */
    async exportData() {
        const data = {
            version: Config.app.version,
            exportDate: new Date().toISOString(),
            data: {}
        };

        for (const storeName of Object.values(this.stores)) {
            data.data[storeName] = await this.getAll(storeName);
        }

        return data;
    }

    /**
     * Veri içe aktarma
     */
    async importData(importedData) {
        // Veri doğrulama
        if (!importedData.data || !importedData.version) {
            throw new Error('Geçersiz veri formatı');
        }

        // Mevcut veriyi yedekle
        const backup = await this.exportData();
        await this.add(this.stores.backups, {
            date: new Date().toISOString(),
            data: backup,
            type: 'auto',
            description: 'Import öncesi otomatik yedek'
        });

        // Store'ları temizle ve yeni veriyi yükle
        for (const [storeName, storeData] of Object.entries(importedData.data)) {
            if (this.stores[storeName]) {
                await this.clear(storeName);
                for (const item of storeData) {
                    // ID'leri sil (yeni ID'ler atanacak)
                    const { id, ...dataWithoutId } = item;
                    await this.add(storeName, dataWithoutId);
                }
            }
        }

        return true;
    }
}

// Singleton instance
const storageService = new StorageService();
export default storageService;
