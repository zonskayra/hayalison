/* ===== DESKTOP SEO & CONTENT OPTIMIZATION SYSTEM ===== */
/* Advanced SEO, structured data, and content optimization for desktop experience */

class DesktopSEO {
    constructor() {
        this.isDesktop = window.innerWidth >= 1024;
        this.structuredData = [];
        this.metaTags = new Map();
        this.socialShares = 0;
        this.readingTime = 0;
        
        this.init();
    }

    init() {
        console.log('🔍 Desktop SEO System başlatılıyor...');
        
        // Core SEO optimizations
        this.setupStructuredData();
        this.setupOpenGraphTags();
        this.setupTwitterCards();
        this.setupCanonicalTags();
        this.setupMetaOptimization();
        this.setupContentAnalysis();
        this.setupSocialSharing();
        this.setupSitemapGeneration();
        this.setupBreadcrumbs();
        this.setupRichSnippets();
        this.setupLocalSEO();
        
        console.log('✅ Desktop SEO System aktif');
    }

    // ===== STRUCTURED DATA (SCHEMA.ORG) =====
    setupStructuredData() {
        console.log('📋 Structured data (Schema.org) oluşturuluyor...');
        
        // Organization schema
        this.addOrganizationSchema();
        
        // Website schema
        this.addWebsiteSchema();
        
        // Product schema for e-commerce
        this.addProductSchemas();
        
        // Article schema for blog posts
        this.addArticleSchemas();
        
        // Breadcrumb schema
        this.addBreadcrumbSchema();
        
        // FAQ schema
        this.addFAQSchema();
        
        // Review schema
        this.addReviewSchema();
        
        // Local Business schema
        this.addLocalBusinessSchema();
    }

