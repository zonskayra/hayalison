/**
 * Finans Sistemi - Router
 * Single Page Application yönlendirme sistemi
 */

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.previousRoute = null;
        this.baseUrl = '/finans';
    }

    /**
     * Router'ı başlat
     */
    async init() {
        // Route tanımlamaları
        this.defineRoutes();
        
        // Popstate event listener
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname, e.state);
        });
        
        // Link click handler
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.getAttribute('data-route') || link.getAttribute('href');
                this.navigate(route);
            }
        });
        
        // İlk route'u handle et
        this.handleRoute(window.location.pathname);
    }

    /**
     * Route tanımlamaları
     */
    defineRoutes() {
        // Ana sayfa
        this.route('/', () => this.navigate('/dashboard'));
        this.route('/dashboard', () => import('../pages/dashboard.js'));
        
        // İşlemler
        this.route('/transactions', () => import('../pages/transactions.js'));
        this.route('/transaction/new', () => import('../pages/transaction-form.js'));
        this.route('/transaction/:id', (params) => import('../pages/transaction-form.js').then(m => m.default(params)));
        
        // Kategoriler
        this.route('/categories', () => import('../pages/categories.js'));
        this.route('/category/new', () => import('../pages/category-form.js'));
        this.route('/category/:id', (params) => import('../pages/category-form.js').then(m => m.default(params)));
        
        // Raporlar
        this.route('/reports', () => import('../pages/reports.js'));
        this.route('/reports/monthly', () => import('../pages/reports-monthly.js'));
        this.route('/reports/yearly', () => import('../pages/reports-yearly.js'));
        this.route('/reports/category', () => import('../pages/reports-category.js'));
        
        // Ayarlar
        this.route('/settings', () => import('../pages/settings.js'));
        this.route('/settings/profile', () => import('../pages/settings-profile.js'));
        this.route('/settings/preferences', () => import('../pages/settings-preferences.js'));
        this.route('/settings/backup', () => import('../pages/settings-backup.js'));
        
        // Yardım
        this.route('/help', () => import('../pages/help.js'));
        this.route('/about', () => import('../pages/about.js'));
        
        // 404
        this.route('*', () => import('../pages/404.js'));
    }

    /**
     * Route tanımla
     */
    route(path, handler) {
        this.routes.set(path, { path, handler });
    }

    /**
     * Route'a git
     */
    navigate(path, state = {}) {
        // Base URL'i kaldır
        if (path.startsWith(this.baseUrl)) {
            path = path.substring(this.baseUrl.length);
        }
        
        // Leading slash ekle
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        
        // History API
        const fullPath = this.baseUrl + path;
        window.history.pushState(state, '', fullPath);
        
        // Route'u handle et
        this.handleRoute(path, state);
    }

    /**
     * Geri git
     */
    back() {
        window.history.back();
    }

    /**
     * İleri git
     */
    forward() {
        window.history.forward();
    }

    /**
     * Route'u handle et
     */
    async handleRoute(path, state = {}) {
        // Loading göster
        this.showLoading();
        
        try {
            // Base URL'i kaldır
            if (path.startsWith(this.baseUrl)) {
                path = path.substring(this.baseUrl.length);
            }
            
            // Route bul
            const route = this.findRoute(path);
            
            if (!route) {
                // 404
                const handler = this.routes.get('*').handler;
                await this.loadPage(handler, {}, state);
                return;
            }
            
            // Önceki route'u kaydet
            this.previousRoute = this.currentRoute;
            this.currentRoute = { path, params: route.params, state };
            
            // Middleware kontrolleri
            if (!await this.checkMiddleware(route)) {
                return;
            }
            
            // Sayfayı yükle
            await this.loadPage(route.handler, route.params, state);
            
            // Active link'leri güncelle
            this.updateActiveLinks(path);
            
            // Analytics
            this.trackPageView(path);
            
        } catch (error) {
            console.error('Route hatası:', error);
            this.showError('Sayfa yüklenirken bir hata oluştu');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Route bul
     */
    findRoute(path) {
        // Exact match
        if (this.routes.has(path)) {
            return { 
                handler: this.routes.get(path).handler, 
                params: {} 
            };
        }
        
        // Parametreli route'ları kontrol et
        for (const [routePath, route] of this.routes) {
            const regex = this.pathToRegex(routePath);
            const match = path.match(regex);
            
            if (match) {
                const params = this.extractParams(routePath, path);
                return { 
                    handler: route.handler, 
                    params 
                };
            }
        }
        
        return null;
    }

    /**
     * Path'i regex'e çevir
     */
    pathToRegex(path) {
        if (path === '*') return /.*/;
        
        const pattern = path
            .replace(/\//g, '\\/')
            .replace(/:(\w+)/g, '([^/]+)');
        
        return new RegExp(`^${pattern}$`);
    }

    /**
     * Parametreleri çıkar
     */
    extractParams(routePath, actualPath) {
        const params = {};
        const routeParts = routePath.split('/');
        const actualParts = actualPath.split('/');
        
        routeParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                const paramName = part.substring(1);
                params[paramName] = actualParts[index];
            }
        });
        
        return params;
    }

    /**
     * Middleware kontrolleri
     */
    async checkMiddleware(route) {
        // Auth kontrolü
        if (route.requiresAuth && !this.isAuthenticated()) {
            this.navigate('/login');
            return false;
        }
        
        // Permission kontrolü
        if (route.permission && !this.hasPermission(route.permission)) {
            this.showError('Bu sayfaya erişim yetkiniz yok');
            return false;
        }
        
        return true;
    }

    /**
     * Sayfayı yükle
     */
    async loadPage(handler, params, state) {
        const container = document.getElementById('app-content');
        if (!container) {
            console.error('App content container bulunamadı');
            return;
        }
        
        // Önceki sayfayı temizle
        if (this.currentPage && typeof this.currentPage.destroy === 'function') {
            await this.currentPage.destroy();
        }
        
        // Handler'ı çalıştır
        const module = await handler(params, state);
        
        // Varsayılan export veya Page class'ı
        const Page = module.default || module.Page || module;
        
        if (typeof Page === 'function') {
            // Class veya function ise instance oluştur
            this.currentPage = new Page(container, params, state);
            
            if (typeof this.currentPage.init === 'function') {
                await this.currentPage.init();
            }
        } else if (typeof Page === 'string') {
            // HTML string ise direkt render et
            container.innerHTML = Page;
        } else if (Page && typeof Page.render === 'function') {
            // Render metodu olan obje
            this.currentPage = Page;
            const html = await Page.render(params, state);
            container.innerHTML = html;
            
            if (typeof Page.afterRender === 'function') {
                await Page.afterRender();
            }
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    /**
     * Active link'leri güncelle
     */
    updateActiveLinks(currentPath) {
        // Tüm active class'ları kaldır
        document.querySelectorAll('.nav-link.active').forEach(link => {
            link.classList.remove('active');
        });
        
        // Mevcut path'e göre active ekle
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href') || link.getAttribute('data-route');
            if (href === currentPath || href === this.baseUrl + currentPath) {
                link.classList.add('active');
                
                // Parent menu item'ı da active yap
                const parentMenu = link.closest('.nav-item.has-submenu');
                if (parentMenu) {
                    parentMenu.classList.add('active');
                }
            }
        });
    }

    /**
     * Loading göster
     */
    showLoading() {
        const loader = document.getElementById('route-loader');
        if (loader) {
            loader.style.display = 'block';
        }
    }

    /**
     * Loading gizle
     */
    hideLoading() {
        const loader = document.getElementById('route-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    /**
     * Hata göster
     */
    showError(message) {
        // TODO: Notification system ile entegre et
        alert(message);
    }

    /**
     * Auth kontrolü
     */
    isAuthenticated() {
        // TODO: Auth service ile entegre et
        return true;
    }

    /**
     * Permission kontrolü
     */
    hasPermission(permission) {
        // TODO: Auth service ile entegre et
        return true;
    }

    /**
     * Analytics
     */
    trackPageView(path) {
        // Google Analytics veya benzeri
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: this.baseUrl + path
            });
        }
    }

    /**
     * Query string parse et
     */
    parseQuery(queryString) {
        const params = new URLSearchParams(queryString);
        const result = {};
        
        for (const [key, value] of params) {
            result[key] = value;
        }
        
        return result;
    }

    /**
     * Query string oluştur
     */
    buildQuery(params) {
        const searchParams = new URLSearchParams();
        
        for (const [key, value] of Object.entries(params)) {
            if (value !== null && value !== undefined) {
                searchParams.append(key, value);
            }
        }
        
        const query = searchParams.toString();
        return query ? '?' + query : '';
    }
}

export default Router;
