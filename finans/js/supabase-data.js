/**
 * Supabase Veri Yönetimi
 * Pure Supabase API - No localStorage fallback
 */

class SupabaseDataManager {
    constructor() {
        this.supabase = window.supabaseManager;
        this.client = window.supabaseClient; // Direct Supabase client for database operations
    }

    /**
     * Kategorileri getir
     */
    async getCategories(type = null) {
        try {
            console.log(`🔍 getCategories called with type: ${type}`);
            
            let query = this.client
                .from('categories')
                .select('*')
                .order('name');

            // User filter (RLS için gerekli)
            if (this.supabase.currentUser) {
                query = query.eq('user_id', this.supabase.currentUser.id);
            }

            // Eğer type belirtilmişse filtrele
            if (type) {
                query = query.eq('type', type);
            }

            console.log('📡 Supabase query executing...');
            const { data, error } = await query;

            if (error) {
                console.error('❌ Supabase query error:', error);
                throw error;
            }
            
            console.log(`✅ Categories fetched from Supabase:`, data);
            console.log(`📊 Found ${data?.length || 0} categories`);
            
            return data || [];
        } catch (error) {
            console.error('❌ getCategories error:', error);
            return [];
        }
    }

    /**
     * Kategori ekle
     */
    async addCategory(category) {
        try {
            // Auth check ve supabaseManager üzerinden insert
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            // User ID ekle
            const categoryWithUser = {
                ...category,
                user_id: this.supabase.currentUser.id
            };

            const { data, error } = await this.client
                .from('categories')
                .insert([categoryWithUser])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Kategori eklenemedi:', error);
            throw error;
        }
    }

    /**
     * Kategori güncelle
     */
    async updateCategory(id, updates) {
        try {
            const { data, error } = await this.client
                .from('categories')
                .update(updates)
                .eq('id', id)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Kategori güncellenemedi:', error);
            throw error;
        }
    }

    /**
     * Kategori sil
     */
    async deleteCategory(id) {
        try {
            const { error } = await this.client
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Kategori silinemedi:', error);
            throw error;
        }
    }