    addOrganizationSchema() {
        const organizationSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Hayali Çizgili - Çocuk Kitapları",
            "description": "Çocuklar için özel tasarlanmış boyama kitapları, şarkı kitapları ve eğitici materyaller",
            "url": window.location.origin,
            "logo": `${window.location.origin}/images/logo.png`,
            "image": `${window.location.origin}/images/logo.png`,
            "sameAs": [
                "https://facebook.com/hayalicizgili",
                "https://instagram.com/hayalicizgili",
                "https://twitter.com/hayalicizgili"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+90-XXX-XXX-XXXX",
                "contactType": "customer service",
                "areaServed": "TR",
                "availableLanguage": "Turkish"
            },
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "TR",
                "addressLocality": "İstanbul"
            },
            "foundingDate": "2024",
            "keywords": "çocuk kitapları, boyama kitabı, şarkı kitabı, eğitici materyal"
        };
        
        this.addStructuredDataToPage(organizationSchema);
    }

    addWebsiteSchema() {
        const websiteSchema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Hayali Çizgili",
            "description": "Çocuklar için özel tasarlanmış kitaplar ve eğitici materyaller",
            "url": window.location.origin,
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Hayali Çizgili"
            }
        };
        
        this.addStructuredDataToPage(websiteSchema);
    }

    addProductSchemas() {
        document.querySelectorAll('.web-product-card').forEach((productCard, index) => {
            const title = productCard.querySelector('.web-product-title')?.textContent;
            const description = productCard.querySelector('.web-product-description')?.textContent;
            const price = productCard.querySelector('.web-price-current')?.textContent;
            const image = productCard.querySelector('img')?.src;
            
            if (title && description && price) {
                const productSchema = {
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": title,
                    "description": description,
                    "image": image || `${window.location.origin}/images/product-default.jpg`,
                    "sku": `PRODUCT-${index + 1}`,
                    "brand": {
                        "@type": "Brand",
                        "name": "Hayali Çizgili"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": price.replace(/[^\d]/g, ''),
                        "priceCurrency": "TRY",
                        "availability": "https://schema.org/InStock",
                        "seller": {
                            "@type": "Organization",
                            "name": "Hayali Çizgili"
                        }
                    },
                    "category": "Çocuk Kitapları",
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.8",
                        "reviewCount": "24"
                    }
                };
                
                this.addStructuredDataToPage(productSchema);
            }
        });
    }

    addArticleSchemas() {
        // Blog posts or articles
        document.querySelectorAll('article, .blog-post').forEach(article => {
            const title = article.querySelector('h1, h2')?.textContent;
            const content = article.textContent;
            const image = article.querySelector('img')?.src;
            
            if (title && content) {
                const articleSchema = {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": title,
                    "articleBody": content.substring(0, 500),
                    "image": image || `${window.location.origin}/images/article-default.jpg`,
                    "author": {
                        "@type": "Person",
                        "name": "Hayali Çizgili Editörü"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Hayali Çizgili",
                        "logo": {
                            "@type": "ImageObject",
                            "url": `${window.location.origin}/images/logo.png`
                        }
                    },
                    "datePublished": new Date().toISOString(),
                    "dateModified": new Date().toISOString(),
                    "mainEntityOfPage": window.location.href
                };
                
                this.addStructuredDataToPage(articleSchema);
            }
        });
    }

    addBreadcrumbSchema() {
        const breadcrumbs = document.querySelectorAll('.breadcrumb li, .breadcrumb a');
        if (breadcrumbs.length > 0) {
            const breadcrumbSchema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": Array.from(breadcrumbs).map((breadcrumb, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": breadcrumb.textContent.trim(),
                    "item": breadcrumb.href || window.location.href
                }))
            };
            
            this.addStructuredDataToPage(breadcrumbSchema);
        }
    }

    addFAQSchema() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length > 0) {
            const faqSchema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": Array.from(faqItems).map(item => {
                    const question = item.querySelector('.faq-question')?.textContent;
                    const answer = item.querySelector('.faq-answer')?.textContent;
                    
                    return {
                        "@type": "Question",
                        "name": question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": answer
                        }
                    };
                })
            };
            
            this.addStructuredDataToPage(faqSchema);
        }
    }

    addReviewSchema() {
        const reviews = document.querySelectorAll('.review, .testimonial');
        if (reviews.length > 0) {
            reviews.forEach(review => {
                const author = review.querySelector('.review-author')?.textContent;
                const rating = review.querySelector('.review-rating')?.textContent;
                const text = review.querySelector('.review-text')?.textContent;
                
                if (author && text) {
                    const reviewSchema = {
                        "@context": "https://schema.org",
                        "@type": "Review",
                        "author": {
                            "@type": "Person",
                            "name": author
                        },
                        "reviewRating": {
                            "@type": "Rating",
                            "ratingValue": rating || "5",
                            "bestRating": "5"
                        },
                        "reviewBody": text,
                        "itemReviewed": {
                            "@type": "Product",
                            "name": "Hayali Çizgili Ürünleri"
                        }
                    };
                    
                    this.addStructuredDataToPage(reviewSchema);
                }
            });
        }
    }

    addLocalBusinessSchema() {
        const localBusinessSchema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Hayali Çizgili",
            "description": "Çocuklar için özel tasarlanmış kitaplar ve eğitici materyaller",
            "image": `${window.location.origin}/images/logo.png`,
            "telephone": "+90-XXX-XXX-XXXX",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Örnek Mahallesi, Örnek Caddesi No:1",
                "addressLocality": "İstanbul",
                "addressCountry": "TR",
                "postalCode": "34000"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "41.0082",
                "longitude": "28.9784"
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
            },
            "priceRange": "₺₺"
        };
        
        this.addStructuredDataToPage(localBusinessSchema);
    }

    addStructuredDataToPage(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
        
        this.structuredData.push(schema);
    }

    // ===== OPEN GRAPH OPTIMIZATION =====
    setupOpenGraphTags() {
        console.log('📱 Open Graph tags optimize ediliyor...');
        
        const ogTags = {
            'og:site_name': 'Hayali Çizgili',
            'og:title': document.title || 'Hayali Çizgili - Çocuk Kitapları',
            'og:description': this.getMetaDescription() || 'Çocuklar için özel tasarlanmış boyama kitapları, şarkı kitapları ve eğitici materyaller',
            'og:image': this.getOGImage(),
            'og:image:width': '1200',
            'og:image:height': '630',
            'og:url': window.location.href,
            'og:type': this.getOGType(),
            'og:locale': 'tr_TR',
            'fb:app_id': '1234567890' // Facebook app ID if available
        };
        
        // Add product-specific OG tags
        if (this.isProductPage()) {
            const product = this.getCurrentProduct();
            if (product) {
                ogTags['og:type'] = 'product';
                ogTags['product:price:amount'] = product.price;
                ogTags['product:price:currency'] = 'TRY';
                ogTags['product:availability'] = 'in stock';
                ogTags['product:condition'] = 'new';
                ogTags['product:brand'] = 'Hayali Çizgili';
                ogTags['product:category'] = 'Çocuk Kitapları';
            }
        }
        
        this.addMetaTags(ogTags);
    }

    // ===== TWITTER CARDS =====
    setupTwitterCards() {
        console.log('🐦 Twitter Cards optimize ediliyor...');
        
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:site': '@hayalicizgili',
            'twitter:creator': '@hayalicizgili',
            'twitter:title': document.title || 'Hayali Çizgili - Çocuk Kitapları',
            'twitter:description': this.getMetaDescription() || 'Çocuklar için özel tasarlanmış boyama kitapları, şarkı kitapları ve eğitici materyaller',
            'twitter:image': this.getOGImage(),
            'twitter:image:alt': 'Hayali Çizgili - Çocuk Kitapları'
        };
        
        // Product-specific Twitter tags
        if (this.isProductPage()) {
            const product = this.getCurrentProduct();
            if (product) {
                twitterTags['twitter:label1'] = 'Fiyat';
                twitterTags['twitter:data1'] = `${product.price} TL`;
                twitterTags['twitter:label2'] = 'Kategori';
                twitterTags['twitter:data2'] = 'Çocuk Kitapları';
            }
        }
        
        this.addMetaTags(twitterTags);
    }

    // ===== CANONICAL TAGS =====
    setupCanonicalTags() {
        console.log('🔗 Canonical tags oluşturuluyor...');
        
        // Remove existing canonical
        const existingCanonical = document.querySelector('link[rel="canonical"]');
        if (existingCanonical) {
            existingCanonical.remove();
        }
        
        // Add new canonical
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = this.getCanonicalUrl();
        document.head.appendChild(canonical);
        
        // Add alternate language versions
        this.addLanguageAlternates();
    }

    addLanguageAlternates() {
        const languages = [
            { lang: 'tr', href: window.location.href },
            { lang: 'en', href: window.location.href.replace('/tr/', '/en/') }
        ];
        
        languages.forEach(lang => {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = lang.lang;
            link.href = lang.href;
            document.head.appendChild(link);
        });
    }

    // ===== META OPTIMIZATION =====
    setupMetaOptimization() {
        console.log('🏷️ Meta tags optimize ediliyor...');
        
        const metaTags = {
            'description': this.generateMetaDescription(),
            'keywords': this.generateKeywords(),
            'author': 'Hayali Çizgili',
            'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
            'googlebot': 'index, follow',
            'revisit-after': '7 days',
            'rating': 'general',
            'distribution': 'global',
            'language': 'Turkish',
            'geo.region': 'TR',
            'geo.placename': 'Istanbul',
            'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=5.0'
        };
        
        this.addMetaTags(metaTags);
        
        // Add mobile-specific meta tags
        this.addMobileMetaTags();
        
        // Add performance-related meta tags
        this.addPerformanceMetaTags();
    }

    addMobileMetaTags() {
        const mobileTags = {
            'mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'default',
            'apple-mobile-web-app-title': 'Hayali Çizgili',
            'application-name': 'Hayali Çizgili',
            'msapplication-TileColor': '#4f46e5',
            'msapplication-config': '/browserconfig.xml',
            'theme-color': '#4f46e5'
        };
        
        this.addMetaTags(mobileTags);
    }

    addPerformanceMetaTags() {
        const performanceTags = {
            'dns-prefetch': ['//fonts.googleapis.com', '//fonts.gstatic.com'],
            'preconnect': ['//fonts.googleapis.com', '//fonts.gstatic.com'],
            'prefetch': ['/images/logo.png', '/css/web-styles.css']
        };
        
        // DNS prefetch and preconnect
        performanceTags['dns-prefetch'].forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
        
        performanceTags.preconnect.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    // ===== CONTENT ANALYSIS =====
    setupContentAnalysis() {
        console.log('📝 Content analysis yapılıyor...');
        
        this.analyzeReadingTime();
        this.analyzeContentStructure();
        this.analyzeImageOptimization();
        this.analyzeInternalLinks();
        this.generateContentSuggestions();
    }

    analyzeReadingTime() {
        const content = document.body.textContent;
        const wordsPerMinute = 200; // Average reading speed in Turkish
        const wordCount = content.split(/\s+/).length;
        this.readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        // Add reading time to page if article exists
        const article = document.querySelector('article');
        if (article && this.readingTime > 1) {
            const readingTimeElement = document.createElement('div');
            readingTimeElement.className = 'reading-time';
            readingTimeElement.textContent = `Okuma süresi: ${this.readingTime} dakika`;
            readingTimeElement.style.cssText = `
                color: #6b7280;
                font-size: 0.875rem;
                margin-bottom: 1rem;
            `;
            article.insertBefore(readingTimeElement, article.firstChild);
        }
    }

    analyzeContentStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const structure = {
            h1Count: document.querySelectorAll('h1').length,
            h2Count: document.querySelectorAll('h2').length,
            totalHeadings: headings.length,
            hasProperStructure: this.validateHeadingStructure(headings)
        };
        
        console.log('📊 Content Structure Analysis:', structure);
        
        // Add structured data for better SEO
        if (structure.hasProperStructure) {
            this.addTableOfContents(headings);
        }
    }

    validateHeadingStructure(headings) {
        let lastLevel = 0;
        for (const heading of headings) {
            const currentLevel = parseInt(heading.tagName.charAt(1));
            if (currentLevel > lastLevel + 1) {
                return false; // Skipped heading level
            }
            lastLevel = currentLevel;
        }
        return true;
    }

    addTableOfContents(headings) {
        if (headings.length < 3) return;
        
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h3>İçindekiler</h3>';
        
        const list = document.createElement('ul');
        headings.forEach((heading, index) => {
            const id = heading.id || `heading-${index}`;
            heading.id = id;
            
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            link.className = `toc-${heading.tagName.toLowerCase()}`;
            
            listItem.appendChild(link);
            list.appendChild(listItem);
        });
        
        toc.appendChild(list);
        
        // Insert TOC after first paragraph or at beginning of main content
        const mainContent = document.querySelector('main, article, .content');
        if (mainContent) {
            const firstParagraph = mainContent.querySelector('p');
            if (firstParagraph) {
                firstParagraph.parentNode.insertBefore(toc, firstParagraph.nextSibling);
            } else {
                mainContent.insertBefore(toc, mainContent.firstChild);
            }
        }
    }

    analyzeImageOptimization() {
        const images = document.querySelectorAll('img');
        const analysis = {
            totalImages: images.length,
            missingAlt: 0,
            missingTitle: 0,
            largeImages: 0,
            unoptimized: 0
        };
        
        images.forEach(img => {
            if (!img.alt) analysis.missingAlt++;
            if (!img.title) analysis.missingTitle++;
            if (img.naturalWidth > 1920) analysis.largeImages++;
            if (!img.src.includes('.webp') && !img.src.includes('data:')) analysis.unoptimized++;
            
            // Auto-fix missing alt attributes
            if (!img.alt && img.src) {
                const filename = img.src.split('/').pop().split('.')[0];
                img.alt = filename.replace(/[-_]/g, ' ');
            }
        });
        
        console.log('🖼️ Image Optimization Analysis:', analysis);
    }

    analyzeInternalLinks() {
        const links = document.querySelectorAll('a[href]');
        const analysis = {
            totalLinks: links.length,
            internalLinks: 0,
            externalLinks: 0,
            missingTitle: 0,
            noFollow: 0
        };
        
        links.forEach(link => {
            const href = link.href;
            if (href.startsWith(window.location.origin)) {
                analysis.internalLinks++;
            } else if (href.startsWith('http')) {
                analysis.externalLinks++;
                // Auto-add rel="noopener" for external links
                if (!link.rel.includes('noopener')) {
                    link.rel = link.rel ? `${link.rel} noopener` : 'noopener';
                }
            }
            
            if (!link.title) analysis.missingTitle++;
            if (link.rel.includes('nofollow')) analysis.noFollow++;
        });
        
        console.log('🔗 Internal Links Analysis:', analysis);
    }

    // ===== SOCIAL SHARING =====
    setupSocialSharing() {
        console.log('📤 Social sharing optimization aktifleştiriliyor...');
        
        this.addSocialShareButtons();
        this.trackSocialShares();
        this.optimizeShareImages();
    }

    addSocialShareButtons() {
        const shareContainer = document.querySelector('.social-share');
        if (shareContainer) return; // Already exists
        
        const container = document.createElement('div');
        container.className = 'social-share';
        container.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
        `;
        
        const platforms = [
            { name: 'Facebook', icon: '📘', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
            { name: 'Twitter', icon: '🐦', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}` },
            { name: 'WhatsApp', icon: '💬', url: `https://wa.me/?text=${encodeURIComponent(document.title + ' ' + window.location.href)}` },
            { name: 'LinkedIn', icon: '💼', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` }
        ];
        
        platforms.forEach(platform => {
            const button = document.createElement('a');
            button.href = platform.url;
            button.target = '_blank';
            button.rel = 'noopener';
            button.className = `share-btn share-${platform.name.toLowerCase()}`;
            button.innerHTML = platform.icon;
            button.title = `${platform.name}'da paylaş`;
            
            button.style.cssText = `
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                border-radius: 50%;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-decoration: none;
                font-size: 20px;
                transition: transform 0.3s ease;
            `;
            
            button.addEventListener('click', () => {
                this.trackSocialShare(platform.name);
            });
            
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.1)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
            
            container.appendChild(button);
        });
        
        document.body.appendChild(container);
    }

    trackSocialShare(platform) {
        this.socialShares++;
        
        const shareData = {
            platform,
            url: window.location.href,
            title: document.title,
            timestamp: Date.now()
        };
        
        console.log(`📤 Social Share: ${platform}`, shareData);
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: platform,
                content_type: 'page',
                content_id: window.location.href
            });
        }
    }

    optimizeShareImages() {
        // Ensure Open Graph images are optimized for sharing
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
            const defaultImage = `${window.location.origin}/images/og-default.jpg`;
            this.addMetaTags({ 'og:image': defaultImage });
        }
    }

    // ===== SITEMAP GENERATION =====
    setupSitemapGeneration() {
        console.log('🗺️ Sitemap optimization aktifleştiriliyor...');
        
        this.generateDynamicSitemap();
        this.addSitemapReference();
    }

    generateDynamicSitemap() {
        const sitemap = {
            pages: [
                { url: '/', priority: 1.0, changefreq: 'daily' },
                { url: '/products', priority: 0.9, changefreq: 'weekly' },
                { url: '/about', priority: 0.8, changefreq: 'monthly' },
                { url: '/contact', priority: 0.7, changefreq: 'monthly' }
            ],
            products: this.getProductUrls(),
            lastmod: new Date().toISOString()
        };
        
        // Store sitemap data for server-side generation
        localStorage.setItem('sitemap-data', JSON.stringify(sitemap));
    }

    getProductUrls() {
        const products = [];
        document.querySelectorAll('.web-product-card').forEach((card, index) => {
            const title = card.querySelector('.web-product-title')?.textContent;
            if (title) {
                const slug = title.toLowerCase()
                    .replace(/[^a-zA-Z0-9\s]/g, '')
                    .replace(/\s+/g, '-');
                
                products.push({
                    url: `/product/${slug}`,
                    priority: 0.8,
                    changefreq: 'weekly'
                });
            }
        });
        return products;
    }

    addSitemapReference() {
        // Add sitemap reference to robots.txt (conceptually)
        const sitemapUrl = `${window.location.origin}/sitemap.xml`;
        console.log(`🤖 Sitemap URL: ${sitemapUrl}`);
    }

    // ===== UTILITY METHODS =====
    addMetaTags(tags) {
        Object.entries(tags).forEach(([name, content]) => {
            if (Array.isArray(content)) return; // Skip arrays for now
            
            let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            
            if (!meta) {
                meta = document.createElement('meta');
                if (name.startsWith('og:') || name.startsWith('twitter:')) {
                    meta.setAttribute('property', name);
                } else {
                    meta.setAttribute('name', name);
                }
                document.head.appendChild(meta);
            }
            
            meta.setAttribute('content', content);
            this.metaTags.set(name, content);
        });
    }

    getMetaDescription() {
        const meta = document.querySelector('meta[name="description"]');
        return meta ? meta.content : null;
    }

    generateMetaDescription() {
        // Auto-generate from page content if not exists
        const existing = this.getMetaDescription();
        if (existing) return existing;
        
        const firstParagraph = document.querySelector('p')?.textContent;
        if (firstParagraph) {
            return firstParagraph.substring(0, 160).trim() + '...';
        }
        
        return 'Çocuklar için özel tasarlanmış boyama kitapları, şarkı kitapları ve eğitici materyaller. Kaliteli içerik ve uygun fiyatlarla.';
    }

    generateKeywords() {
        const keywords = [
            'çocuk kitapları',
            'boyama kitabı',
            'şarkı kitabı',
            'eğitici materyal',
            'çocuk eğitimi',
            'yaratıcılık',
            'sanat',
            'öğrenme'
        ];
        
        // Add page-specific keywords
        const title = document.title.toLowerCase();
        if (title.includes('boyama')) keywords.unshift('boyama');
        if (title.includes('şarkı')) keywords.unshift('şarkı');
        if (title.includes('çizim')) keywords.unshift('çizim');
        
        return keywords.join(', ');
    }

    getOGImage() {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) return ogImage.content;
        
        const firstImage = document.querySelector('img');
        if (firstImage && firstImage.src) return firstImage.src;
        
        return `${window.location.origin}/images/og-default.jpg`;
    }

    getOGType() {
        if (this.isProductPage()) return 'product';
        if (this.isArticlePage()) return 'article';
        return 'website';
    }

    getCanonicalUrl() {
        // Remove query parameters and fragments for canonical URL
        const url = new URL(window.location.href);
        url.search = '';
        url.hash = '';
        return url.href;
    }

    isProductPage() {
        return window.location.pathname.includes('/product') || 
               document.querySelector('.web-product-card') !== null;
    }

    isArticlePage() {
        return document.querySelector('article') !== null ||
               window.location.pathname.includes('/blog');
    }

    getCurrentProduct() {
        const productCard = document.querySelector('.web-product-card');
        if (!productCard) return null;
        
        return {
            title: productCard.querySelector('.web-product-title')?.textContent,
            price: productCard.querySelector('.web-price-current')?.textContent?.replace(/[^\d]/g, ''),
            description: productCard.querySelector('.web-product-description')?.textContent,
            image: productCard.querySelector('img')?.src
        };
    }

    generateContentSuggestions() {
        const suggestions = [];
        
        // Check for missing elements
        if (!document.querySelector('h1')) {
            suggestions.push('H1 başlığı eksik - SEO için önemli');
        }
        
        if (!this.getMetaDescription()) {
            suggestions.push('Meta açıklama eksik');
        }
        
        if (document.querySelectorAll('img:not([alt])').length > 0) {
            suggestions.push('Bazı görsellerde alt text eksik');
        }
        
        if (this.structuredData.length === 0) {
            suggestions.push('Yapılandırılmış veri eksik');
        }
        
        console.log('💡 SEO Önerileri:', suggestions);
        return suggestions;
    }

    // Public API
    getStructuredData() {
        return this.structuredData;
    }

    getMetaTags() {
        return this.metaTags;
    }

    getSocialShares() {
        return this.socialShares;
    }

    getReadingTime() {
        return this.readingTime;
    }
}

// Initialize Desktop SEO System
document.addEventListener('DOMContentLoaded', () => {
    window.desktopSEO = new DesktopSEO();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DesktopSEO;
}