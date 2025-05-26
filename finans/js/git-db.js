/**
 * GitDB - GitHub Tabanlı JSON Veritabanı Modülü
 * Bu modül, verileri JSON dosyasında saklar ve GitHub ile senkronize edilmek üzere dosyayı günceller
 */

const GitDB = {
    /**
     * Veritabanı dosya yolu
     */
    dbPath: 'data/database.json',
    
    /**
     * Çalışma modu
     */
    isLocalFileSystem: window.location.protocol === 'file:',
    
    /**
     * Veritabanı şeması ve varsayılan değerler
     */
    dbSchema: {
        transactions: [],
        incomeCategories: [
            {
                id: "default-income-1",
                name: "Maaş",
                color: "#28a745"
            },
            {
                id: "default-income-2",
                name: "Ek Gelir",
                color: "#20c997"
            },
            {
                id: "default-income-3",
                name: "Yatırım Getirisi", 
                color: "#17a2b8"
            }
        ],
        expenseCategories: [
            {
                id: "default-expense-1",
                name: "Gıda",
                color: "#dc3545"
            },
            {
                id: "default-expense-2",
                name: "Faturalar",
                color: "#fd7e14"
            },
            {
                id: "default-expense-3",
                name: "Ulaşım",
                color: "#ffc107"
            },
            {
                id: "default-expense-4",
                name: "Sağlık",
                color: "#6f42c1"
            }
        ],
        autoExpenses: [],
        expenseTemplates: [],
        expenseTemplateGroups: [],
        lastUpdated: new Date().toISOString()
    },
    
    /**
     * Veritabanı verisi
     */
    data: null,
    
    /**
     * Veritabanını başlat
     */
    init() {
        console.log('GitDB: Veritabanı başlatılıyor...');
        
        // Önce yerel depolamadan veri yüklemeyi dene
        const localData = this.loadFromLocalStorage();
        
        if (localData) {
            console.log('GitDB: Veriler yerel depolamadan yüklendi');
            this.data = localData;
            
            // Veritabanı dosyasını kontrol et ve gerekirse güncelle
            this.checkDatabaseFile();
        } else {
            console.log('GitDB: Yerel depolamada veri bulunamadı, dosyadan yükleniyor...');
            // Yerel depolamada veri yoksa, dosyadan yüklemeyi dene
            this.loadFromFile()
                .then(fileData => {
                    if (fileData) {
                        console.log('GitDB: Veriler dosyadan yüklendi');
                        this.data = fileData;
                        // Yerel depolamaya kaydet
                        this.saveToLocalStorage();
                    } else {
                        console.log('GitDB: Dosyada veri bulunamadı, varsayılan şema oluşturuluyor');
                        // Varsayılan şemayı kullan
                        this.data = {...this.dbSchema};
                        // Yerel depolamaya kaydet
                        this.saveToLocalStorage();
                    }
                })
                .catch(error => {
                    console.error('GitDB: Dosya yükleme hatası', error);
                    // Hata durumunda varsayılan şemayı kullan
                    this.data = {...this.dbSchema};
                    // Yerel depolamaya kaydet
                    this.saveToLocalStorage();
                });
        }
    },
    
    /**
     * Veritabanı dosyasını kontrol et ve gerekirse güncelle
     */
    checkDatabaseFile() {
        this.loadFromFile()
            .then(fileData => {
                // Dosyada veri varsa, son güncelleme tarihlerini karşılaştır
                if (fileData) {
                    const fileDate = new Date(fileData.lastUpdated || 0);
                    const localDate = new Date(this.data.lastUpdated || 0);
                    
                    // Dosyadaki veri daha yeniyse, yerel veriyi güncelle
                    if (fileDate > localDate) {
                        console.log('GitDB: Dosyadaki veri daha yeni, yerel veri güncelleniyor');
                        this.data = fileData;
                        this.saveToLocalStorage();
                    } 
                    // Yerel veri daha yeniyse, dosyayı güncelle
                    else if (localDate > fileDate) {
                        console.log('GitDB: Yerel veri daha yeni, GitHub senkronizasyonu gerekli');
                        // Dosya indirme yok, sadece log
                    }
                } else {
                    // Dosya yoksa veya boşsa, sadece log
                    console.log('GitDB: Veritabanı dosyası bulunamadı, GitHub senkronizasyonu gerekli');
                }
            })
            .catch(error => {
                console.error('GitDB: Dosya kontrolü sırasında hata', error);
                // Hata durumunda sadece log
            });
    },
    
    /**
     * Dosyadan verileri yükle
     */
    loadFromFile() {
        return new Promise((resolve, reject) => {
            // Yerel dosya sisteminde çalışıyor muyuz kontrol et
            if (this.isLocalFileSystem) {
                console.log('GitDB: Yerel dosya sisteminde çalışılıyor, localStorage kullanılacak');
                // Doğrudan localStorage'dan veriyi yükle
                const data = this.loadFromLocalStorage();
                if (data) {
                    resolve(data);
                } else {
                    // Varsayılan verileri kullan
                    resolve({...this.dbSchema});
                }
                return;
            }
            
            // Web sunucusunda çalışıyorsa normal fetch işlemini dene
            fetch(this.dbPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => {
                    console.error('GitDB: Dosyadan veri yükleme hatası', error);
                    // Hata durumunda localStorage'a geri dön
                    const localData = this.loadFromLocalStorage();
                    if (localData) {
                        console.log('GitDB: Veri localStorage\'dan alındı (fallback)');
                        resolve(localData);
                    } else {
                        // Varsayılan şemayı kullan
                        resolve({...this.dbSchema});
                    }
                });
        });
    },
    
    /**
     * Verileri dosyaya kaydet (sadece manuel yedekleme için)
     */
    saveToFile(forceDownload = false) {
        // Son güncelleme zamanını ayarla
        this.data.lastUpdated = new Date().toISOString();
        
        // Sadece manuel yedekleme istendiğinde dosya indir
        if (forceDownload) {
            // JSON verisini oluştur
            const jsonData = JSON.stringify(this.data, null, 2);
            
            // Blob oluştur
            const blob = new Blob([jsonData], {type: 'application/json'});
            
            // İndirme bağlantısı oluştur
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = this.dbPath.split('/').pop(); // Sadece dosya adını al
            
            // İndirme işlemini başlat
            document.body.appendChild(a);
            a.click();
            
            // Temizlik
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
            
            // Bildirim göster
            this.showNotification('Veritabanı dosyası indirildi. Lütfen bu dosyayı GitHub reponuza yükleyin.');
            
            // Son yedekleme tarihini güncelle
            localStorage.setItem('lastBackupDate', new Date().toISOString());
        }
        
        return true;
    },
    
    /**
     * Verileri yerel depolamadan yükle
     */
    loadFromLocalStorage() {
        try {
            // Tüm depolama anahtarlarını al
            const transactionsStr = localStorage.getItem('transactions');
            const incomeCategoriesStr = localStorage.getItem('incomeCategories');
            const expenseCategoriesStr = localStorage.getItem('expenseCategories');
            const autoExpensesStr = localStorage.getItem('autoExpenses');
            const expenseTemplatesStr = localStorage.getItem('expenseTemplates');
            const expenseTemplateGroupsStr = localStorage.getItem('expenseTemplateGroups');
            
            // Hiçbir veri yoksa null döndür
            if (!transactionsStr && !incomeCategoriesStr && !expenseCategoriesStr) {
                return null;
            }
            
            // Verileri ayrıştır
            const data = {
                transactions: transactionsStr ? JSON.parse(transactionsStr) : [],
                incomeCategories: incomeCategoriesStr ? JSON.parse(incomeCategoriesStr) : this.dbSchema.incomeCategories,
                expenseCategories: expenseCategoriesStr ? JSON.parse(expenseCategoriesStr) : this.dbSchema.expenseCategories,
                autoExpenses: autoExpensesStr ? JSON.parse(autoExpensesStr) : [],
                expenseTemplates: expenseTemplatesStr ? JSON.parse(expenseTemplatesStr) : [],
                expenseTemplateGroups: expenseTemplateGroupsStr ? JSON.parse(expenseTemplateGroupsStr) : [],
                lastUpdated: new Date().toISOString()
            };
            
            return data;
        } catch (error) {
            console.error('GitDB: Yerel depolamadan veri yükleme hatası', error);
            return null;
        }
    },
    
    /**
     * Verileri yerel depolamaya kaydet
     */
    saveToLocalStorage() {
        try {
            // Her bir veri tipini ayrı olarak kaydet
            localStorage.setItem('transactions', JSON.stringify(this.data.transactions));
            localStorage.setItem('incomeCategories', JSON.stringify(this.data.incomeCategories));
            localStorage.setItem('expenseCategories', JSON.stringify(this.data.expenseCategories));
            localStorage.setItem('autoExpenses', JSON.stringify(this.data.autoExpenses));
            localStorage.setItem('expenseTemplates', JSON.stringify(this.data.expenseTemplates));
            localStorage.setItem('expenseTemplateGroups', JSON.stringify(this.data.expenseTemplateGroups));
            
            // Son güncelleme zamanını kaydet
            const now = new Date().toISOString();
            localStorage.setItem('lastDataUpdate', now);
            this.data.lastUpdated = now;
            
            // GitHub senkronizasyonu için olay tetikle - anında
            document.dispatchEvent(new CustomEvent('data-updated'));
            
            return true;
        } catch (error) {
            console.error('GitDB: Yerel depolamaya kaydetme hatası', error);
            return false;
        }
    },
    
    /**
     * Bildirim göster
     */
    showNotification(message) {
        // App.showToast varsa kullan
        if (typeof App !== 'undefined' && typeof App.showToast === 'function') {
            App.showToast(message);
        } else {
            // Yoksa basit bir alert göster
            alert(message);
        }
    },
    
};

// Sayfa yüklendiğinde veritabanını başlat
document.addEventListener('DOMContentLoaded', () => {
    GitDB.init();
});
