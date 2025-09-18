/**
 * HAYALI ÇİZGİLİ - ANALYTICS & PERFORMANCE MONITORING
 * Gelişmiş analytics, conversion tracking ve performance monitoring
 */

// Google Analytics 4 Configuration
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Gerçek ID ile değiştirilecek

// Analytics Event Tracking
class AnalyticsManager {
    constructor() {
        this.isGALoaded = false;
        this.conversionEvents = [];
        this.performanceMetrics = {};
        this.init();
    }

    init() {
        this.loadGoogleAnalytics();
        this.trackPerformanceMetrics();
        this.setupEventListeners();
        this.trackUserBehavior();
    }

    // Google Analytics 4 Yükleme
    loadGoogleAnalytics() {
        // GA4 Script yükleme
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
        document.head.appendChild(script1);

        // GA4 Configuration
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', GA4_MEASUREMENT_ID, {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
            enhanced_ecommerce: true
        });

        this.isGALoaded = true;
        
    }

    // Core Web Vitals Tracking
    trackPerformanceMetrics() {
        // First Contentful Paint
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    this.performanceMetrics.fcp = entry.startTime;
                    this.sendPerformanceEvent('fcp', entry.startTime);
                }
            }
        }).observe({entryTypes: ['paint']});

        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.performanceMetrics.lcp = lastEntry.startTime;
            this.sendPerformanceEvent('lcp', lastEntry.startTime);
        }).observe({entryTypes: ['largest-contentful-paint']});

        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.performanceMetrics.cls = clsValue;
            this.sendPerformanceEvent('cls', clsValue);
        }).observe({entryTypes: ['layout-shift']});

        // First Input Delay
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                this.sendPerformanceEvent('fid', entry.processingStart - entry.startTime);
            }
        }).observe({entryTypes: ['first-input']});
    }

    // E-commerce Event Tracking
    trackEcommerceEvent(eventName, eventData) {
        if (!this.isGALoaded) return;

        gtag('event', eventName, {
            event_category: 'ecommerce',
            event_label: eventData.product_name || '',
            value: eventData.value || 0,
            currency: 'TRY',
            items: [{
                item_id: eventData.item_id || '',
                item_name: eventData.product_name || '',
                category: eventData.category || 'Kişiye Özel Hediyeler',
                quantity: eventData.quantity || 1,
                price: eventData.price || 0
            }]
        });

        
    }

    // Conversion Tracking
    trackConversion(conversionType, value = 0) {
        const conversionData = {
            event: 'conversion',
            conversion_type: conversionType,
            value: value,
            currency: 'TRY',
            timestamp: new Date().toISOString()
        };

        // GA4 Conversion Event
        if (this.isGALoaded) {
            gtag('event', 'purchase', {
                transaction_id: 'txn_' + Date.now(),
                value: value,
                currency: 'TRY',
                items: [{
                    item_id: 'conversion_' + conversionType,
                    item_name: conversionType,
                    category: 'Conversion',
                    quantity: 1,
                    price: value
                }]
            });
        }

        // Local storage for backup
        this.conversionEvents.push(conversionData);
        localStorage.setItem('hayali_conversions', JSON.stringify(this.conversionEvents));

        
    }

    // User Behavior Tracking
    trackUserBehavior() {
        // Scroll depth tracking
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                maxScroll = scrollPercent;
                this.sendEvent('scroll_depth', {
                    event_category: 'engagement',
                    event_label: `${scrollPercent}%`,
                    value: scrollPercent
                });
            }
        });

        // Time on page tracking
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            this.sendEvent('time_on_page', {
                event_category: 'engagement',
                value: timeOnPage
            });
        });
    }

    // Event Listener Setup
    setupEventListeners() {
        // Product view tracking
        document.addEventListener('DOMContentLoaded', () => {
            if (window.location.pathname.includes('urun')) {
                this.trackEcommerceEvent('view_item', {
                    item_id: 'boyama_kitabi',
                    product_name: 'Kişiye Özel Boyama Kitabı',
                    category: 'Kişiye Özel Hediyeler',
                    price: 250
                });
            }
        });

        // Button click tracking
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, .btn, a[href*="whatsapp"], a[href*="trendyol"]');
            if (!target) return;

            const eventData = {
                event_category: 'interaction',
                event_label: target.textContent.trim() || target.className,
                page_path: window.location.pathname
            };

            // Special tracking for commerce buttons
            if (target.textContent.includes('Sipariş') || target.textContent.includes('Satın Al')) {
                eventData.event_category = 'commerce';
                this.trackEcommerceEvent('add_to_cart', {
                    item_id: 'boyama_kitabi',
                    product_name: 'Kişiye Özel Boyama Kitabı',
                    price: 250
                });
            }

            if (target.href && target.href.includes('whatsapp')) {
                this.trackConversion('whatsapp_contact', 250);
            }

            this.sendEvent('button_click', eventData);
        });
    }

    // Generic Event Sender
    sendEvent(eventName, eventData) {
        if (this.isGALoaded) {
            gtag('event', eventName, eventData);
        }
        
    }

    // Performance Event Sender
    sendPerformanceEvent(metric, value) {
        this.sendEvent('performance_metric', {
            event_category: 'performance',
            event_label: metric,
            value: Math.round(value),
            custom_map: {
                'custom_metric_1': metric
            }
        });
    }

    // SEO Performance Tracking
    trackSEOMetrics() {
        // Track page load speed
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                this.sendEvent('page_load_speed', {
                    event_category: 'performance',
                    value: Math.round(pageLoadTime),
                    event_label: 'total_load_time'
                });
            }, 0);
        });
    }
}

// Initialize Analytics
const analytics = new AnalyticsManager();

// Export for global access
window.HayaliAnalytics = analytics;

// Auto-start SEO metrics tracking
document.addEventListener('DOMContentLoaded', () => {
    analytics.trackSEOMetrics();
});