    /**
     * İşlemleri getir
     */
    async getTransactions(filters = {}) {
        try {
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            const result = await this.supabase.getTransactions(filters);
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'İşlemler getirilemedi');
            }
        } catch (error) {
            console.error('İşlemler getirilemedi:', error);
            throw error;
        }
    }

    /**
     * İşlem ekle
     */
    async addTransaction(transaction) {
        try {
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            const result = await this.supabase.addTransaction({
                type: transaction.type,
                amount: transaction.amount,
                categoryId: transaction.categoryId,
                description: transaction.description,
                date: transaction.date
            });
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'İşlem eklenemedi');
            }
        } catch (error) {
            console.error('İşlem eklenemedi:', error);
            throw error;
        }
    }

    /**
     * İşlem güncelle
     */
    async updateTransaction(id, updates) {
        try {
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            const result = await this.supabase.updateTransaction(id, updates);
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'İşlem güncellenemedi');
            }
        } catch (error) {
            console.error('İşlem güncellenemedi:', error);
            throw error;
        }
    }

    /**
     * İşlem sil
     */
    async deleteTransaction(id) {
        try {
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            const result = await this.supabase.deleteTransaction(id);
            if (result.success) {
                return true;
            } else {
                throw new Error(result.error || 'İşlem silinemedi');
            }
        } catch (error) {
            console.error('İşlem silinemedi:', error);
            throw error;
        }
    }

    /**
     * Gider şablonlarını getir
     */
    async getExpenseTemplates() {
        try {
            const { data, error } = await this.client
                .from('expense_templates')
                .select('*')
                .order('name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Gider şablonları getirilemedi:', error);
            return [];
        }
    }

    /**
     * Gider şablonu ekle
     */
    async addExpenseTemplate(template) {
        try {
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            const result = await this.supabase.addExpenseTemplate({
                name: template.name,
                amount: template.amount,
                categoryId: template.categoryId,
                description: template.description
            });
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Gider şablonu eklenemedi');
            }
        } catch (error) {
            console.error('Gider şablonu eklenemedi:', error);
            throw error;
        }
    }

    /**
     * Gider şablonu güncelle
     */
    async updateExpenseTemplate(id, updates) {
        try {
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            const result = await this.supabase.updateExpenseTemplate(id, updates);
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Gider şablonu güncellenemedi');
            }
        } catch (error) {
            console.error('Gider şablonu güncellenemedi:', error);
            throw error;
        }
    }

    /**
     * Gider şablonu sil
     */
    async deleteExpenseTemplate(id) {
        try {
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            const result = await this.supabase.deleteExpenseTemplate(id);
            if (result.success) {
                return true;
            } else {
                throw new Error(result.error || 'Gider şablonu silinemedi');
            }
        } catch (error) {
            console.error('Gider şablonu silinemedi:', error);
            throw error;
        }
    }

    /**
     * Otomatik giderleri getir
     */
    async getAutoExpenses() {
        try {
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            const result = await this.supabase.getAutoExpenses();
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Otomatik giderler getirilemedi');
            }
        } catch (error) {
            console.error('Otomatik giderler getirilemedi:', error);
            throw error;
        }
    }

    /**
     * Otomatik gider ekle
     */
    async addAutoExpense(autoExpense) {
        try {
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            const result = await this.supabase.addAutoExpense({
                name: autoExpense.name,
                amount: autoExpense.amount,
                categoryId: autoExpense.categoryId,
                description: autoExpense.description,
                isPercentage: autoExpense.isPercentage || false,
                enabled: autoExpense.enabled !== false
            });
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Otomatik gider eklenemedi');
            }
        } catch (error) {
            console.error('Otomatik gider eklenemedi:', error);
            throw error;
        }
    }

    /**
     * Otomatik gider güncelle
     */
    async updateAutoExpense(id, updates) {
        try {
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            const result = await this.supabase.updateAutoExpense(id, updates);
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Otomatik gider güncellenemedi');
            }
        } catch (error) {
            console.error('Otomatik gider güncellenemedi:', error);
            throw error;
        }
    }

    /**
     * Otomatik gider sil
     */
    async deleteAutoExpense(id) {
        try {
            if (!this.supabase.currentUser) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            const result = await this.supabase.deleteAutoExpense(id);
            if (result.success) {
                return true;
            } else {
                throw new Error(result.error || 'Otomatik gider silinemedi');
            }
        } catch (error) {
            console.error('Otomatik gider silinemedi:', error);
            throw error;
        }
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Belirli bir tarih aralığındaki işlemleri getir
     */
    async getTransactionsByDateRange(startDate, endDate) {
        return await this.getTransactions({
            startDate: startDate,
            endDate: endDate
        });
    }

    /**
     * Toplam gelir, gider ve bakiyeyi hesapla
     */
    async calculateTotals() {
        try {
            const transactions = await this.getTransactions();
            let totalIncome = 0;
            let totalExpense = 0;
            
            transactions.forEach(transaction => {
                if (transaction.type === 'income') {
                    totalIncome += parseFloat(transaction.amount);
                } else {
                    totalExpense += parseFloat(transaction.amount);
                }
            });
            
            return {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense
            };
        } catch (error) {
            console.error('Toplam hesaplama hatası:', error);
            return {
                totalIncome: 0,
                totalExpense: 0,
                balance: 0
            };
        }
    }

    /**
     * Kategori bazında toplam tutarları hesapla
     */
    async getCategoryTotals(type, startDate, endDate) {
        try {
            const transactions = await this.getTransactionsByDateRange(startDate, endDate);
            
            // Belirtilen tipteki işlemleri filtrele
            const filteredTransactions = transactions.filter(t => t.type === type);
            
            // Kategori bazında toplam değerleri hesapla
            const totals = {};
            filteredTransactions.forEach(t => {
                const categoryId = t.category_id || t.categoryId;
                if (!totals[categoryId]) {
                    totals[categoryId] = 0;
                }
                totals[categoryId] += parseFloat(t.amount);
            });
            
            return totals;
        } catch (error) {
            console.error('Kategori toplamları hesaplama hatası:', error);
            return {};
        }
    }

    /**
     * Belirli bir ay için özet verileri hesapla
     */
    async calculateMonthlyTotals(year, month) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        try {
            const transactions = await this.getTransactionsByDateRange(startDate, endDate);
            let totalIncome = 0;
            let totalExpense = 0;

            transactions.forEach(transaction => {
                if (transaction.type === 'income') {
                    totalIncome += parseFloat(transaction.amount);
                } else {
                    totalExpense += parseFloat(transaction.amount);
                }
            });

            return {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense
            };
        } catch (error) {
            console.error('Aylık toplam hesaplama hatası:', error);
            return {
                totalIncome: 0,
                totalExpense: 0,
                balance: 0
            };
        }
    }

    /**
     * Belirli bir gün için özet verileri hesapla
     */
    async calculateDailyTotals(date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        try {
            const transactions = await this.getTransactionsByDateRange(startDate, endDate);
            let totalIncome = 0;
            let totalExpense = 0;

            transactions.forEach(transaction => {
                if (transaction.type === 'income') {
                    totalIncome += parseFloat(transaction.amount);
                } else {
                    totalExpense += parseFloat(transaction.amount);
                }
            });

            return {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense
            };
        } catch (error) {
            console.error('Günlük toplam hesaplama hatası:', error);
            return {
                totalIncome: 0,
                totalExpense: 0,
                balance: 0
            };
        }
    }

    /**
     * Gider şablon gruplarını getir
     */
    async getExpenseTemplateGroups() {
        try {
            const { data, error } = await this.client
                .from('expense_template_groups')
                .select('*')
                .order('name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Gider şablon grupları getirilemedi:', error);
            return [];
        }
    }

    /**
     * Gider şablon grubu ekle
     */
    async addExpenseTemplateGroup(group) {
        try {
            const { data, error } = await this.client
                .from('expense_template_groups')
                .insert([group])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Gider şablon grubu eklenemedi:', error);
            throw error;
        }
    }

    /**
     * Gider şablon grubu güncelle
     */
    async updateExpenseTemplateGroup(id, group) {
        try {
            const { data, error } = await this.client
                .from('expense_template_groups')
                .update(group)
                .eq('id', id)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Gider şablon grubu güncellenemedi:', error);
            throw error;
        }
    }

    /**
     * Gider şablon grubu sil
     */
    async deleteExpenseTemplateGroup(id) {
        try {
            const { error } = await this.client
                .from('expense_template_groups')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Gider şablon grubu silinemedi:', error);
            throw error;
        }
    }
}

// Global instance
window.dataManager = new SupabaseDataManager();
console.log('Pure Supabase Data Manager başarıyla başlatıldı:', window.dataManager);