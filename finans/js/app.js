/**
 * Kişisel Bütçe Takip - Ana Uygulama
 * Kullanıcı arayüzü etkileşimlerini ve veri işlemlerini yöneten ana script
 */

// Uygulama Ana Kontrol Nesnesi
const App = {
    // Uygulama durumu
    state: {
        currentPage: 'home',
        isEditingTransaction: false,
        editingTransactionId: null,
        editingCategoryId: null,
        editingAutoExpenseId: null,
        editingExpenseTemplateId: null,
        editingExpenseTemplateGroupId: null,
        selectedExpenseTemplates: [], // Gelir eklerken seçilen gider şablonları
        selectedGroupTemplates: [], // Şablon grubu oluştururken seçilen şablonlar
        activeExpenseTemplateTab: 'templates', // Aktif şablon sekmesi (templates veya groups)
    },
    
    // Toast mesajı göster
    showToast(message, type = 'info') {
        // Toast container yoksa oluştur
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Toast ID oluştur
        const toastId = 'toast-' + new Date().getTime();
        
        // Toast HTML
        const toastHTML = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${type === 'error' ? 'bg-danger text-white' : type === 'success' ? 'bg-success text-white' : 'bg-primary text-white'}">
                    <strong class="me-auto">${type === 'error' ? 'Hata' : type === 'success' ? 'Başarılı' : type === 'warning' ? 'Uyarı' : 'Bilgi'}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Kapat"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        // Toast'u container'a ekle
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        // Toast'u oluştur ve göster
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 5000
        });
        toast.show();
        
        // Belirli bir süre sonra DOM'dan kaldır
        setTimeout(() => {
            toastElement.remove();
        }, 6000);
    },
    
    // Sayfa yüklendiğinde çalıştırılacak başlangıç işlemleri
    init() {
        // Event listener'ları bağla
        this.bindEventListeners();
        
        // AuthManager tarafından authentication kontrol edilecek
        // Auth durumu değiştiğinde authManager otomatik olarak uygulamayı başlatacak
        if (window.authManager && window.authManager.isAuthenticated()) {
            this.initializeApp();
        }
    },
    
    // Uygulamayı başlat (performans için ayrı fonksiyon)
    initializeApp() {
        // DEBUGGING: Current user kontrol et
        this.debugCurrentUser();
        
        // Gerekli verileri asenkron olarak yükle
        setTimeout(async () => {
            await this.refreshSummary();
            await this.renderTransactions();
            await this.populateCategorySelects();
            await this.loadCategories();
        }, 10); // Çok kısa gecikme ile asenkron yükleme
        
        // Tarih alanları için bugünün tarihini ata
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('income-date').value = today;
        document.getElementById('expense-date').value = today;
        document.getElementById('daily-date').value = today;
        
        // Geçerli ay ve yıl
        const currentMonth = new Date().toISOString().split('T')[0].substring(0, 7);
        document.getElementById('monthly-date').value = currentMonth;
        
        // Dışa aktarma için varsayılan tarih aralığı (son 30 gün)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        document.getElementById('export-start-date').value = startDate.toISOString().split('T')[0];
        document.getElementById('export-end-date').value = endDate.toISOString().split('T')[0];
    },
    
    // Olay dinleyicilerini bağla
    bindEventListeners() {
        // Navigasyon bağlantıları
        document.getElementById('nav-home').addEventListener('click', e => {
            e.preventDefault();
            this.showPage('home');
        });
        
        document.getElementById('nav-reports').addEventListener('click', e => {
            e.preventDefault();
            this.showPage('reports');
        });
        
        document.getElementById('nav-categories').addEventListener('click', e => {
            e.preventDefault();
            this.showPage('categories');
        });
        
        
        document.getElementById('nav-expense-templates').addEventListener('click', e => {
            e.preventDefault();
            this.showPage('expense-templates');
        });
        
        document.getElementById('nav-auto-expenses').addEventListener('click', e => {
            e.preventDefault();
            this.showPage('auto-expenses');
        });
        
        // Rapor sekmeleri
        document.getElementById('daily-report-tab').addEventListener('click', e => {
            e.preventDefault();
            this.showReportTab('daily');
        });
        
        document.getElementById('monthly-report-tab').addEventListener('click', e => {
            e.preventDefault();
            this.showReportTab('monthly');
        });
        
        // Kategori sekmeleri
        document.getElementById('income-categories-tab').addEventListener('click', e => {
            e.preventDefault();
            this.showCategoryTab('income');
        });
        
        document.getElementById('expense-categories-tab').addEventListener('click', e => {
            e.preventDefault();
            this.showCategoryTab('expense');
        });
        
        // İşlem ekleme ve düzenleme
        document.getElementById('save-income').addEventListener('click', () => this.saveTransaction('income'));
        document.getElementById('save-expense').addEventListener('click', () => this.saveTransaction('expense'));
        document.getElementById('save-auto-expense').addEventListener('click', () => this.saveAutoExpense());
        document.getElementById('save-expense-template').addEventListener('click', () => this.saveExpenseTemplate());
        document.getElementById('save-expense-template-group').addEventListener('click', () => this.saveExpenseTemplateGroup());
        
        // Şablon sekmesi kontrolü
        document.getElementById('expense-templates-tab').addEventListener('click', e => {
            e.preventDefault();
            this.showExpenseTemplateTab('templates');
        });
        
        document.getElementById('expense-template-groups-tab').addEventListener('click', e => {
            e.preventDefault();
            this.showExpenseTemplateTab('groups');
        });
        
        // Şablon grubu yönetimi
        document.getElementById('add-template-to-group').addEventListener('click', () => this.addTemplateToGroup());
        
        // Gelir modalında gider şablonları
        document.getElementById('add-expense-template-to-income').addEventListener('click', () => this.addExpenseTemplateToIncome());
        document.getElementById('add-expense-template-group-to-income').addEventListener('click', () => this.addExpenseTemplateGroupToIncome());
        
        // Gelir modalında şablon sekmeleri
        document.getElementById('single-templates-tab').addEventListener('click', e => {
            e.preventDefault();
            this.showIncomeTemplateTab('single');
        });
        
        document.getElementById('template-groups-tab').addEventListener('click', e => {
            e.preventDefault();
            this.showIncomeTemplateTab('groups');
        });
        
        // Gelir tutarı değiştiğinde brüt/net hesaplama
        document.getElementById('income-amount').addEventListener('input', () => this.updateIncomeAmounts());
        
        // Kategori ekleme ve düzenleme
        document.getElementById('save-category').addEventListener('click', () => this.saveCategory());
        
        // İşlem filtreleme
        document.getElementById('filter-all').addEventListener('click', () => this.filterTransactions('all'));
        document.getElementById('filter-income').addEventListener('click', () => this.filterTransactions('income'));
        document.getElementById('filter-expense').addEventListener('click', () => this.filterTransactions('expense'));
        
        // Rapor tarih değişikliği
        document.getElementById('daily-date').addEventListener('change', e => {
            const selectedDate = new Date(e.target.value);
            this.updateDailyReport(selectedDate);
        });
        
        document.getElementById('monthly-date').addEventListener('change', e => {
            const [year, month] = e.target.value.split('-');
            this.updateMonthlyReport(parseInt(year), parseInt(month) - 1); // Ay 0'dan başlıyor JS'de
        });
        
        // Dışa aktarma butonu
        document.getElementById('export-csv').addEventListener('click', () => this.exportToCSV());
        
        // Modal açılıp kapandığında form temizleme
        const incomeModal = document.getElementById('incomeModal');
        if (incomeModal) {
            // Modal açıldığında
            incomeModal.addEventListener('show.bs.modal', () => {
                // Seçilen gider şablonlarını temizle
                this.state.selectedExpenseTemplates = [];
                this.renderSelectedExpenseTemplates();
                this.updateIncomeAmounts();
            });
            
            // Modal kapandığında
            incomeModal.addEventListener('hidden.bs.modal', () => {
                document.getElementById('income-form').reset();
                this.state.isEditingTransaction = false;
                this.state.editingTransactionId = null;
                this.state.selectedExpenseTemplates = [];
                document.getElementById('income-applied-expenses').value = '[]';
                document.getElementById('income-gross-amount').textContent = '0 ₺';
                document.getElementById('income-total-expenses').textContent = '0 ₺';
                document.getElementById('income-net-amount').textContent = '0 ₺';
            });
        }
        
        const expenseModal = document.getElementById('expenseModal');
        if (expenseModal) {
            expenseModal.addEventListener('hidden.bs.modal', () => {
                document.getElementById('expense-form').reset();
                this.state.isEditingTransaction = false;
                this.state.editingTransactionId = null;
            });
        }
        
        const categoryModal = document.getElementById('categoryModal');
        if (categoryModal) {
            categoryModal.addEventListener('hidden.bs.modal', () => {
                document.getElementById('category-form').reset();
                this.state.editingCategoryId = null;
            });
        }
        
        const autoExpenseModal = document.getElementById('autoExpenseModal');
        if (autoExpenseModal) {
            autoExpenseModal.addEventListener('hidden.bs.modal', () => {
                document.getElementById('auto-expense-form').reset();
                this.state.editingAutoExpenseId = null;
            });
        }
        
        const expenseTemplateModal = document.getElementById('expenseTemplateModal');
        if (expenseTemplateModal) {
            expenseTemplateModal.addEventListener('hidden.bs.modal', () => {
                document.getElementById('expense-template-form').reset();
                this.state.editingExpenseTemplateId = null;
            });
        }
    },
    
    
    
    // Çıkış yapma
    logout() {
        // Supabase logout'u çağır
        if (window.authManager) {
            window.authManager.signOut();
        }
        
        // Verileri temizle
        this.clearAllData();
        
        // Sayfayı yenile (authManager otomatik olarak auth sayfasını gösterecek)
        window.location.reload();
    },
    
    // AuthManager tarafından çağrılacak fonksiyon - kullanıcı verilerini yükle
    loadUserData() {
        this.initializeApp();
    },
    
    // Tüm verileri temizle
    clearAllData() {
        // LocalStorage'daki tüm uygulama verilerini temizle
        const keysToRemove = [
            'budget_auth_token',
            'budget_auth_time',
            'budget_remember_me',
            'budget_lockout_time',
            'budget_login_attempts',
            'budget_transactions',
            'budget_income_categories',
            'budget_expense_categories',
            'budget_auto_expenses',
            'budget_expense_templates',
            'budget_expense_template_groups'
        ];
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // State'i sıfırla
        this.state = {
            currentPage: 'home',
            isEditingTransaction: false,
            editingTransactionId: null,
            editingCategoryId: null,
            editingAutoExpenseId: null,
            editingExpenseTemplateId: null,
            editingExpenseTemplateGroupId: null,
            selectedExpenseTemplates: [],
            selectedGroupTemplates: [],
            activeExpenseTemplateTab: 'templates'
        };
    },
    
    // Sayfa değiştirme
    showPage(pageName) {
        // Tüm sayfaları gizle
        document.getElementById('page-home').style.display = 'none';
        document.getElementById('page-reports').style.display = 'none';
        document.getElementById('page-categories').style.display = 'none';
        document.getElementById('page-export').style.display = 'none';
        document.getElementById('page-expense-templates').style.display = 'none';
        document.getElementById('page-auto-expenses').style.display = 'none';
        
        // Aktif sekmeyi temizle
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Seçilen sayfayı göster
        document.getElementById(`page-${pageName}`).style.display = 'block';
        document.getElementById(`nav-${pageName}`).classList.add('active');
        
        this.state.currentPage = pageName;
        
        // Sayfa değiştiğinde ek işlemler
        if (pageName === 'home') {
            this.refreshSummary();
            this.renderTransactions();
            // Grafik güncellemesini try-catch bloğuna alalım
            try {
                ChartManager.updateMonthlyChart();
            } catch (error) {
                console.error('Ana sayfa grafik güncelleme hatası:', error);
            }
        } else if (pageName === 'reports') {
            this.updateDailyReport(new Date(document.getElementById('daily-date').value));
            const [year, month] = document.getElementById('monthly-date').value.split('-');
            this.updateMonthlyReport(parseInt(year), parseInt(month) - 1);
        } else if (pageName === 'categories') {
            this.loadCategories();
        } else if (pageName === 'expense-templates') {
            // Şablon içerikleri (aktif sekmeye göre)
            if (this.state.activeExpenseTemplateTab === 'templates') {
                this.loadExpenseTemplates();
            } else {
                this.loadExpenseTemplateGroups();
            }
            
            // Gider kategorilerini seçim kutusuna doldur
            this.populateExpenseCategorySelect('expense-template-category');
            
            // Şablon grup seçimi için şablonları doldur
            this.populateTemplateForGroupSelect();
        } else if (pageName === 'auto-expenses') {
            this.loadAutoExpenses();
            // Gider kategorilerini seçim kutusuna doldur
            this.populateExpenseCategorySelect('auto-expense-category');
        }
    },
    
    // Rapor sekmesi değiştirme
    showReportTab(tabName) {
        // Tüm rapor içeriklerini gizle
        document.getElementById('daily-report').style.display = 'none';
        document.getElementById('monthly-report').style.display = 'none';
        
        // Aktif sekmeyi temizle
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Seçilen raporu göster
        document.getElementById(`${tabName}-report`).style.display = 'block';
        document.getElementById(`${tabName}-report-tab`).classList.add('active');
        
        // Rapor sekmesi değiştiğinde ek işlemler
        if (tabName === 'daily') {
            this.updateDailyReport(new Date(document.getElementById('daily-date').value));
        } else if (tabName === 'monthly') {
            const [year, month] = document.getElementById('monthly-date').value.split('-');
            this.updateMonthlyReport(parseInt(year), parseInt(month) - 1);
        }
    },
    
    // Kategori sekmesi değiştirme
    showCategoryTab(tabName) {
        // Tüm kategori içeriklerini gizle
        document.getElementById('income-categories').style.display = 'none';
        document.getElementById('expense-categories').style.display = 'none';
        
        // Aktif sekmeyi temizle
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Seçilen kategori tipini göster
        document.getElementById(`${tabName}-categories`).style.display = 'block';
        document.getElementById(`${tabName}-categories-tab`).classList.add('active');
    },
    
    // Gelir ve gider özeti güncelleme
    async refreshSummary() {
        const { totalIncome, totalExpense, balance } = await window.dataManager.calculateTotals();
        
        document.getElementById('total-income').textContent = this.formatCurrency(totalIncome);
        document.getElementById('total-expense').textContent = this.formatCurrency(totalExpense);
        document.getElementById('balance').textContent = this.formatCurrency(balance);
    },
    
    // Para formatı
    formatCurrency(amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    },
    
    // Tarih formatı
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR');
    },
    
    // İşlemleri listele
    async renderTransactions(filter = 'all') {
        const transactions = await window.dataManager.getTransactions();
        const transactionList = document.getElementById('transaction-list');
        
        // Kategori bilgilerini al
        const incomeCategories = await window.dataManager.getCategories('income');
        const expenseCategories = await window.dataManager.getCategories('expense');
        
        // Kategori adlarını ID'ye göre hızlıca bulmak için map oluştur
        const categoryMap = {};
        incomeCategories.forEach(cat => {
            categoryMap[cat.id] = cat.name;
        });
        expenseCategories.forEach(cat => {
            categoryMap[cat.id] = cat.name;
        });
        
        // Listeyi temizle
        transactionList.innerHTML = '';
        
        // İşlemleri en yeniden en eskiye sırala
        const sortedTransactions = [...transactions].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Filtreleme
        let filteredTransactions = sortedTransactions;
        if (filter !== 'all') {
            filteredTransactions = sortedTransactions.filter(t => t.type === filter);
        }
        
        // En fazla son 10 işlemi göster
        const recentTransactions = filteredTransactions.slice(0, 10);
        
        // İşlemleri ekle
        recentTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.className = transaction.type;
            
            const dateCell = document.createElement('td');
            dateCell.textContent = this.formatDate(transaction.date);
            row.appendChild(dateCell);
            
            const categoryCell = document.createElement('td');
            categoryCell.textContent = categoryMap[transaction.categoryId] || 'Bilinmeyen Kategori';
            row.appendChild(categoryCell);
            
            const descCell = document.createElement('td');
            descCell.textContent = transaction.description || '-';
            row.appendChild(descCell);
            
            const amountCell = document.createElement('td');
            amountCell.className = `amount-${transaction.type}`;
            amountCell.textContent = this.formatCurrency(transaction.amount);
            row.appendChild(amountCell);
            
            const actionCell = document.createElement('td');
            
            // Düzenle butonu
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-secondary me-1';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.addEventListener('click', () => this.editTransaction(transaction));
            actionCell.appendChild(editBtn);
            
            // Sil butonu
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.addEventListener('click', () => this.deleteTransaction(transaction.id));
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(actionCell);
            
            transactionList.appendChild(row);
        });
        
        // Eğer işlem yoksa bilgi mesajı göster
        if (recentTransactions.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 5;
            emptyCell.className = 'text-center';
            emptyCell.textContent = 'Henüz işlem bulunmuyor.';
            emptyRow.appendChild(emptyCell);
            transactionList.appendChild(emptyRow);
        }
    },
    
    // İşlemleri filtrele
    filterTransactions(filter) {
        // Buton stillerini düzenle
        document.getElementById('filter-all').classList.remove('btn-secondary');
        document.getElementById('filter-all').classList.add('btn-outline-secondary');
        
        document.getElementById('filter-income').classList.remove('btn-success');
        document.getElementById('filter-income').classList.add('btn-outline-success');
        
        document.getElementById('filter-expense').classList.remove('btn-danger');
        document.getElementById('filter-expense').classList.add('btn-outline-danger');
        
        // Aktif filtre butonunu seç
        if (filter === 'all') {
            document.getElementById('filter-all').classList.remove('btn-outline-secondary');
            document.getElementById('filter-all').classList.add('btn-secondary');
        } else if (filter === 'income') {
            document.getElementById('filter-income').classList.remove('btn-outline-success');
            document.getElementById('filter-income').classList.add('btn-success');
        } else if (filter === 'expense') {
            document.getElementById('filter-expense').classList.remove('btn-outline-danger');
            document.getElementById('filter-expense').classList.add('btn-danger');
        }
        
        // İşlemleri yeniden oluştur
        this.renderTransactions(filter);
    },
    
    // Günlük raporu güncelleme
    async updateDailyReport(date) {
        // Tarih formatı
        const formattedDate = date.toISOString().split('T')[0];
        document.getElementById('daily-date').value = formattedDate;
        
        try {
            // Seçilen gün için özet hesapla
            const { totalIncome, totalExpense, balance } = await window.dataManager.calculateDailyTotals(date);
            
            // Özet bilgileri güncelle
            document.getElementById('daily-total-income').textContent = this.formatCurrency(totalIncome);
            document.getElementById('daily-total-expense').textContent = this.formatCurrency(totalExpense);
            document.getElementById('daily-balance').textContent = this.formatCurrency(balance);
            
            // Günlük işlemleri al
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            
            const transactions = await window.dataManager.getTransactionsByDateRange(startDate, endDate);
            
            // Kategori bilgilerini al
            const incomeCategories = await window.dataManager.getCategories('income');
            const expenseCategories = await window.dataManager.getCategories('expense');
        } catch (error) {
            console.error('Günlük rapor güncellenirken hata:', error);
        }
        
        // Kategori adlarını ID'ye göre hızlıca bulmak için map oluştur
        const categoryMap = {};
        incomeCategories.forEach(cat => {
            categoryMap[cat.id] = cat.name;
        });
        expenseCategories.forEach(cat => {
            categoryMap[cat.id] = cat.name;
        });
        
        // İşlemleri listele
        const dailyTransactions = document.getElementById('daily-transactions');
        dailyTransactions.innerHTML = '';
        
        if (transactions.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 3;
            emptyCell.className = 'text-center';
            emptyCell.textContent = 'Bu tarihte işlem bulunmuyor.';
            emptyRow.appendChild(emptyCell);
            dailyTransactions.appendChild(emptyRow);
        } else {
            transactions.forEach(transaction => {
                const row = document.createElement('tr');
                row.className = transaction.type;
                
                const categoryCell = document.createElement('td');
                categoryCell.textContent = categoryMap[transaction.categoryId] || 'Bilinmeyen Kategori';
                row.appendChild(categoryCell);
                
                const descCell = document.createElement('td');
                descCell.textContent = transaction.description || '-';
                row.appendChild(descCell);
                
                const amountCell = document.createElement('td');
                amountCell.className = `amount-${transaction.type}`;
                amountCell.textContent = this.formatCurrency(transaction.amount);
                row.appendChild(amountCell);
                
                dailyTransactions.appendChild(row);
            });
        }
        
        // Günlük grafikleri güncelle (hata koruması ekleyelim)
        try {
            ChartManager.updateDailyChart(date);
            ChartManager.updateWeeklyComparisonChart(date);
        } catch (error) {
            console.error('Günlük rapor grafikleri güncellenirken hata:', error);
        }
        
        // Günlük istatistikleri güncelle
        this.updateDailyStatistics(date, transactions);
    },
    
    // Günlük istatistikleri güncelleme
    updateDailyStatistics(date, transactions) {
        // İşlem sayısı
        document.getElementById('daily-transaction-count').textContent = transactions.length;
        
        // En yüksek gider kategorisini bul
        let topCategoryName = '-';
        let topCategoryAmount = 0;
        
        // Sadece giderleri filtrele
        const expenses = transactions.filter(t => t.type === 'expense');
        
        // Kategori bazında toplam hesapla
        const categoryTotals = {};
        expenses.forEach(expense => {
            if (!categoryTotals[expense.categoryId]) {
                categoryTotals[expense.categoryId] = 0;
            }
            categoryTotals[expense.categoryId] += parseFloat(expense.amount);
        });
        
        // En yüksek gider kategorisini bul
        if (Object.keys(categoryTotals).length > 0) {
            let topCategoryId = Object.keys(categoryTotals)[0];
            
            Object.keys(categoryTotals).forEach(categoryId => {
                if (categoryTotals[categoryId] > categoryTotals[topCategoryId]) {
                    topCategoryId = categoryId;
                }
            });
            
            // Kategori adını bul - bu kod zaten yukarıda çekildi, expenseCategories'i kullan
            const topCategory = expenseCategories.find(c => c.id === topCategoryId);
            
            if (topCategory) {
                topCategoryName = topCategory.name;
                topCategoryAmount = categoryTotals[topCategoryId];
            }
        }
        
        document.getElementById('daily-top-category').textContent = topCategoryName !== '-' ?
            `${topCategoryName} (${this.formatCurrency(topCategoryAmount)})` : '-';
        
        // Bütçe durumu
        const { totalIncome, totalExpense, balance } = window.dataManager.calculateDailyTotals(date);
        let budgetStatus = 'Dengeli';
        
        if (balance > 0) {
            budgetStatus = `Artıda (${this.formatCurrency(balance)})`;
            document.getElementById('daily-budget-status').className = 'text-success';
        } else if (balance < 0) {
            budgetStatus = `Ekside (${this.formatCurrency(balance)})`;
            document.getElementById('daily-budget-status').className = 'text-danger';
        } else if (totalIncome === 0 && totalExpense === 0) {
            budgetStatus = 'İşlem Yok';
            document.getElementById('daily-budget-status').className = '';
        } else {
            document.getElementById('daily-budget-status').className = 'text-info';
        }
        
        document.getElementById('daily-budget-status').textContent = budgetStatus;
        
        // Önceki güne göre değişim
        const previousDay = new Date(date);
        previousDay.setDate(previousDay.getDate() - 1);
        
        const prevTotals = window.dataManager.calculateDailyTotals(previousDay);
        
        let changePercent = '0%';
        let changeClass = '';
        
        if (prevTotals.totalExpense > 0 && totalExpense > 0) {
            const change = ((totalExpense - prevTotals.totalExpense) / prevTotals.totalExpense) * 100;
            
            if (change > 0) {
                changePercent = `+${change.toFixed(1)}%`;
                changeClass = 'text-danger';
            } else if (change < 0) {
                changePercent = `${change.toFixed(1)}%`;
                changeClass = 'text-success';
            }
        } else if (prevTotals.totalExpense === 0 && totalExpense > 0) {
            changePercent = '+∞%';
            changeClass = 'text-danger';
        } else if (prevTotals.totalExpense > 0 && totalExpense === 0) {
            changePercent = '-100%';
            changeClass = 'text-success';
        }
        
        document.getElementById('daily-change').textContent = changePercent;
        document.getElementById('daily-change').className = changeClass;
    },
    
    // Aylık raporu güncelleme
    updateMonthlyReport(year, month) {
        // Ay başlangıç ve bitiş tarihlerini hesapla
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        
        // Aylık özet hesapla
        const { totalIncome, totalExpense, balance } = window.dataManager.calculateMonthlyTotals(year, month);
        
        // Özet bilgileri güncelle
        document.getElementById('monthly-total-income').textContent = this.formatCurrency(totalIncome);
        document.getElementById('monthly-total-expense').textContent = this.formatCurrency(totalExpense);
        document.getElementById('monthly-balance').textContent = this.formatCurrency(balance);
        
        // Gider/Gelir oranını hesapla ve göster
        let expenseRatio = 0;
        if (totalIncome > 0) {
            expenseRatio = (totalExpense / totalIncome) * 100;
        }
        document.getElementById('monthly-expense-ratio').textContent = `${expenseRatio.toFixed(1)}%`;
        
        // Renklendirme
        if (expenseRatio > 100) {
            document.getElementById('monthly-expense-ratio').className = 'text-danger';
        } else if (expenseRatio > 80) {
            document.getElementById('monthly-expense-ratio').className = 'text-warning';
        } else {
            document.getElementById('monthly-expense-ratio').className = 'text-info';
        }
        
        // Ay içindeki işlemleri al
        const transactions = window.dataManager.getTransactionsByDateRange(startDate, endDate);
        
        // Grafikleri güncelle (hata koruması ekleyelim)
        try {
            console.log(`Aylık raporlar güncelleniyor: ${year}-${month+1}`);
            ChartManager.updateMonthlyPieChart(year, month);
            ChartManager.updateMonthlyLineChart(year, month);
            ChartManager.updateMonthlyCategoryChart(year, month);
            ChartManager.updateMonthlyComparisonChart(year, month);
        } catch (error) {
            console.error('Aylık rapor grafikleri güncellenirken hata:', error);
        }
        
        // En yüksek giderleri göster
        this.updateTopExpenses(year, month);
        
        // Aylık istatistikleri güncelle
        this.updateMonthlyStatistics(year, month, transactions);
    },
    
    // Kategori selector'larını doldurma
    async populateCategorySelects() {
        try {
            console.log('🔄 Categories loading başlatılıyor...');
            
            const incomeCategories = await window.dataManager.getCategories('income');
            const expenseCategories = await window.dataManager.getCategories('expense');
            
            console.log('📊 Income categories:', incomeCategories);
            console.log('💸 Expense categories:', expenseCategories);
            
            const incomeSelect = document.getElementById('income-category');
            const expenseSelect = document.getElementById('expense-category');
            
            if (!incomeSelect || !expenseSelect) {
                console.error('❌ Category select elementleri bulunamadı!');
                return;
            }
            
            // Selecto'ları temizle
            incomeSelect.innerHTML = '';
            expenseSelect.innerHTML = '';
            
            // Default option ekle
            const defaultIncomeOption = document.createElement('option');
            defaultIncomeOption.value = '';
            defaultIncomeOption.textContent = '-- Kategori Seçin --';
            incomeSelect.appendChild(defaultIncomeOption);
            
            const defaultExpenseOption = document.createElement('option');
            defaultExpenseOption.value = '';
            defaultExpenseOption.textContent = '-- Kategori Seçin --';
            expenseSelect.appendChild(defaultExpenseOption);
            
            // Gelir kategorilerini ekle
            incomeCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                incomeSelect.appendChild(option);
            });
            
            // Gider kategorilerini ekle
            expenseCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                expenseSelect.appendChild(option);
            });
            
            console.log(`✅ Categories loaded: ${incomeCategories.length} income, ${expenseCategories.length} expense`);
            
            // Eğer kategori yoksa default kategoriler oluştur
            if (incomeCategories.length === 0 && expenseCategories.length === 0) {
                console.warn('⚠️ Hiç kategori bulunamadı. Default kategoriler oluşturuluyor...');
                try {
                    await this.createDefaultCategories();
                } catch (error) {
                    console.error('❌ Default kategoriler oluşturulamadı:', error);
                    // Fallback olarak manuel buton göster
                    this.showCreateCategoriesButton();
                }
            }
            
        } catch (error) {
            console.error('❌ Categories populate hatası:', error);
        }
    },
    
    // Belirli bir select elementini gider kategorileriyle doldur
    async populateExpenseCategorySelect(selectId) {
        const expenseCategories = await window.dataManager.getCategories('expense');
        const select = document.getElementById(selectId);
        
        // Select'i temizle
        select.innerHTML = '';
        
        // Gider kategorilerini ekle
        expenseCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    },
    
    // Kategori listesini yükleme
    async loadCategories() {
        const incomeCategories = await window.dataManager.getCategories('income');
        const expenseCategories = await window.dataManager.getCategories('expense');
        
        const incomeCategoriesList = document.getElementById('income-categories-list');
        const expenseCategoriesList = document.getElementById('expense-categories-list');
        
        // Listeleri temizle
        incomeCategoriesList.innerHTML = '';
        expenseCategoriesList.innerHTML = '';
        
        // Gelir kategorilerini ekle
        incomeCategories.forEach(category => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = category.name;
            row.appendChild(nameCell);
            
            const colorCell = document.createElement('td');
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.style.width = '25px';
            colorSwatch.style.height = '25px';
            colorSwatch.style.backgroundColor = category.color;
            colorSwatch.style.borderRadius = '4px';
            colorCell.appendChild(colorSwatch);
            row.appendChild(colorCell);
            
            const actionCell = document.createElement('td');
            
            // Düzenle butonu
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-secondary me-1';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.addEventListener('click', () => this.editCategory(category));
            actionCell.appendChild(editBtn);
            
            // Sil butonu
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.addEventListener('click', () => this.deleteCategory(category.id, 'income'));
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(actionCell);
            
            incomeCategoriesList.appendChild(row);
        });
        
        // Gider kategorilerini ekle
        expenseCategories.forEach(category => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = category.name;
            row.appendChild(nameCell);
            
            const colorCell = document.createElement('td');
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.style.width = '25px';
            colorSwatch.style.height = '25px';
            colorSwatch.style.backgroundColor = category.color;
            colorSwatch.style.borderRadius = '4px';
            colorCell.appendChild(colorSwatch);
            row.appendChild(colorCell);
            
            const actionCell = document.createElement('td');
            
            // Düzenle butonu
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-secondary me-1';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.addEventListener('click', () => this.editCategory(category));
            actionCell.appendChild(editBtn);
            
            // Sil butonu
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.addEventListener('click', () => this.deleteCategory(category.id, 'expense'));
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(actionCell);
            
            expenseCategoriesList.appendChild(row);
        });
    },
    
    // İşlem ekleme/düzenleme kaydetme
    async saveTransaction(type) {
        // Form değerlerini al
        const amount = parseFloat(document.getElementById(`${type}-amount`).value);
        const categoryId = document.getElementById(`${type}-category`).value;
        const date = document.getElementById(`${type}-date`).value;
        const description = document.getElementById(`${type}-description`).value;
        
        if (isNaN(amount) || amount <= 0 || !categoryId || !date) {
            alert('Lütfen zorunlu alanları doldurun.');
            return;
        }
        
        // İşlem nesnesi
        const transaction = {
            type,
            amount,
            categoryId,
            date: new Date(date),
            description
        };
        
        // Gelir işlemi için gider şablonları
        if (type === 'income') {
            try {
                // Seçilen gider şablonlarını al
                const appliedExpensesJson = document.getElementById('income-applied-expenses').value;
                if (appliedExpensesJson && appliedExpensesJson !== '[]') {
                    const appliedExpenses = JSON.parse(appliedExpensesJson);
                    
                    if (appliedExpenses && appliedExpenses.length > 0) {
                        // Brüt tutar (orijinal)
                        transaction.grossAmount = amount;
                        
                        // Uygulanan giderleri ekle
                        transaction.appliedExpenses = appliedExpenses;
                        
                        // Toplam gideri hesapla
                        let totalExpenseAmount = 0;
                        appliedExpenses.forEach(expense => {
                            totalExpenseAmount += parseFloat(expense.amount);
                        });
                        
                        // Net tutar (brüt - giderler)
                        transaction.netAmount = transaction.grossAmount - totalExpenseAmount;
                        
                        // İşlem tutarını net tutar olarak ayarla
                        transaction.amount = transaction.netAmount;
                    }
                }
            } catch (error) {
                console.error('Gider şablonları işlenirken hata:', error);
            }
        }
        
        // Düzenleme veya yeni ekleme
        try {
            if (this.state.isEditingTransaction && this.state.editingTransactionId) {
                transaction.id = this.state.editingTransactionId;
                await window.dataManager.updateTransaction(this.state.editingTransactionId, transaction);
            } else {
                await window.dataManager.addTransaction(transaction);
            }
        } catch (error) {
            console.error('İşlem kaydedilirken hata:', error);
            alert('İşlem kaydedilirken hata oluştu: ' + error.message);
            return;
        }
        
        // Modal kapat
        const modalId = `${type}Modal`;
        const modalElement = document.getElementById(modalId);
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        
        // Formu sıfırla
        document.getElementById(`${type}-form`).reset();
        
        // Bugünün tarihini ata
        const today = new Date().toISOString().split('T')[0];
        document.getElementById(`${type}-date`).value = today;
        
        // Sayfayı yenile
        await this.refreshSummary();
        await this.renderTransactions();
        ChartManager.updateMonthlyChart();
    },
    
    // İşlem düzenleme modalını aç
    editTransaction(transaction) {
        // Düzenleme modunu ayarla
        this.state.isEditingTransaction = true;
        this.state.editingTransactionId = transaction.id;
        
        // Form alanlarını doldur
        const type = transaction.type;
        document.getElementById(`${type}-amount`).value = transaction.amount;
        document.getElementById(`${type}-category`).value = transaction.categoryId;
        document.getElementById(`${type}-description`).value = transaction.description || '';
        
        // Tarihi ayarla
        const date = new Date(transaction.date);
        const formattedDate = date.toISOString().split('T')[0];
        document.getElementById(`${type}-date`).value = formattedDate;
        
        // Modalı aç
        const modalId = `${type}Modal`;
        const modalElement = document.getElementById(modalId);
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    },
    
    // İşlem silme
    async deleteTransaction(id) {
        if (confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
            try {
                await window.dataManager.deleteTransaction(id);
                
                // Sayfayı yenile
                await this.refreshSummary();
                await this.renderTransactions();
                ChartManager.updateMonthlyChart();
            } catch (error) {
                console.error('İşlem silinirken hata:', error);
                alert('İşlem silinirken hata oluştu: ' + error.message);
            }
        }
    },
    
    // Kategori ekleme/düzenleme kaydetme
    async saveCategory() {
        // Form değerlerini al
        const name = document.getElementById('category-name').value;
        const type = document.getElementById('category-type').value;
        const color = document.getElementById('category-color').value;
        
        if (!name || !type || !color) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }
        
        // Kategori nesnesi
        const category = {
            name,
            color
        };
        
        // Kategori objesine type bilgisini ekle
        category.type = type;
        
        // Düzenleme veya yeni ekleme
        if (this.state.editingCategoryId) {
            await window.dataManager.updateCategory(this.state.editingCategoryId, category);
        } else {
            await window.dataManager.addCategory(category);
        }
        
        // Modal kapat
        const modalElement = document.getElementById('categoryModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        
        // Formu sıfırla
        document.getElementById('category-form').reset();
        this.state.editingCategoryId = null;
        
        // Listeleri güncelle
        await this.loadCategories();
        await this.populateCategorySelects();
    },
    
    // Kategori düzenleme modalını aç
    editCategory(category) {
        // Düzenleme ID'sini ayarla
        this.state.editingCategoryId = category.id;
        
        // Form alanlarını doldur
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-color').value = category.color;
        
        // Kategori türünü belirle
        const isIncome = category.id.startsWith('inc_');
        document.getElementById('category-type').value = isIncome ? 'income' : 'expense';
        
        // Modalı aç
        const modalElement = document.getElementById('categoryModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    },
    
    // Kategori silme
    async deleteCategory(id, type) {
        if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
            await window.dataManager.deleteCategory(id);
            
            // Listeleri güncelle
            await this.loadCategories();
            await this.populateCategorySelects();
        }
    },
    
    // Veri dışa aktarma
    exportToCSV() {
        const startDateStr = document.getElementById('export-start-date').value;
        const endDateStr = document.getElementById('export-end-date').value;
        
        if (!startDateStr || !endDateStr) {
            alert('Lütfen başlangıç ve bitiş tarihlerini seçin.');
            return;
        }
        
        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999);
        
        if (startDate > endDate) {
            alert('Başlangıç tarihi bitiş tarihinden sonra olamaz.');
            return;
        }
        
        // CSV verisi oluştur
        const csvData = window.dataManager.exportToCSV(startDate, endDate);
        
        if (!csvData) {
            alert('Seçilen tarih aralığında işlem bulunamadı.');
            return;
        }
        
        // CSV'yi indir
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `butce-takip-${startDateStr}-${endDateStr}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    // En yüksek giderleri listele
    async updateTopExpenses(year, month) {
        // Ay başlangıç ve bitiş tarihlerini hesapla
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        
        try {
            // Kategori bazlı giderleri al
            const categoryTotals = await window.dataManager.getCategoryTotals('expense', startDate, endDate);
            
            // Kategori bilgilerini al
            const expenseCategories = await window.dataManager.getCategories('expense');
        } catch (error) {
            console.error('En yüksek giderler güncellenirken hata:', error);
            return;
        }
        
        // Toplam gider hesapla
        let totalExpense = 0;
        Object.values(categoryTotals).forEach(amount => {
            totalExpense += amount;
        });
        
        // En yüksekten en düşüğe sırala için array oluştur
        const sortedCategories = [];
        
        Object.keys(categoryTotals).forEach(categoryId => {
            const category = expenseCategories.find(c => c.id === categoryId);
            if (category) {
                sortedCategories.push({
                    id: categoryId,
                    name: category.name,
                    amount: categoryTotals[categoryId]
                });
            }
        });
        
        // Toplamlarına göre sırala (büyükten küçüğe)
        sortedCategories.sort((a, b) => b.amount - a.amount);
        
        // En yüksek 5 kategoriyi göster
        const topExpensesList = document.getElementById('top-expenses');
        topExpensesList.innerHTML = '';
        
        if (sortedCategories.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 3;
            emptyCell.className = 'text-center';
            emptyCell.textContent = 'Bu ayda gider kaydı bulunmuyor.';
            emptyRow.appendChild(emptyCell);
            topExpensesList.appendChild(emptyRow);
            return;
        }
        
        // En fazla 5 kategoriyi göster
        const topCategories = sortedCategories.slice(0, 5);
        
        topCategories.forEach(category => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = category.name;
            row.appendChild(nameCell);
            
            const amountCell = document.createElement('td');
            amountCell.textContent = this.formatCurrency(category.amount);
            row.appendChild(amountCell);
            
            const ratioCell = document.createElement('td');
            const ratio = (category.amount / totalExpense) * 100;
            ratioCell.textContent = `${ratio.toFixed(1)}%`;
            row.appendChild(ratioCell);
            
            topExpensesList.appendChild(row);
        });
    },
    
    // Aylık istatistikleri güncelle
    updateMonthlyStatistics(year, month, transactions) {
        // Gün bazlı giderleri hesapla
        const dailyExpenses = {};
        
        // Ay başlangıç ve bitiş tarihlerini hesapla
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        const daysInMonth = endDate.getDate();
        
        // Sadece giderleri filtrele
        const expenses = transactions.filter(t => t.type === 'expense');
        
        // Her gün için giderleri topla
        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const day = date.getDate();
            
            if (!dailyExpenses[day]) {
                dailyExpenses[day] = 0;
            }
            
            dailyExpenses[day] += parseFloat(expense.amount);
        });
        
        // Ortalama, minimum ve maksimum değerleri hesapla
        let totalDailyExpense = 0;
        let minDailyExpense = Infinity;
        let maxDailyExpense = 0;
        let daysWithExpense = 0;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dailyExpense = dailyExpenses[day] || 0;
            
            if (dailyExpense > 0) {
                totalDailyExpense += dailyExpense;
                daysWithExpense++;
                
                if (dailyExpense < minDailyExpense) {
                    minDailyExpense = dailyExpense;
                }
                
                if (dailyExpense > maxDailyExpense) {
                    maxDailyExpense = dailyExpense;
                }
            }
        }
        
        // Ortalama günlük gider
        const avgDailyExpense = daysWithExpense > 0 ? totalDailyExpense / daysWithExpense : 0;
        
        // İstatistik alanlarını güncelle
        document.getElementById('avg-daily-expense').textContent = this.formatCurrency(avgDailyExpense);
        document.getElementById('max-daily-expense').textContent = maxDailyExpense > 0 ? this.formatCurrency(maxDailyExpense) : '0 ₺';
        document.getElementById('min-daily-expense').textContent = minDailyExpense < Infinity ? this.formatCurrency(minDailyExpense) : '0 ₺';
        
        // Geçen aya göre değişim hesapla
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        
        const prevMonthTotals = window.dataManager.calculateMonthlyTotals(prevYear, prevMonth);
        const currentMonthTotals = window.dataManager.calculateMonthlyTotals(year, month);
        
        let changePercent = '0%';
        let changeClass = '';
        
        if (prevMonthTotals.totalExpense > 0 && currentMonthTotals.totalExpense > 0) {
            const change = ((currentMonthTotals.totalExpense - prevMonthTotals.totalExpense) / prevMonthTotals.totalExpense) * 100;
            
            if (change > 0) {
                changePercent = `+${change.toFixed(1)}%`;
                changeClass = 'text-danger';
            } else if (change < 0) {
                changePercent = `${change.toFixed(1)}%`;
                changeClass = 'text-success';
            }
        } else if (prevMonthTotals.totalExpense === 0 && currentMonthTotals.totalExpense > 0) {
            changePercent = '+∞%';
            changeClass = 'text-danger';
        } else if (prevMonthTotals.totalExpense > 0 && currentMonthTotals.totalExpense === 0) {
            changePercent = '-100%';
            changeClass = 'text-success';
        }
        
        document.getElementById('prev-month-change').textContent = changePercent;
        document.getElementById('prev-month-change').className = changeClass;
    },
    
    // Otomatik giderleri listele
    async loadAutoExpenses() {
        try {
            const autoExpenses = await window.dataManager.getAutoExpenses();
            const autoExpensesList = document.getElementById('auto-expenses-list');
            
            // Gider kategorilerini al
            const expenseCategories = await window.dataManager.getCategories('expense');
        } catch (error) {
            console.error('Otomatik giderler yüklenirken hata:', error);
            return;
        }
        
        // Kategori adlarını ID'ye göre hızlıca bulmak için map oluştur
        const categoryMap = {};
        expenseCategories.forEach(cat => {
            categoryMap[cat.id] = cat.name;
        });
        
        // Listeyi temizle
        autoExpensesList.innerHTML = '';
        
        // Otomatik giderleri listele
        autoExpenses.forEach(autoExpense => {
            const row = document.createElement('tr');
            
            // Durum hücresi
            const statusCell = document.createElement('td');
            const statusSwitch = document.createElement('div');
            statusSwitch.className = 'form-check form-switch';
            
            const statusInput = document.createElement('input');
            statusInput.className = 'form-check-input';
            statusInput.type = 'checkbox';
            statusInput.checked = autoExpense.enabled;
            statusInput.addEventListener('change', () => this.toggleAutoExpenseStatus(autoExpense.id, statusInput.checked));
            
            statusSwitch.appendChild(statusInput);
            statusCell.appendChild(statusSwitch);
            row.appendChild(statusCell);
            
            // Ad hücresi
            const nameCell = document.createElement('td');
            nameCell.textContent = autoExpense.name;
            row.appendChild(nameCell);
            
            // Kategori hücresi
            const categoryCell = document.createElement('td');
            categoryCell.textContent = categoryMap[autoExpense.categoryId] || 'Bilinmeyen Kategori';
            row.appendChild(categoryCell);
            
            // Miktar hücresi
            const amountCell = document.createElement('td');
            amountCell.className = 'text-danger';
            amountCell.textContent = this.formatCurrency(autoExpense.amount);
            row.appendChild(amountCell);
            
            // Açıklama hücresi
            const descCell = document.createElement('td');
            descCell.textContent = autoExpense.description || '-';
            row.appendChild(descCell);
            
            // İşlem hücresi
            const actionCell = document.createElement('td');
            
            // Düzenle butonu
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-secondary me-1';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.addEventListener('click', () => this.editAutoExpense(autoExpense));
            actionCell.appendChild(editBtn);
            
            // Sil butonu
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.addEventListener('click', () => this.deleteAutoExpense(autoExpense.id));
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(actionCell);
            
            autoExpensesList.appendChild(row);
        });
        
        // Eğer otomatik gider yoksa bilgi mesajı göster
        if (autoExpenses.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 6;
            emptyCell.className = 'text-center';
            emptyCell.textContent = 'Henüz otomatik gider bulunmuyor.';
            emptyRow.appendChild(emptyCell);
            autoExpensesList.appendChild(emptyRow);
        }
    },
    
    // Otomatik gider ekleme/düzenleme
    saveAutoExpense() {
        // Form değerlerini al
        const name = document.getElementById('auto-expense-name').value;
        const amount = parseFloat(document.getElementById('auto-expense-amount').value);
        const categoryId = document.getElementById('auto-expense-category').value;
        const description = document.getElementById('auto-expense-description').value;
        const enabled = document.getElementById('auto-expense-enabled').checked;
        
        if (!name || isNaN(amount) || amount <= 0 || !categoryId) {
            alert('Lütfen zorunlu alanları doldurun.');
            return;
        }
        
        // Otomatik gider nesnesi
        const autoExpense = {
            name,
            amount,
            categoryId,
            description,
            enabled
        };
        
        // Düzenleme veya yeni ekleme
        if (this.state.editingAutoExpenseId) {
            autoExpense.id = this.state.editingAutoExpenseId;
            window.dataManager.updateAutoExpense(autoExpense);
        } else {
            window.dataManager.addAutoExpense(autoExpense);
        }
        
        // Modal kapat
        const modalElement = document.getElementById('autoExpenseModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        
        // Formu sıfırla
        document.getElementById('auto-expense-form').reset();
        this.state.editingAutoExpenseId = null;
        
        // Listeyi güncelle
        this.loadAutoExpenses();
    },
    
    // Otomatik gider düzenleme modalını aç
    editAutoExpense(autoExpense) {
        // Düzenleme ID'sini ayarla
        this.state.editingAutoExpenseId = autoExpense.id;
        
        // Form alanlarını doldur
        document.getElementById('auto-expense-name').value = autoExpense.name;
        document.getElementById('auto-expense-amount').value = autoExpense.amount;
        document.getElementById('auto-expense-category').value = autoExpense.categoryId;
        document.getElementById('auto-expense-description').value = autoExpense.description || '';
        document.getElementById('auto-expense-enabled').checked = autoExpense.enabled;
        
        // Modalı aç
        const modalElement = document.getElementById('autoExpenseModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    },
    
    // Otomatik gider sil
    deleteAutoExpense(id) {
        if (confirm('Bu otomatik gideri silmek istediğinizden emin misiniz?')) {
            window.dataManager.deleteAutoExpense(id);
            
            // Listeyi güncelle
            this.loadAutoExpenses();
        }
    },
    
    // Otomatik gider durumunu değiştir
    toggleAutoExpenseStatus(id, enabled) {
        const autoExpenses = window.dataManager.getAutoExpenses();
        const autoExpense = autoExpenses.find(a => a.id === id);
        
        if (autoExpense) {
            autoExpense.enabled = enabled;
            window.dataManager.updateAutoExpense(autoExpense);
        }
    },
    
    // Gider Şablonları Yönetimi

    // Gider şablonlarını listele
    async loadExpenseTemplates() {
        let expenseTemplates, expenseCategories;
        
        try {
            expenseTemplates = await window.dataManager.getExpenseTemplates();
            const expenseTemplatesList = document.getElementById('expense-templates-list');
            
            // Gider kategorilerini al
            expenseCategories = await window.dataManager.getCategories('expense');
            
            // Kategori adlarını ID'ye göre hızlıca bulmak için map oluştur
            const categoryMap = {};
            expenseCategories.forEach(cat => {
                categoryMap[cat.id] = cat.name;
            });
        } catch (error) {
            console.error('Gider şablonları yüklenirken hata:', error);
            return;
        }
        
        // Listeyi temizle
        expenseTemplatesList.innerHTML = '';
        
        // Gider şablonlarını listele
        expenseTemplates.forEach(template => {
            const row = document.createElement('tr');
            
            // Ad hücresi
            const nameCell = document.createElement('td');
            nameCell.textContent = template.name;
            row.appendChild(nameCell);
            
            // Kategori hücresi
            const categoryCell = document.createElement('td');
            categoryCell.textContent = categoryMap[template.categoryId] || 'Bilinmeyen Kategori';
            row.appendChild(categoryCell);
            
            // Miktar hücresi
            const amountCell = document.createElement('td');
            amountCell.className = 'text-danger';
            amountCell.textContent = this.formatCurrency(template.amount);
            row.appendChild(amountCell);
            
            // Açıklama hücresi
            const descCell = document.createElement('td');
            descCell.textContent = template.description || '-';
            row.appendChild(descCell);
            
            // İşlem hücresi
            const actionCell = document.createElement('td');
            
            // Düzenle butonu
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-secondary me-1';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.addEventListener('click', () => this.editExpenseTemplate(template));
            actionCell.appendChild(editBtn);
            
            // Sil butonu
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.addEventListener('click', () => this.deleteExpenseTemplate(template.id));
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(actionCell);
            
            expenseTemplatesList.appendChild(row);
        });
        
        // Eğer gider şablonu yoksa bilgi mesajı göster
        if (expenseTemplates.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 5;
            emptyCell.className = 'text-center';
            emptyCell.textContent = 'Henüz tanımlanmış gider şablonu bulunmuyor.';
            emptyRow.appendChild(emptyCell);
            expenseTemplatesList.appendChild(emptyRow);
        }
        
        // Gelir ekleme modalı için şablon seçim listesini de güncelle
        this.updateExpenseTemplateSelect();
    },
    
    // Gider şablon seçim listesini güncelleme
    updateExpenseTemplateSelect() {
        const expenseTemplates = window.dataManager.getExpenseTemplates();
        const select = document.getElementById('expense-template-select');
        
        // İlk seçenek dışındaki seçenekleri temizle
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Şablonları ekle
        expenseTemplates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.id;
            option.textContent = `${template.name} (${this.formatCurrency(template.amount)})`;
            select.appendChild(option);
        });
    },
    
    // Gider şablonu ekleme/düzenleme
    saveExpenseTemplate() {
        // Form değerlerini al
        const name = document.getElementById('expense-template-name').value;
        const amount = parseFloat(document.getElementById('expense-template-amount').value);
        const categoryId = document.getElementById('expense-template-category').value;
        const description = document.getElementById('expense-template-description').value;
        
        if (!name || isNaN(amount) || amount <= 0 || !categoryId) {
            alert('Lütfen zorunlu alanları doldurun.');
            return;
        }
        
        // Gider şablonu nesnesi
        const expenseTemplate = {
            name,
            amount,
            categoryId,
            description
        };
        
        // Düzenleme veya yeni ekleme
        if (this.state.editingExpenseTemplateId) {
            expenseTemplate.id = this.state.editingExpenseTemplateId;
            window.dataManager.updateExpenseTemplate(expenseTemplate);
        } else {
            window.dataManager.addExpenseTemplate(expenseTemplate);
        }
        
        // Modal kapat
        const modalElement = document.getElementById('expenseTemplateModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        
        // Formu sıfırla
        document.getElementById('expense-template-form').reset();
        this.state.editingExpenseTemplateId = null;
        
        // Listeyi güncelle
        this.loadExpenseTemplates();
    },
    
    // Gider şablonu düzenleme modalını aç
    editExpenseTemplate(template) {
        // Düzenleme ID'sini ayarla
        this.state.editingExpenseTemplateId = template.id;
        
        // Form alanlarını doldur
        document.getElementById('expense-template-name').value = template.name;
        document.getElementById('expense-template-amount').value = template.amount;
        document.getElementById('expense-template-category').value = template.categoryId;
        document.getElementById('expense-template-description').value = template.description || '';
        
        // Modalı aç
        const modalElement = document.getElementById('expenseTemplateModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    },
    
    // Gider şablonu sil
    deleteExpenseTemplate(id) {
        if (confirm('Bu gider şablonunu silmek istediğinizden emin misiniz?')) {
            window.dataManager.deleteExpenseTemplate(id);
            
            // Listeyi güncelle
            this.loadExpenseTemplates();
        }
    },
    
    // Gelir ekleme formunda şablon işlemleri
    
    // Gelir formuna gider şablonu ekle
    addExpenseTemplateToIncome() {
        const select = document.getElementById('expense-template-select');
        const selectedTemplateId = select.value;
        
        if (!selectedTemplateId) {
            alert('Lütfen bir gider şablonu seçin.');
            return;
        }
        
        // Seçilen şablonu bul
        const templates = window.dataManager.getExpenseTemplates();
        const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
        
        if (!selectedTemplate) {
            return;
        }
        
        // Seçilen şablonu şablonlar listesine ekle
        this.state.selectedExpenseTemplates.push({
            id: selectedTemplate.id,
            name: selectedTemplate.name,
            amount: selectedTemplate.amount,
            categoryId: selectedTemplate.categoryId,
            description: selectedTemplate.description
        });
        
        // Şablonları görüntüle
        this.renderSelectedExpenseTemplates();
        
        // Tutarları güncelle
        this.updateIncomeAmounts();
        
        // Seçim kutusunu sıfırla
        select.selectedIndex = 0;
    },
    
    // Seçilen gider şablonlarını listele
    renderSelectedExpenseTemplates() {
        const container = document.getElementById('selected-expense-templates');
        container.innerHTML = '';
        
        this.state.selectedExpenseTemplates.forEach((template, index) => {
            const item = document.createElement('div');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            const content = document.createElement('div');
            content.innerHTML = `
                <div class="fw-bold">${template.name}</div>
                <div class="text-danger">${this.formatCurrency(template.amount)}</div>
            `;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-sm btn-outline-danger';
            removeBtn.innerHTML = '<i class="bi bi-x"></i>';
            removeBtn.addEventListener('click', () => this.removeExpenseTemplateFromIncome(index));
            
            item.appendChild(content);
            item.appendChild(removeBtn);
            container.appendChild(item);
        });
        
        // Seçilen şablonları JSON olarak hidden inputa kaydet
        document.getElementById('income-applied-expenses').value = JSON.stringify(this.state.selectedExpenseTemplates);
    },
    
    // Seçilen gider şablonunu kaldır
    removeExpenseTemplateFromIncome(index) {
        this.state.selectedExpenseTemplates.splice(index, 1);
        this.renderSelectedExpenseTemplates();
        this.updateIncomeAmounts();
    },
    
    // Gelir ekleme formunda brüt/net hesaplama
    updateIncomeAmounts() {
        const grossAmountInput = document.getElementById('income-amount');
        const grossAmount = parseFloat(grossAmountInput.value) || 0;
        
        // Toplam gider hesapla
        let totalExpenses = 0;
        this.state.selectedExpenseTemplates.forEach(template => {
            totalExpenses += parseFloat(template.amount);
        });
        
        // Net gelir hesapla
        const netAmount = grossAmount - totalExpenses;
        
        // Değerleri göster
        document.getElementById('income-gross-amount').textContent = this.formatCurrency(grossAmount);
        document.getElementById('income-total-expenses').textContent = this.formatCurrency(totalExpenses);
        document.getElementById('income-net-amount').textContent = this.formatCurrency(netAmount);
    },
    
    // Gider şablonları / şablon grupları sekme değiştirme
    showExpenseTemplateTab(tabName) {
        // Tüm şablon içeriklerini gizle
        document.getElementById('expense-templates-content').style.display = 'none';
        document.getElementById('expense-template-groups-content').style.display = 'none';
        
        // Aktif sekmeyi temizle
        document.querySelectorAll('#page-expense-templates .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Seçilen içeriği göster
        if (tabName === 'templates') {
            document.getElementById('expense-templates-content').style.display = 'block';
            document.getElementById('expense-templates-tab').classList.add('active');
            this.loadExpenseTemplates();
        } else if (tabName === 'groups') {
            document.getElementById('expense-template-groups-content').style.display = 'block';
            document.getElementById('expense-template-groups-tab').classList.add('active');
            this.loadExpenseTemplateGroups();
        }
        
        this.state.activeExpenseTemplateTab = tabName;
    },
    
    // Gelir formunda şablon sekme geçişi
    showIncomeTemplateTab(tabName) {
        if (tabName === 'single') {
            document.getElementById('single-templates-selector').style.display = 'block';
            document.getElementById('template-groups-selector').style.display = 'none';
            document.getElementById('single-templates-tab').classList.add('active');
            document.getElementById('template-groups-tab').classList.remove('active');
        } else if (tabName === 'groups') {
            document.getElementById('single-templates-selector').style.display = 'none';
            document.getElementById('template-groups-selector').style.display = 'block';
            document.getElementById('single-templates-tab').classList.remove('active');
            document.getElementById('template-groups-tab').classList.add('active');
            
            // Şablon gruplarını doldur (ilk kez geçiş yapıldığında)
            this.populateExpenseTemplateGroupSelect();
        }
    },
    // Şablon Grupları Yönetimi
    
    // Şablon gruplarını listele
    async loadExpenseTemplateGroups() {
        const groups = await window.dataManager.getExpenseTemplateGroups();
        const expenseTemplateGroupsList = document.getElementById('expense-template-groups-list');
        
        // Listeyi temizle
        expenseTemplateGroupsList.innerHTML = '';
        
        // Gider şablonlarını al (şablon adlarını ve kategori bilgilerini alabilmek için)
        const expenseTemplates = window.dataManager.getExpenseTemplates();
        
        // Şablon gruplarını listele
        groups.forEach(group => {
            const row = document.createElement('tr');
            
            // Ad hücresi
            const nameCell = document.createElement('td');
            nameCell.textContent = group.name;
            row.appendChild(nameCell);
            
            // İçerdiği şablonlar hücresi
            const templatesCell = document.createElement('td');
            const templateNames = [];
            
            if (group.templateIds && group.templateIds.length > 0) {
                group.templateIds.forEach(templateId => {
                    const template = expenseTemplates.find(t => t.id === templateId);
                    if (template) {
                        templateNames.push(template.name);
                    }
                });
            }
            
            templatesCell.textContent = templateNames.join(', ') || '-';
            row.appendChild(templatesCell);
            
            // Toplam tutar hücresi
            const amountCell = document.createElement('td');
            amountCell.className = 'text-danger';
            
            let totalAmount = 0;
            if (group.templateIds && group.templateIds.length > 0) {
                group.templateIds.forEach(templateId => {
                    const template = expenseTemplates.find(t => t.id === templateId);
                    if (template) {
                        totalAmount += parseFloat(template.amount);
                    }
                });
            }
            
            amountCell.textContent = this.formatCurrency(totalAmount);
            row.appendChild(amountCell);
            
            // Açıklama hücresi
            const descCell = document.createElement('td');
            descCell.textContent = group.description || '-';
            row.appendChild(descCell);
            
            // İşlem hücresi
            const actionCell = document.createElement('td');
            
            // Düzenle butonu
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-secondary me-1';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.addEventListener('click', () => this.editExpenseTemplateGroup(group));
            actionCell.appendChild(editBtn);
            
            // Sil butonu
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.addEventListener('click', () => this.deleteExpenseTemplateGroup(group.id));
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(actionCell);
            
            expenseTemplateGroupsList.appendChild(row);
        });
        
        // Eğer şablon grubu yoksa bilgi mesajı göster
        if (groups.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 5;
            emptyCell.className = 'text-center';
            emptyCell.textContent = 'Henüz tanımlanmış şablon grubu bulunmuyor.';
            emptyRow.appendChild(emptyCell);
            expenseTemplateGroupsList.appendChild(emptyRow);
        }
    },
    
    // Grup için şablon seçim kutusunu doldurma
    async populateTemplateForGroupSelect() {
        try {
            const expenseTemplates = await window.dataManager.getExpenseTemplates();
            const select = document.getElementById('template-for-group-select');
            
            // İlk seçenek dışındaki seçenekleri temizle
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Şablonları ekle
            expenseTemplates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.id;
                option.textContent = `${template.name} (${this.formatCurrency(template.amount)})`;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Şablon listesi doldurulurken hata:', error);
        }
    },
    
    // Gelir formundaki şablon grupları seçimini doldurma
    async populateExpenseTemplateGroupSelect() {
        const groups = await window.dataManager.getExpenseTemplateGroups();
        const select = document.getElementById('expense-template-group-select');
        
        // Seçim kutusunu temizle (ilk seçenek hariç)
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Şablon gruplarını ve toplam tutarı hesaplayarak ekle
        const expenseTemplates = window.dataManager.getExpenseTemplates();
        
        groups.forEach(group => {
            let totalAmount = 0;
            
            if (group.templateIds && group.templateIds.length > 0) {
                group.templateIds.forEach(templateId => {
                    const template = expenseTemplates.find(t => t.id === templateId);
                    if (template) {
                        totalAmount += parseFloat(template.amount);
                    }
                });
            }
            
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = `${group.name} (${this.formatCurrency(totalAmount)})`;
            select.appendChild(option);
        });
    },
    
    // Şablon grubu ekleme/düzenleme kaydetme
    saveExpenseTemplateGroup() {
        // Form değerlerini al
        const name = document.getElementById('expense-template-group-name').value;
        const description = document.getElementById('expense-template-group-description').value;
        
        if (!name) {
            alert('Lütfen grup adını girin.');
            return;
        }
        
        // Seçilen şablonları al
        const selectedTemplateIds = this.state.selectedGroupTemplates.map(template => template.id);
        
        if (selectedTemplateIds.length === 0) {
            alert('Lütfen en az bir şablon seçin.');
            return;
        }
        
        // Şablon grubu nesnesi
        const group = {
            name,
            description,
            templateIds: selectedTemplateIds
        };
        
        // Düzenleme veya yeni ekleme
        if (this.state.editingExpenseTemplateGroupId) {
            group.id = this.state.editingExpenseTemplateGroupId;
            window.dataManager.updateExpenseTemplateGroup(group);
        } else {
            window.dataManager.addExpenseTemplateGroup(group);
        }
        
        // Modal kapat
        const modalElement = document.getElementById('expenseTemplateGroupModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        
        // Formu sıfırla
        document.getElementById('expense-template-group-form').reset();
        this.state.editingExpenseTemplateGroupId = null;
        this.state.selectedGroupTemplates = [];
        document.getElementById('group-selected-templates').innerHTML = '';
        document.getElementById('group-total-amount').textContent = '0 ₺';
        
        // Şablon grupları listesini yenile
        this.loadExpenseTemplateGroups();
    },
    
    // Şablon grubunu düzenleme modalını aç
    editExpenseTemplateGroup(group) {
        // Düzenleme ID'sini ayarla
        this.state.editingExpenseTemplateGroupId = group.id;
        
        // Form alanlarını doldur
        document.getElementById('expense-template-group-name').value = group.name;
        document.getElementById('expense-template-group-description').value = group.description || '';
        
        // Gruptaki şablonları yükle
        this.state.selectedGroupTemplates = [];
        
        if (group.templateIds && group.templateIds.length > 0) {
            const expenseTemplates = window.dataManager.getExpenseTemplates();
            
            group.templateIds.forEach(templateId => {
                const template = expenseTemplates.find(t => t.id === templateId);
                if (template) {
                    this.state.selectedGroupTemplates.push({
                        id: template.id,
                        name: template.name,
                        amount: template.amount,
                        categoryId: template.categoryId,
                        description: template.description
                    });
                }
            });
        }
        
        // Seçilen şablonları göster
        this.renderGroupSelectedTemplates();
        
        // Modalı aç
        const modalElement = document.getElementById('expenseTemplateGroupModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    },
    
    // Şablon grubunu sil
    deleteExpenseTemplateGroup(id) {
        if (confirm('Bu şablon grubunu silmek istediğinizden emin misiniz?')) {
            window.dataManager.deleteExpenseTemplateGroup(id);
            
            // Listeyi güncelle
            this.loadExpenseTemplateGroups();
        }
    },
    
    // Şablon grubuna şablon ekleme
    addTemplateToGroup() {
        const select = document.getElementById('template-for-group-select');
        const selectedTemplateId = select.value;
        
        if (!selectedTemplateId) {
            alert('Lütfen bir şablon seçin.');
            return;
        }
        
        // Zaten eklenmiş mi kontrol et
        if (this.state.selectedGroupTemplates.some(t => t.id === selectedTemplateId)) {
            alert('Bu şablon zaten gruba eklenmiş.');
            return;
        }
        
        // Seçilen şablonu bul
        const templates = window.dataManager.getExpenseTemplates();
        const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
        
        if (!selectedTemplate) {
            return;
        }
        
        // Şablonu gruba ekle
        this.state.selectedGroupTemplates.push({
            id: selectedTemplate.id,
            name: selectedTemplate.name,
            amount: selectedTemplate.amount,
            categoryId: selectedTemplate.categoryId,
            description: selectedTemplate.description
        });
        
        // Şablonları göster
        this.renderGroupSelectedTemplates();
        
        // Seçim kutusunu sıfırla
        select.selectedIndex = 0;
        
        // Seçilen şablonların içeriğini konsola logla (Debug için)
        console.log('Eklenen şablonlar:', this.state.selectedGroupTemplates);
    },
    
    // Grup şablonlarını listele
    renderGroupSelectedTemplates() {
        const container = document.getElementById('group-selected-templates');
        container.innerHTML = '';
        
        let totalAmount = 0;
        
        // Eğer hiç şablon yoksa bilgi mesajı göster
        if (this.state.selectedGroupTemplates.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'list-group-item text-center text-muted';
            emptyMessage.textContent = 'Henüz şablon eklenmemiş';
            container.appendChild(emptyMessage);
        } else {
            // Şablonları listele
            this.state.selectedGroupTemplates.forEach((template, index) => {
                const item = document.createElement('div');
                item.className = 'list-group-item d-flex justify-content-between align-items-center';
                
                const content = document.createElement('div');
                content.innerHTML = `
                    <div class="fw-bold">${template.name}</div>
                    <div class="text-danger">${this.formatCurrency(template.amount)}</div>
                `;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'btn btn-sm btn-outline-danger';
                removeBtn.innerHTML = '<i class="bi bi-x"></i>';
                removeBtn.addEventListener('click', () => this.removeTemplateFromGroup(index));
                
                item.appendChild(content);
                item.appendChild(removeBtn);
                container.appendChild(item);
                
                totalAmount += parseFloat(template.amount);
            });
        }
        
        // Toplam tutarı güncelle
        document.getElementById('group-total-amount').textContent = this.formatCurrency(totalAmount);
        
        // Debug için log
        console.log(`${this.state.selectedGroupTemplates.length} şablon listelendi, toplam: ${totalAmount}`);
    },
    
    // Gruptan şablon kaldır
    removeTemplateFromGroup(index) {
        this.state.selectedGroupTemplates.splice(index, 1);
        this.renderGroupSelectedTemplates();
    },
    
    // Gelir formuna şablon grubu ekleme
    async addExpenseTemplateGroupToIncome() {
        const select = document.getElementById('expense-template-group-select');
        const selectedGroupId = select.value;
        
        if (!selectedGroupId) {
            alert('Lütfen bir şablon grubu seçin.');
            return;
        }
        
        try {
            // Seçilen grubu bul
            const groups = await window.dataManager.getExpenseTemplateGroups();
            const selectedGroup = groups.find(g => g.id === selectedGroupId);
            
            if (!selectedGroup || !selectedGroup.templateIds || selectedGroup.templateIds.length === 0) {
                return;
            }
            
            // Gruptaki tüm şablonları ekle
            const templates = await window.dataManager.getExpenseTemplates();
        } catch (error) {
            console.error('Şablon grubu eklenirken hata:', error);
            alert('Şablon grubu eklenirken hata oluştu.');
            return;
        }
        let addedCount = 0;
        
        selectedGroup.templateIds.forEach(templateId => {
            const template = templates.find(t => t.id === templateId);
            if (template) {
                // Şablonu şablonlar listesine ekle
                this.state.selectedExpenseTemplates.push({
                    id: template.id,
                    name: template.name,
                    amount: template.amount,
                    categoryId: template.categoryId,
                    description: template.description
                });
                addedCount++;
            }
        });
        
        if (addedCount > 0) {
            // Şablonları görüntüle
            this.renderSelectedExpenseTemplates();
            
            // Tutarları güncelle
            this.updateIncomeAmounts();
            
            // Kullanıcıya bilgi ver
            alert(`"${selectedGroup.name}" grubundaki ${addedCount} şablon başarıyla eklendi.`);
            
            // Seçim kutusunu sıfırla
            select.selectedIndex = 0;
        }
    },

    // Default kategoriler oluştur
    async createDefaultCategories() {
        console.log('🏗️ Default kategoriler oluşturuluyor...');
        
        const defaultIncomeCategories = [
            { name: 'Maaş', type: 'income', color: '#28a745' },
            { name: 'Freelance', type: 'income', color: '#17a2b8' },
            { name: 'Yatırım Geliri', type: 'income', color: '#007bff' },
            { name: 'Diğer Gelirler', type: 'income', color: '#6c757d' }
        ];
        
        const defaultExpenseCategories = [
            { name: 'Market', type: 'expense', color: '#dc3545' },
            { name: 'Ulaşım', type: 'expense', color: '#fd7e14' },
            { name: 'Faturalar', type: 'expense', color: '#e83e8c' },
            { name: 'Eğlence', type: 'expense', color: '#6f42c1' },
            { name: 'Sağlık', type: 'expense', color: '#20c997' },
            { name: 'Kira', type: 'expense', color: '#dc3545' },
            { name: 'Diğer Giderler', type: 'expense', color: '#6c757d' }
        ];
        
        try {
            // Income kategorileri oluştur
            for (const category of defaultIncomeCategories) {
                await window.dataManager.addCategory(category);
                console.log(`✅ Created income category: ${category.name}`);
            }
            
            // Expense kategorileri oluştur
            for (const category of defaultExpenseCategories) {
                await window.dataManager.addCategory(category);
                console.log(`✅ Created expense category: ${category.name}`);
            }
            
            console.log('🎉 Tüm default kategoriler oluşturuldu!');
            
            // Categories'leri yeniden yükle
            await this.populateCategorySelects();
            await this.loadCategories();
            
        } catch (error) {
            console.error('❌ Default kategoriler oluşturulurken hata:', error);
        }
    },

    // Manuel kategori oluşturma butonu göster
    showCreateCategoriesButton() {
        console.log('📝 Manuel kategori oluşturma butonu gösteriliyor...');
        
        // Income select'e manuel seçenek ekle
        const incomeSelect = document.getElementById('income-category');
        if (incomeSelect) {
            const manualOption = document.createElement('option');
            manualOption.value = 'create_manual';
            manualOption.textContent = '+ Kategorileri Oluştur';
            manualOption.style.color = '#007bff';
            incomeSelect.appendChild(manualOption);
        }
        
        // Expense select'e manuel seçenek ekle
        const expenseSelect = document.getElementById('expense-category');
        if (expenseSelect) {
            const manualOption = document.createElement('option');
            manualOption.value = 'create_manual';
            manualOption.textContent = '+ Kategorileri Oluştur';
            manualOption.style.color = '#007bff';
            expenseSelect.appendChild(manualOption);
        }
        
        // Event listener ekle
        if (incomeSelect) {
            incomeSelect.addEventListener('change', (e) => {
                if (e.target.value === 'create_manual') {
                    this.manualCreateCategories();
                }
            });
        }
        
        if (expenseSelect) {
            expenseSelect.addEventListener('change', (e) => {
                if (e.target.value === 'create_manual') {
                    this.manualCreateCategories();
                }
            });
        }
    },

    // Manuel kategori oluşturma
    async manualCreateCategories() {
        if (confirm('Default kategorileri oluşturmak istediğinizden emin misiniz?\n\nOluşturulacak kategoriler:\n- Gelir: Maaş, Freelance, Yatırım Geliri, Diğer Gelirler\n- Gider: Market, Ulaşım, Faturalar, Eğlence, Sağlık, Kira, Diğer Giderler')) {
            try {
                await this.createDefaultCategories();
                alert('✅ Kategoriler başarıyla oluşturuldu!');
            } catch (error) {
                console.error('❌ Manuel kategori oluşturma hatası:', error);
                alert('❌ Kategoriler oluşturulamadı. Lütfen tekrar deneyin.');
            }
        }
    },

    // DEBUG: Current user kontrolü
    debugCurrentUser() {
        console.log('🔍 DEBUGGING Current User:');
        console.log('supabaseManager.currentUser:', window.supabaseManager?.currentUser);
        console.log('authManager.currentUser:', window.authManager?.currentUser);
        
        // Session kontrolü
        window.supabaseManager?.getCurrentUser().then(user => {
            console.log('getCurrentUser() result:', user);
            console.log('User ID:', user?.id);
            console.log('User Email:', user?.email);
        });
        
        // Session storage kontrolü - Doğru key'leri kontrol et
        const sbAuthToken = localStorage.getItem('sb-bffmuxipkfyhqqmfggzb-auth-token');
        const authKeys = Object.keys(localStorage).filter(key => key.includes('auth'));
        console.log('Auth Keys in localStorage:', authKeys);
        console.log('Supabase Auth Token:', sbAuthToken ? 'EXISTS' : 'EMPTY');
        
        // Session kontrolü
        window.supabaseManager?.client.auth.getSession().then(({ data: { session } }) => {
            console.log('Current Session:', session ? 'ACTIVE' : 'NONE');
            if (session) {
                console.log('Session User:', session.user.email);
                console.log('Token expires at:', new Date(session.expires_at * 1000));
            }
        });
    }
};

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Global referans - AuthManager tarafından erişilebilir olması için
window.app = App;
