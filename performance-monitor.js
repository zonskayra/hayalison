/* ===== CORE WEB VITALS MONITORING SCRIPT ===== */
// Real User Monitoring (RUM) for production performance tracking

class CoreWebVitalsMonitor {
    constructor() {
        this.metrics = {};
        this.initialized = false;
        this.init();
    }

    init() {
        if (this.initialized) return;
        
        // Wait for page to load
        if (document.readyState === 'complete') {
            this.startMonitoring();
        } else {
            window.addEventListener('load', () => this.startMonitoring());
        }
        
        this.initialized = true;
    }

    startMonitoring() {
        this.measureLCP();
        this.measureFID();
        this.measureCLS();
        this.measureFCP();
        this.measureTTFB();
        this.measurePageLoadMetrics();
        
        // Send metrics after 5 seconds to allow for CLS measurement
        setTimeout(() => this.sendMetrics(), 5000);
    }

    // Largest Contentful Paint (LCP) - Target: < 2.5s
    measureLCP() {
        if (!('PerformanceObserver' in window)) return;
        
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.metrics.lcp = {
                value: lastEntry.startTime,
                rating: this.getRating(lastEntry.startTime, 2500, 4000),
                element: lastEntry.element?.tagName || 'unknown',
                timestamp: Date.now()
            };
            
            
        });
        
        try {
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            
        }
    }

    // First Input Delay (FID) - Target: < 100ms
    measureFID() {
        if (!('PerformanceObserver' in window)) return;
        
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = {
                    value: entry.processingStart - entry.startTime,
                    rating: this.getRating(entry.processingStart - entry.startTime, 100, 300),
                    eventType: entry.name,
                    timestamp: Date.now()
                };
                
                
            });
        });
        
        try {
            observer.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            
        }
    }

    // Cumulative Layout Shift (CLS) - Target: < 0.1
    measureCLS() {
        if (!('PerformanceObserver' in window)) return;
        
        let clsValue = 0;
        let clsEntries = [];

        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    clsEntries.push(entry);
                }
            });
            
            this.metrics.cls = {
                value: clsValue,
                rating: this.getRating(clsValue, 0.1, 0.25),
                entries: clsEntries.length,
                timestamp: Date.now()
            };
            
            
        });
        
        try {
            observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            
        }
    }

    // First Contentful Paint (FCP) - Target: < 1.8s
    measureFCP() {
        if (!('PerformanceObserver' in window)) return;
        
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = {
                        value: entry.startTime,
                        rating: this.getRating(entry.startTime, 1800, 3000),
                        timestamp: Date.now()
                    };
                    
                    
                }
            });
        });
        
        try {
            observer.observe({ entryTypes: ['paint'] });
        } catch (e) {
            
        }
    }

    // Time to First Byte (TTFB) - Target: < 800ms
    measureTTFB() {
        if (!window.performance || !window.performance.timing) return;
        
        const { responseStart, requestStart } = window.performance.timing;
        const ttfb = responseStart - requestStart;
        
        this.metrics.ttfb = {
            value: ttfb,
            rating: this.getRating(ttfb, 800, 1800),
            timestamp: Date.now()
        };
        
        
    }

    // Additional page load metrics
    measurePageLoadMetrics() {
        if (!window.performance) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = window.performance.timing;
                const navigation = window.performance.getEntriesByType('navigation')[0];
                
                this.metrics.pageLoad = {
                    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                    loadComplete: timing.loadEventEnd - timing.navigationStart,
                    domInteractive: timing.domInteractive - timing.navigationStart,
                    totalBytes: navigation?.transferSize || 0,
                    timestamp: Date.now()
                };
                
                // Resource loading analysis
                this.analyzeResources();
                
                
            }, 100);
        });
    }

    analyzeResources() {
        const resources = window.performance.getEntriesByType('resource');
        const analysis = {
            totalRequests: resources.length,
            totalSize: 0,
            resourceTypes: {},
            slowestResources: []
        };

        resources.forEach(resource => {
            const type = this.getResourceType(resource.name);
            analysis.resourceTypes[type] = (analysis.resourceTypes[type] || 0) + 1;
            analysis.totalSize += resource.transferSize || 0;
            
            if (resource.duration > 1000) { // Resources taking > 1s
                analysis.slowestResources.push({
                    name: resource.name,
                    duration: Math.round(resource.duration),
                    size: resource.transferSize || 0
                });
            }
        });

        this.metrics.resources = analysis;
        
    }

    getResourceType(url) {
        if (url.includes('.js')) return 'javascript';
        if (url.includes('.css')) return 'stylesheet';
        if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
        if (url.includes('fonts.g') || url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
        if (url.match(/\.(mp4|webm|avi|mov)$/i)) return 'video';
        return 'other';
    }

    getRating(value, good, poor) {
        if (value <= good) return 'good';
        if (value <= poor) return 'needs-improvement';
        return 'poor';
    }

    // Performance Score calculation (similar to Lighthouse)
    calculatePerformanceScore() {
        const scores = {};
        let totalScore = 0;
        let totalWeight = 0;

        // Weighted scoring like Lighthouse
        const weights = {
            fcp: 0.15,
            lcp: 0.25,
            fid: 0.25,
            cls: 0.25,
            ttfb: 0.10
        };

        Object.keys(weights).forEach(metric => {
            if (this.metrics[metric]) {
                const score = this.getMetricScore(metric, this.metrics[metric].value);
                scores[metric] = score;
                totalScore += score * weights[metric];
                totalWeight += weights[metric];
            }
        });

        const overallScore = totalWeight > 0 ? Math.round(totalScore / totalWeight * 100) : 0;
        
        this.metrics.performanceScore = {
            overall: overallScore,
            breakdown: scores,
            rating: this.getScoreRating(overallScore)
        };

        return this.metrics.performanceScore;
    }

    getMetricScore(metric, value) {
        const thresholds = {
            fcp: [1800, 3000],
            lcp: [2500, 4000],
            fid: [100, 300],
            cls: [0.1, 0.25],
            ttfb: [800, 1800]
        };

        const [good, poor] = thresholds[metric] || [0, 0];
        if (value <= good) return 1;
        if (value >= poor) return 0;
        
        // Linear interpolation for values between good and poor
        return 1 - (value - good) / (poor - good);
    }

    getScoreRating(score) {
        if (score >= 90) return 'good';
        if (score >= 50) return 'needs-improvement';
        return 'poor';
    }

    // Send metrics to analytics or monitoring service
    sendMetrics() {
        const performanceScore = this.calculatePerformanceScore();
        
        const report = {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            metrics: this.metrics,
            score: performanceScore
        };

        // Log comprehensive report
        
        
        // Display user-friendly summary
        this.displaySummary(report);
        
        // In production, send to analytics
        // this.sendToAnalytics(report);
    }

    displaySummary(report) {
        const { metrics, score } = report;
        
        
        
        
        if (metrics.lcp) 
        if (metrics.fid) 
        if (metrics.cls) 
        if (metrics.fcp) 
        if (metrics.ttfb) 
        
        console.groupEnd();

        // Show recommendations
        this.showRecommendations(report);
    }

    showRecommendations(report) {
        const recommendations = [];
        const { metrics } = report;

        if (metrics.lcp?.rating === 'poor') {
            recommendations.push('🔧 LCP: Optimize largest image or text block loading');
        }
        if (metrics.fid?.rating === 'poor') {
            recommendations.push('🔧 FID: Reduce JavaScript execution time');
        }
        if (metrics.cls?.rating === 'poor') {
            recommendations.push('🔧 CLS: Add size attributes to images and ads');
        }
        if (metrics.fcp?.rating === 'poor') {
            recommendations.push('🔧 FCP: Optimize critical resource loading');
        }

        if (recommendations.length > 0) {
            
            recommendations.forEach(rec => 
            console.groupEnd();
        }
    }

    // Manual trigger for testing
    getReport() {
        this.sendMetrics();
        return this.metrics;
    }
}

// Auto-initialize
let performanceMonitor;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        performanceMonitor = new CoreWebVitalsMonitor();
    });
} else {
    performanceMonitor = new CoreWebVitalsMonitor();
}

// Global access for manual testing
window.performanceMonitor = performanceMonitor;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoreWebVitalsMonitor;
}