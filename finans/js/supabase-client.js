/**
 * Supabase Client Konfigürasyonu
 * Finans Sistemi için Supabase bağlantısı ve temel yapılandırma
 */

// Supabase konfigürasyonu - Bu değerleri Supabase dashboard'dan alın
const SUPABASE_CONFIG = {
    url: 'https://bffmuxipkfyhqqmfggzb.supabase.co', // https://your-project-id.supabase.co
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmZm11eGlwa2Z5aHFxbWZnZ3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDIwNTcsImV4cCI6MjA2MzY3ODA1N30.LrJOepgicOJQ-S17izugU6GSwT73tEWEM_IFyiAHtf8' // Supabase dashboard'dan alınacak
};

// Supabase client'ı başlat - SESSION PERSISTENCE İLE
console.log('Supabase konfigürasyonu:', SUPABASE_CONFIG);
const supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
    auth: {
        storage: window.localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
    }
});
console.log('Supabase client başarıyla oluşturuldu:', supabaseClient);

// Global export for direct database access
window.supabaseClient = supabaseClient;

/**
 * Supabase Yardımcı Sınıfı
 * Veritabanı işlemleri için merkezi API
 */
class SupabaseClient {
    constructor() {
        this.client = supabaseClient;
        this.currentUser = null;
        this.isOnline = navigator.onLine;
        
        // Online/offline durumu takibi
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    /**
     * Kullanıcı kimlik doğrulama durumunu kontrol et
     */
    async getCurrentUser() {
        try {
            // Önce session'ı kontrol et
            const { data: { session }, error: sessionError } = await this.client.auth.getSession();
            
            if (session) {
                console.log('✅ Session bulundu:', session.user.email);
                this.currentUser = session.user;
                return session.user;
            }
            
            // Session yoksa user getir
            const { data: { user }, error } = await this.client.auth.getUser();
            if (error) throw error;
            
            console.log('✅ User getirdi:', user?.email || 'No user');
            this.currentUser = user;
            return user;
        } catch (error) {
            console.error('❌ Kullanıcı bilgisi alınamadı:', error);
            this.currentUser = null;
            return null;
        }
    }

    /**
     * Email ile kayıt ol
     */
    async signUp(email, password) {
        try {
            const { data, error } = await this.client.auth.signUp({
                email: email,
                password: password
            });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Kayıt hatası:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Email ile giriş yap
     */
    async signIn(email, password) {
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            this.currentUser = data.user;
            return { success: true, data };
        } catch (error) {
            console.error('Giriş hatası:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Çıkış yap
     */
    async signOut() {
        try {
            const { error } = await this.client.auth.signOut();
            if (error) throw error;
            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('Çıkış hatası:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Kimlik doğrulama durumu değişikliklerini dinle
     */
    onAuthStateChange(callback) {
        return this.client.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null;
            callback(event, session);
        });
    }

    // ==================== VERİ İŞLEMLERİ ====================

    /**
     * Kategorileri getir
     */
    async getCategories(type = null) {
        try {
            let query = this.client
                .from('categories')
                .select('*')
                .order('name');
            
            if (type) {
                query = query.eq('type', type);
            }
            
            const { data, error } = await query;
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Kategoriler getirilemedi:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Kategori ekle
     */
    async addCategory(category) {
        try {
            const { data, error } = await this.client
                .from('categories')
                .insert([{
                    name: category.name,
                    type: category.type,
                    color: category.color,
                    user_id: this.currentUser?.id
                }])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Kategori eklenemedi:', error);
            return { success: false, error: error.message };
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
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Kategori güncellenemedi:', error);
            return { success: false, error: error.message };
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
            return { success: true };
        } catch (error) {
            console.error('Kategori silinemedi:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * İşlemleri getir
     */
    async getTransactions(filters = {}) {
        try {
            let query = this.client
                .from('transactions')
                .select(`
                    *,
                    categories (
                        id,
                        name,
                        color,
                        type
                    )
                `)
                .order('date', { ascending: false });
            
            // Filtreler uygula
            if (filters.type) {
                query = query.eq('type', filters.type);
            }
            if (filters.startDate) {
                // Date objesini ISO string'e çevir
                const startDateISO = filters.startDate instanceof Date
                    ? filters.startDate.toISOString()
                    : filters.startDate;
                query = query.gte('date', startDateISO);
            }
            if (filters.endDate) {
                // Date objesini ISO string'e çevir
                const endDateISO = filters.endDate instanceof Date
                    ? filters.endDate.toISOString()
                    : filters.endDate;
                query = query.lte('date', endDateISO);
            }
            if (filters.categoryId) {
                query = query.eq('category_id', filters.categoryId);
            }
            
            const { data, error } = await query;
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('İşlemler getirilemedi:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * İşlem ekle
     */
    async addTransaction(transaction) {
        try {
            const { data, error } = await this.client
                .from('transactions')
                .insert([{
                    type: transaction.type,
                    amount: transaction.amount,
                    category_id: transaction.categoryId,
                    description: transaction.description,
                    date: transaction.date,
                    user_id: this.currentUser?.id
                }])
                .select(`
                    *,
                    categories (
                        id,
                        name,
                        color,
                        type
                    )
                `);
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('İşlem eklenemedi:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * İşlem güncelle
     */
    async updateTransaction(id, updates) {
        try {
            const { data, error } = await this.client
                .from('transactions')
                .update(updates)
                .eq('id', id)
                .select(`
                    *,
                    categories (
                        id,
                        name,
                        color,
                        type
                    )
                `);
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('İşlem güncellenemedi:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * İşlem sil
     */
    async deleteTransaction(id) {
        try {
            const { error } = await this.client
                .from('transactions')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('İşlem silinemedi:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Gider şablonlarını getir
     */
    async getExpenseTemplates() {
        try {
            const { data, error } = await this.client
                .from('expense_templates')
                .select(`
                    *,
                    categories (
                        id,
                        name,
                        color
                    )
                `)
                .order('name');
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Gider şablonları getirilemedi:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Gider şablonu ekle
     */
    async addExpenseTemplate(template) {
        try {
            const { data, error } = await this.client
                .from('expense_templates')
                .insert([{
                    name: template.name,
                    amount: template.amount,
                    category_id: template.categoryId,
                    description: template.description,
                    user_id: this.currentUser?.id
                }])
                .select(`
                    *,
                    categories (
                        id,
                        name,
                        color
                    )
                `);
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Gider şablonu eklenemedi:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Otomatik giderleri getir
     */
    async getAutoExpenses() {
        try {
            const { data, error } = await this.client
                .from('auto_expenses')
                .select(`
                    *,
                    categories (
                        id,
                        name,
                        color
                    )
                `)
                .order('name');
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Otomatik giderler getirilemedi:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Offline verileri senkronize et
     */
    async syncOfflineData() {
        if (!this.isOnline || !this.currentUser) return;
        
        try {
            // LocalStorage'daki offline verileri kontrol et
            const offlineData = localStorage.getItem('offline_transactions');
            if (offlineData) {
                const transactions = JSON.parse(offlineData);
                
                for (const transaction of transactions) {
                    await this.addTransaction(transaction);
                }
                
                // Senkronizasyon sonrası offline verileri temizle
                localStorage.removeItem('offline_transactions');
                console.log('Offline veriler senkronize edildi');
            }
        } catch (error) {
            console.error('Offline senkronizasyon hatası:', error);
        }
    }

    /**
     * Offline veri kaydet
     */
    saveOfflineTransaction(transaction) {
        try {
            const offlineData = localStorage.getItem('offline_transactions');
            const transactions = offlineData ? JSON.parse(offlineData) : [];
            
            transactions.push({
                ...transaction,
                offline_id: Date.now(),
                created_offline: true
            });
            
            localStorage.setItem('offline_transactions', JSON.stringify(transactions));
        } catch (error) {
            console.error('Offline veri kaydedilemedi:', error);
        }
    }

    /**
     * Bağlantı durumunu kontrol et
     */
    isConnected() {
        return this.isOnline;
    }

    /**
     * Gerçek zamanlı değişiklikleri dinle
     */
    subscribeToChanges(table, callback) {
        return this.client
            .channel(`public:${table}`)
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: table,
                    filter: `user_id=eq.${this.currentUser?.id}`
                }, 
                callback
            )
            .subscribe();
    }
}

// Global Supabase client instance
window.supabaseManager = new SupabaseClient();
console.log('Supabase Manager başarıyla başlatıldı:', window.supabaseManager);