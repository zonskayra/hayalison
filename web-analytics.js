/* ===== DESKTOP ANALYTICS & TRACKING SYSTEM ===== */
/* Advanced analytics, user behavior tracking, and conversion optimization for desktop */

class DesktopAnalytics {
    constructor() {
        this.isDesktop = window.innerWidth >= 1024;
        this.sessionData = {};
        this.userBehavior = {
            clicks: [],
            scrollDepth: 0,
            timeOnPage: 0,
            interactions: [],
            mouseMovements: [],
            keyboardEvents: []
        };
        this.performanceMetrics = {};
        this.conversionFunnels = new Map();
        this.heatmapData = [];
        
        this.init();
    }

    init() {
        if (!this.isDesktop) return;
        
        console.log('📊 Desktop Analytics System başlatılıyor...');
        
        // Core analytics systems
        this.setupSessionTracking();
        this.setupUserBehaviorTracking();
        this.setupPerformanceTracking();
        this.setupConversionTracking();
        this.setupHeatmapTracking();
        this.setupA_BTestingFramework();
        this.setupCustomEventTracking();
        this.setupRealTimeAnalytics();
        this.setupDataVisualization();
        this.setupPrivacyCompliance();
        
        console.log('✅ Desktop Analytics System aktif');
    }

    // ===== SESSION TRACKING =====
    setupSessionTracking() {
        console.log('🕐 Session tracking aktifleştiriliyor...');
        
        this.sessionData = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            userId: this.getUserId(),
            deviceInfo: this.getDeviceInfo(),
            referrer: document.referrer,
            utm: this.getUTMParameters(),
            pageViews: 1,
            isNewUser: this.isNewUser(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        // Track page views
        this.trackPageView();
        
        // Track session duration
        this.startSessionTimer();
        
        // Track exit intent
        this.setupExitIntentTracking();
        
        // Save session data
        this.saveSessionData();
    }

    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUserId() {
        let userId = localStorage.getItem('desktop_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('desktop_user_id', userId);
        }
        return userId;
    }

    getDeviceInfo() {
        return {
            screenWidth: screen.width,
            screenHeight: screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio,
            colorDepth: screen.colorDepth,
            touchSupport: 'ontouchstart' in window,
            orientation: screen.orientation?.type || 'unknown',
            connection: navigator.connection?.effectiveType || 'unknown'
        };
    }

    getUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            source: urlParams.get('utm_source'),
            medium: urlParams.get('utm_medium'),
            campaign: urlParams.get('utm_campaign'),
            term: urlParams.get('utm_term'),
            content: urlParams.get('utm_content')
        };
    }

    isNewUser() {
        return !localStorage.getItem('desktop_returning_user');
    }

    trackPageView() {
        const pageData = {
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
            sessionId: this.sessionData.sessionId,
            userId: this.sessionData.userId,
            referrer: document.referrer,
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
        };
        
        this.sendEvent('page_view', pageData);
        
        // Mark as returning user
        localStorage.setItem('desktop_returning_user', 'true');
    }

    startSessionTimer() {
        this.sessionInterval = setInterval(() => {
            this.userBehavior.timeOnPage += 1000;
            
            // Send heartbeat every 30 seconds
            if (this.userBehavior.timeOnPage % 30000 === 0) {
                this.sendEvent('session_heartbeat', {
                    timeOnPage: this.userBehavior.timeOnPage,
                    scrollDepth: this.userBehavior.scrollDepth,
                    interactions: this.userBehavior.interactions.length
                });
            }
        }, 1000);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            clearInterval(this.sessionInterval);
            this.trackSessionEnd();
        });
    }

    setupExitIntentTracking() {
        let exitIntentTriggered = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentTriggered) {
                exitIntentTriggered = true;
                this.sendEvent('exit_intent', {
                    timeOnPage: this.userBehavior.timeOnPage,
                    scrollDepth: this.userBehavior.scrollDepth,
                    pageUrl: window.location.href
                });
            }
        });
    }

    // ===== USER BEHAVIOR TRACKING =====
    setupUserBehaviorTracking() {
        console.log('👤 User behavior tracking aktifleştiriliyor...');
        
        // Click tracking
        this.setupClickTracking();
        
        // Scroll tracking
        this.setupScrollTracking();
        
        // Mouse movement tracking
        this.setupMouseTracking();
        
        // Keyboard tracking
        this.setupKeyboardTracking();
        
        // Form interaction tracking
        this.setupFormTracking();
        
        // Video interaction tracking
        this.setupVideoTracking();
    }

    setupClickTracking() {
        document.addEventListener('click', (e) => {
            const clickData = {
                timestamp: Date.now(),
                element: e.target.tagName,
                id: e.target.id,
                className: e.target.className,
                text: e.target.textContent?.substring(0, 100),
                x: e.clientX,
                y: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                url: window.location.href
            };
            
            this.userBehavior.clicks.push(clickData);
            this.sendEvent('click', clickData);
            
            // Track specific element types
            if (e.target.matches('a')) {
                this.trackLinkClick(e.target, clickData);
            } else if (e.target.matches('button, .web-btn')) {
                this.trackButtonClick(e.target, clickData);
            } else if (e.target.matches('.web-product-card, .web-card')) {
                this.trackCardClick(e.target, clickData);
            }
        });
    }

    trackLinkClick(link, clickData) {
        const linkData = {
            ...clickData,
            href: link.href,
            isExternal: !link.href.startsWith(window.location.origin),
            isDownload: link.download !== undefined
        };
        
        this.sendEvent('link_click', linkData);
    }

    trackButtonClick(button, clickData) {
        const buttonData = {
            ...clickData,
            buttonType: button.type || 'button',
            formId: button.form?.id,
            action: button.dataset.action || 'unknown'
        };
        
        this.sendEvent('button_click', buttonData);
    }

    trackCardClick(card, clickData) {
        const cardData = {
            ...clickData,
            cardType: card.className.includes('product') ? 'product' : 'general',
            productId: card.dataset.productId,
            productName: card.querySelector('.web-product-title')?.textContent
        };
        
        this.sendEvent('card_click', cardData);
    }

    setupScrollTracking() {
        let maxScrollDepth = 0;
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent > maxScrollDepth) {
                    maxScrollDepth = scrollPercent;
                    this.userBehavior.scrollDepth = maxScrollDepth;
                    
                    // Send scroll milestones
                    if (maxScrollDepth % 25 === 0 && maxScrollDepth > 0) {
                        this.sendEvent('scroll_depth', {
                            depth: maxScrollDepth,
                            timestamp: Date.now(),
                            url: window.location.href
                        });
                    }
                }
            }, 100);
        }, { passive: true });
    }

    setupMouseTracking() {
        let mouseTimeout;
        let mouseMovements = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseMovements++;
            
            // Sample mouse movements (every 100th movement)
            if (mouseMovements % 100 === 0) {
                const mouseData = {
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now(),
                    movementCount: mouseMovements
                };
                
                this.userBehavior.mouseMovements.push(mouseData);
                this.heatmapData.push(mouseData);
            }
            
            // Track mouse idle
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                this.sendEvent('mouse_idle', {
                    lastX: e.clientX,
                    lastY: e.clientY,
                    idleDuration: 5000
                });
            }, 5000);
        });
        
        // Track mouse leave/enter
        document.addEventListener('mouseleave', () => {
            this.sendEvent('mouse_leave', { timestamp: Date.now() });
        });
        
        document.addEventListener('mouseenter', () => {
            this.sendEvent('mouse_enter', { timestamp: Date.now() });
        });
    }

    setupKeyboardTracking() {
        document.addEventListener('keydown', (e) => {
            // Don't track sensitive keys
            if (e.key.length === 1 && e.target.type === 'password') return;
            
            const keyData = {
                key: e.key,
                code: e.code,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                timestamp: Date.now(),
                targetElement: e.target.tagName
            };
            
            this.userBehavior.keyboardEvents.push(keyData);
            
            // Track shortcuts
            if (e.ctrlKey || e.altKey) {
                this.sendEvent('keyboard_shortcut', keyData);
            }
        });
    }

    setupFormTracking() {
        document.querySelectorAll('form').forEach(form => {
            // Track form starts
            form.addEventListener('focusin', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    this.sendEvent('form_start', {
                        formId: form.id,
                        fieldName: e.target.name,
                        fieldType: e.target.type,
                        timestamp: Date.now()
                    });
                }
            });
            
            // Track form submissions
            form.addEventListener('submit', (e) => {
                const formData = new FormData(form);
                const fields = {};
                
                for (let [key, value] of formData.entries()) {
                    // Don't send sensitive data
                    if (!key.includes('password') && !key.includes('card')) {
                        fields[key] = typeof value === 'string' ? value.substring(0, 50) : 'file';
                    }
                }
                
                this.sendEvent('form_submit', {
                    formId: form.id,
                    action: form.action,
                    method: form.method,
                    fieldCount: Object.keys(fields).length,
                    timestamp: Date.now()
                });
            });
            
            // Track form abandonment
            form.addEventListener('focusout', (e) => {
                setTimeout(() => {
                    if (!form.contains(document.activeElement)) {
                        this.sendEvent('form_abandon', {
                            formId: form.id,
                            lastField: e.target.name,
                            timestamp: Date.now()
                        });
                    }
                }, 100);
            });
        });
    }

    setupVideoTracking() {
        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('play', () => {
                this.sendEvent('video_play', {
                    videoSrc: video.src,
                    currentTime: video.currentTime,
                    duration: video.duration
                });
            });
            
            video.addEventListener('pause', () => {
                this.sendEvent('video_pause', {
                    videoSrc: video.src,
                    currentTime: video.currentTime,
                    duration: video.duration
                });
            });
            
            video.addEventListener('ended', () => {
                this.sendEvent('video_complete', {
                    videoSrc: video.src,
                    duration: video.duration
                });
            });
        });
    }

    // ===== PERFORMANCE TRACKING =====
    setupPerformanceTracking() {
        console.log('⚡ Performance tracking aktifleştiriliyor...');
        
        // Core Web Vitals
        this.trackCoreWebVitals();
        
        // Resource timing
        this.trackResourceTiming();
        
        // JavaScript errors
        this.trackJavaScriptErrors();
        
        // Network information
        this.trackNetworkInfo();
    }

    trackCoreWebVitals() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.performanceMetrics.lcp = lastEntry.startTime;
                this.sendEvent('web_vitals_lcp', {
                    value: lastEntry.startTime,
                    threshold: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs_improvement' : 'poor'
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    const fid = entry.processingStart - entry.startTime;
                    this.performanceMetrics.fid = fid;
                    
                    this.sendEvent('web_vitals_fid', {
                        value: fid,
                        threshold: fid < 100 ? 'good' : fid < 300 ? 'needs_improvement' : 'poor'
                    });
                });
            }).observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift
            let clsScore = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                    }
                }
                
                this.performanceMetrics.cls = clsScore;
                this.sendEvent('web_vitals_cls', {
                    value: clsScore,
                    threshold: clsScore < 0.1 ? 'good' : clsScore < 0.25 ? 'needs_improvement' : 'poor'
                });
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    trackResourceTiming() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            const resourceSummary = {
                totalResources: resources.length,
                totalTransferSize: 0,
                slowestResource: null,
                resourceTypes: {}
            };
            
            resources.forEach(resource => {
                resourceSummary.totalTransferSize += resource.transferSize || 0;
                
                if (!resourceSummary.slowestResource || 
                    resource.duration > resourceSummary.slowestResource.duration) {
                    resourceSummary.slowestResource = {
                        name: resource.name,
                        duration: resource.duration,
                        size: resource.transferSize
                    };
                }
                
                const type = this.getResourceType(resource.name);
                resourceSummary.resourceTypes[type] = (resourceSummary.resourceTypes[type] || 0) + 1;
            });
            
            this.sendEvent('resource_timing', resourceSummary);
        });
    }

    getResourceType(url) {
        if (url.match(/\.(css)$/i)) return 'css';
        if (url.match(/\.(js)$/i)) return 'javascript';
        if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) return 'image';
        if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
        return 'other';
    }

    trackJavaScriptErrors() {
        window.addEventListener('error', (e) => {
            this.sendEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                column: e.colno,
                stack: e.error?.stack?.substring(0, 500),
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: Date.now()
            });
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.sendEvent('promise_rejection', {
                reason: e.reason?.toString().substring(0, 500),
                url: window.location.href,
                timestamp: Date.now()
            });
        });
    }

    trackNetworkInfo() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.sendEvent('network_info', {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            });
        }
    }

    // ===== CONVERSION TRACKING =====
    setupConversionTracking() {
        console.log('🎯 Conversion tracking aktifleştiriliyor...');
        
        // Define conversion funnels
        this.setupConversionFunnels();
        
        // Track micro-conversions
        this.trackMicroConversions();
        
        // Track macro-conversions
        this.trackMacroConversions();
    }

    setupConversionFunnels() {
        this.conversionFunnels.set('product_purchase', [
            'page_view',
            'product_view',
            'add_to_cart',
            'checkout_start',
            'purchase'
        ]);
        
        this.conversionFunnels.set('newsletter_signup', [
            'page_view',
            'newsletter_form_view',
            'newsletter_form_start',
            'newsletter_signup'
        ]);
        
        this.conversionFunnels.set('contact_form', [
            'page_view',
            'contact_page_view',
            'contact_form_start',
            'contact_form_submit'
        ]);
    }

    trackMicroConversions() {
        // Email signup
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.addEventListener('focus', () => {
                this.sendEvent('newsletter_form_start', {
                    timestamp: Date.now(),
                    formId: input.form?.id
                });
            });
        });
        
        // Product interest
        document.querySelectorAll('.web-product-card').forEach(card => {
            card.addEventListener('click', () => {
                this.sendEvent('product_interest', {
                    productId: card.dataset.productId,
                    productName: card.querySelector('.web-product-title')?.textContent,
                    timestamp: Date.now()
                });
            });
        });
        
        // Social sharing
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sendEvent('social_share', {
                    platform: btn.className.match(/share-(\w+)/)?.[1],
                    url: window.location.href,
                    timestamp: Date.now()
                });
            });
        });
    }

    trackMacroConversions() {
        // Purchase completion
        if (window.location.pathname.includes('thank-you') || 
            window.location.search.includes('purchase=success')) {
            this.sendEvent('purchase_complete', {
                timestamp: Date.now(),
                url: window.location.href,
                referrer: document.referrer
            });
        }
        
        // Contact form submission
        document.querySelectorAll('form[action*="contact"]').forEach(form => {
            form.addEventListener('submit', () => {
                this.sendEvent('contact_form_submit', {
                    timestamp: Date.now(),
                    formId: form.id
                });
            });
        });
    }

    // ===== HEATMAP TRACKING =====
    setupHeatmapTracking() {
        console.log('🔥 Heatmap tracking aktifleştiriliyor...');
        
        // Click heatmap
        this.setupClickHeatmap();
        
        // Scroll heatmap
        this.setupScrollHeatmap();
        
        // Attention heatmap
        this.setupAttentionHeatmap();
    }

    setupClickHeatmap() {
        document.addEventListener('click', (e) => {
            const heatmapPoint = {
                type: 'click',
                x: e.clientX,
                y: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                element: e.target.tagName,
                timestamp: Date.now(),
                url: window.location.href
            };
            
            this.heatmapData.push(heatmapPoint);
            
            // Send batch updates
            if (this.heatmapData.length % 50 === 0) {
                this.sendHeatmapBatch();
            }
        });
    }

    setupScrollHeatmap() {
        let scrollHeatmapData = [];
        
        window.addEventListener('scroll', () => {
            const scrollPoint = {
                type: 'scroll',
                scrollY: window.scrollY,
                viewportHeight: window.innerHeight,
                documentHeight: document.documentElement.scrollHeight,
                timestamp: Date.now()
            };
            
            scrollHeatmapData.push(scrollPoint);
            
            // Limit data size
            if (scrollHeatmapData.length > 100) {
                scrollHeatmapData = scrollHeatmapData.slice(-50);
            }
        }, { passive: true });
        
        // Send scroll heatmap data on page unload
        window.addEventListener('beforeunload', () => {
            if (scrollHeatmapData.length > 0) {
                this.sendEvent('scroll_heatmap', {
                    data: scrollHeatmapData,
                    url: window.location.href
                });
            }
        });
    }

    setupAttentionHeatmap() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const attentionData = {
                        type: 'attention',
                        element: entry.target.tagName,
                        id: entry.target.id,
                        className: entry.target.className,
                        intersectionRatio: entry.intersectionRatio,
                        timestamp: Date.now()
                    };
                    
                    this.heatmapData.push(attentionData);
                }
            });
        }, { threshold: [0.1, 0.5, 0.9] });
        
        // Observe important elements
        document.querySelectorAll('.web-card, .web-product-card, .web-btn, h1, h2, h3').forEach(el => {
            observer.observe(el);
        });
    }

    sendHeatmapBatch() {
        if (this.heatmapData.length === 0) return;
        
        this.sendEvent('heatmap_batch', {
            data: this.heatmapData.slice(-50),
            url: window.location.href,
            sessionId: this.sessionData.sessionId
        });
        
        // Keep only recent data
        this.heatmapData = this.heatmapData.slice(-25);
    }

    // ===== A/B TESTING FRAMEWORK =====
    setupA_BTestingFramework() {
        console.log('🧪 A/B Testing framework aktifleştiriliyor...');
        
        // Load user's test assignments
        this.loadTestAssignments();
        
        // Apply active tests
        this.applyActiveTests();
        
        // Track test interactions
        this.trackTestInteractions();
    }

    loadTestAssignments() {
        this.testAssignments = JSON.parse(localStorage.getItem('ab_test_assignments') || '{}');
        
        // Example test definitions
        const availableTests = {
            'hero_button_color': {
                variants: ['blue', 'green', 'red'],
                traffic: 0.5, // 50% of users
                selector: '.web-btn-primary'
            },
            'product_card_layout': {
                variants: ['grid', 'list'],
                traffic: 0.3,
                selector: '.web-products-grid'
            }
        };
        
        // Assign tests to new users
        Object.entries(availableTests).forEach(([testName, test]) => {
            if (!(testName in this.testAssignments) && Math.random() < test.traffic) {
                const variant = test.variants[Math.floor(Math.random() * test.variants.length)];
                this.testAssignments[testName] = variant;
            }
        });
        
        localStorage.setItem('ab_test_assignments', JSON.stringify(this.testAssignments));
    }

    applyActiveTests() {
        Object.entries(this.testAssignments).forEach(([testName, variant]) => {
            this.sendEvent('ab_test_assignment', {
                testName,
                variant,
                timestamp: Date.now()
            });
            
            // Apply test variants
            switch (testName) {
                case 'hero_button_color':
                    this.applyButtonColorTest(variant);
                    break;
                case 'product_card_layout':
                    this.applyCardLayoutTest(variant);
                    break;
            }
        });
    }

    applyButtonColorTest(variant) {
        const buttons = document.querySelectorAll('.web-btn-primary');
        buttons.forEach(button => {
            button.setAttribute('data-test-variant', variant);
            switch (variant) {
                case 'green':
                    button.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                    break;
                case 'red':
                    button.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                    break;
                // blue is default
            }
        });
    }

    applyCardLayoutTest(variant) {
        const grid = document.querySelector('.web-products-grid');
        if (grid) {
            grid.setAttribute('data-test-variant', variant);
            if (variant === 'list') {
                grid.style.gridTemplateColumns = '1fr';
                grid.querySelectorAll('.web-product-card').forEach(card => {
                    card.style.display = 'flex';
                    card.style.flexDirection = 'row';
                });
            }
        }
    }

    trackTestInteractions() {
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-test-variant')) {
                const testName = this.getTestNameFromElement(e.target);
                const variant = e.target.getAttribute('data-test-variant');
                
                this.sendEvent('ab_test_interaction', {
                    testName,
                    variant,
                    element: e.target.tagName,
                    action: 'click',
                    timestamp: Date.now()
                });
            }
        });
    }

    getTestNameFromElement(element) {
        if (element.matches('.web-btn-primary')) return 'hero_button_color';
        if (element.closest('.web-products-grid')) return 'product_card_layout';
        return 'unknown';
    }

    // ===== DATA MANAGEMENT =====
    saveSessionData() {
        localStorage.setItem('desktop_session_data', JSON.stringify(this.sessionData));
    }

    trackSessionEnd() {
        const sessionEndData = {
            ...this.sessionData,
            endTime: Date.now(),
            totalTime: Date.now() - this.sessionData.startTime,
            finalScrollDepth: this.userBehavior.scrollDepth,
            totalClicks: this.userBehavior.clicks.length,
            totalInteractions: this.userBehavior.interactions.length
        };
        
        this.sendEvent('session_end', sessionEndData);
    }

    sendEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            timestamp: Date.now(),
            sessionId: this.sessionData.sessionId,
            userId: this.sessionData.userId,
            url: window.location.href,
            platform: 'desktop',
            ...data
        };
        
        // Console logging
        console.log(`📊 Analytics Event: ${eventName}`, eventData);
        
        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Send to custom analytics endpoint
        this.sendToCustomEndpoint(eventData);
        
        // Store locally for offline sync
        this.storeEventLocally(eventData);
    }

    sendToCustomEndpoint(eventData) {
        // Send to your analytics server
        fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData)
        }).catch(error => {
            console.warn('Analytics endpoint error:', error);
        });
    }

    storeEventLocally(eventData) {
        const localEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        localEvents.push(eventData);
        
        // Keep only last 100 events
        if (localEvents.length > 100) {
            localEvents.splice(0, localEvents.length - 100);
        }
        
        localStorage.setItem('analytics_events', JSON.stringify(localEvents));
    }

    // ===== PRIVACY COMPLIANCE =====
    setupPrivacyCompliance() {
        console.log('🔒 Privacy compliance aktifleştiriliyor...');
        
        // Check for consent
        if (!this.hasAnalyticsConsent()) {
            this.showConsentBanner();
            return;
        }
        
        // Data retention policy
        this.cleanupOldData();
    }

    hasAnalyticsConsent() {
        return localStorage.getItem('analytics_consent') === 'granted';
    }

    showConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'analytics-consent-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #1f2937;
            color: white;
            padding: 1rem;
            z-index: 10000;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        banner.innerHTML = `
            <div>
                <p>Bu site analitik ve performans iyileştirmeleri için çerezler kullanır.</p>
            </div>
            <div>
                <button id="accept-analytics" style="background: #4f46e5; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; margin-right: 0.5rem;">Kabul Et</button>
                <button id="decline-analytics" style="background: transparent; color: white; border: 1px solid white; padding: 0.5rem 1rem; border-radius: 0.25rem;">Reddet</button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        document.getElementById('accept-analytics').addEventListener('click', () => {
            localStorage.setItem('analytics_consent', 'granted');
            banner.remove();
            this.init(); // Restart analytics
        });
        
        document.getElementById('decline-analytics').addEventListener('click', () => {
            localStorage.setItem('analytics_consent', 'denied');
            banner.remove();
        });
    }

    cleanupOldData() {
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        const cutoffTime = Date.now() - maxAge;
        
        // Clean old events
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        const recentEvents = events.filter(event => event.timestamp > cutoffTime);
        localStorage.setItem('analytics_events', JSON.stringify(recentEvents));
        
        // Clean old session data
        const sessionData = JSON.parse(localStorage.getItem('desktop_session_data') || '{}');
        if (sessionData.startTime && sessionData.startTime < cutoffTime) {
            localStorage.removeItem('desktop_session_data');
        }
    }

    // ===== PUBLIC API =====
    getSessionData() {
        return this.sessionData;
    }

    getUserBehavior() {
        return this.userBehavior;
    }

    getPerformanceMetrics() {
        return this.performanceMetrics;
    }

    getTestAssignments() {
        return this.testAssignments;
    }

    trackCustomEvent(eventName, data = {}) {
        this.sendEvent(eventName, data);
    }

    setUserProperty(key, value) {
        this.sessionData[key] = value;
        this.saveSessionData();
    }
}

// Initialize Desktop Analytics System
document.addEventListener('DOMContentLoaded', () => {
    window.desktopAnalytics = new DesktopAnalytics();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DesktopAnalytics;
}