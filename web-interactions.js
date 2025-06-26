/* ===== ADVANCED DESKTOP INTERACTIONS SYSTEM ===== */
/* Mouse, keyboard, and touch interactions optimized for desktop experience */

class DesktopInteractions {
    constructor() {
        this.isDesktop = window.innerWidth >= 1024;
        this.mousePosition = { x: 0, y: 0 };
        this.lastActivity = Date.now();
        this.shortcuts = new Map();
        this.focusHistory = [];
        
        this.init();
    }

    init() {
        if (!this.isDesktop) return;
        
        console.log('🖱️ Desktop Interactions System başlatılıyor...');
        
        // Core interaction systems
        this.setupAdvancedMouseEffects();
        this.setupKeyboardShortcuts();
        this.setupFocusManagement();
        this.setupHoverAnimations();
        this.setupClickEffects();
        this.setupContextMenu();
        this.setupDragAndDrop();
        this.setupMouseGestures();
        this.setupTooltipSystem();
        this.setupModalInteractions();
        
        console.log('✅ Desktop Interactions System aktif');
    }

    // ===== ADVANCED MOUSE EFFECTS =====
    setupAdvancedMouseEffects() {
        console.log('🎨 Advanced mouse effects aktifleştiriliyor...');
        
        // Magnetic cursor effects
        this.setupMagneticEffects();
        
        // Mouse trail effect
        this.setupMouseTrail();
        
        // Parallax mouse movement
        this.setupMouseParallax();
        
        // Cursor customization
        this.setupCustomCursor();
    }

    setupMagneticEffects() {
        document.querySelectorAll('.web-btn, .web-card, .magnetic').forEach(element => {
            const strength = element.dataset.magnetic || 0.3;
            
            element.addEventListener('mouseenter', (e) => {
                e.target.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.320, 1)';
                e.target.classList.add('magnetic-active');
            });
            
            element.addEventListener('mousemove', (e) => {
                const rect = e.target.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) * strength;
                const deltaY = (e.clientY - centerY) * strength;
                
                e.target.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px)`;
                
                // Glow effect based on distance
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const glowIntensity = Math.max(0, 1 - distance / 50);
                e.target.style.boxShadow = `0 0 ${glowIntensity * 20}px rgba(79, 70, 229, ${glowIntensity * 0.3})`;
            });
            
            element.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateX(0) translateY(0)';
                e.target.style.boxShadow = '';
                e.target.classList.remove('magnetic-active');
            });
        });
    }

    setupMouseTrail() {
        const trail = [];
        const trailLength = 10;
        
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'mouse-trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: ${8 - i * 0.5}px;
                height: ${8 - i * 0.5}px;
                background: rgba(79, 70, 229, ${1 - i * 0.1});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }
        
        let mouseActive = false;
        
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            mouseActive = true;
            
            // Update trail positions
            trail.forEach((dot, index) => {
                setTimeout(() => {
                    dot.style.left = (e.clientX - dot.offsetWidth / 2) + 'px';
                    dot.style.top = (e.clientY - dot.offsetHeight / 2) + 'px';
                    dot.style.opacity = mouseActive ? 1 : 0;
                }, index * 20);
            });
        });
        
        // Hide trail when mouse leaves window
        document.addEventListener('mouseleave', () => {
            mouseActive = false;
            trail.forEach(dot => dot.style.opacity = 0);
        });
    }

    setupMouseParallax() {
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        
        const updateParallax = () => {
            targetX += (mouseX - targetX) * 0.1;
            targetY += (mouseY - targetY) * 0.1;
            
            document.querySelectorAll('[data-parallax-mouse]').forEach(element => {
                const speed = parseFloat(element.dataset.parallaxMouse) || 50;
                const x = targetX * speed / window.innerWidth;
                const y = targetY * speed / window.innerHeight;
                
                element.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
            
            requestAnimationFrame(updateParallax);
        };
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX - window.innerWidth / 2;
            mouseY = e.clientY - window.innerHeight / 2;
        });
        
        updateParallax();
    }

    setupCustomCursor() {
        // Create custom cursor
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--web-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.2s ease;
        `;
        document.body.appendChild(cursor);
        
        const cursorDot = document.createElement('div');
        cursorDot.className = 'custom-cursor-dot';
        cursorDot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--web-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
        `;
        document.body.appendChild(cursorDot);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = (e.clientX - 10) + 'px';
            cursor.style.top = (e.clientY - 10) + 'px';
            cursorDot.style.left = (e.clientX - 2) + 'px';
            cursorDot.style.top = (e.clientY - 2) + 'px';
        });
        
        // Cursor states
        document.querySelectorAll('a, button, .clickable').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'rgba(79, 70, 229, 0.1)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'transparent';
            });
        });
    }

    // ===== KEYBOARD SHORTCUTS SYSTEM =====
    setupKeyboardShortcuts() {
        console.log('⌨️ Keyboard shortcuts system aktifleştiriliyor...');
        
        // Register default shortcuts
        this.registerShortcut('alt+h', () => window.location.href = '/');
        this.registerShortcut('alt+c', () => this.scrollToElement('#contact'));
        this.registerShortcut('alt+p', () => this.scrollToElement('#products'));
        this.registerShortcut('alt+s', () => this.focusSearchInput());
        this.registerShortcut('escape', () => this.closeModals());
        this.registerShortcut('ctrl+k', (e) => { e.preventDefault(); this.openCommandPalette(); });
        this.registerShortcut('/', (e) => { e.preventDefault(); this.focusSearchInput(); });
        
        // Tab navigation enhancement
        this.setupTabNavigation();
        
        // Arrow key navigation
        this.setupArrowNavigation();
    }

    registerShortcut(combination, callback) {
        this.shortcuts.set(combination.toLowerCase(), callback);
    }

    setupTabNavigation() {
        let tabIndex = 0;
        const tabbableElements = this.getTabbableElements();
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
                
                if (e.shiftKey) {
                    tabIndex = Math.max(0, tabIndex - 1);
                } else {
                    tabIndex = Math.min(tabbableElements.length - 1, tabIndex + 1);
                }
                
                // Visual focus indicator
                this.updateFocusIndicator(tabbableElements[tabIndex]);
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('user-is-tabbing');
        });
    }

    setupArrowNavigation() {
        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            
            // Grid navigation for card layouts
            if (activeElement.closest('.web-grid')) {
                this.handleGridNavigation(e, activeElement);
            }
            
            // Menu navigation
            if (activeElement.closest('.web-nav')) {
                this.handleMenuNavigation(e, activeElement);
            }
        });
    }

    handleGridNavigation(e, activeElement) {
        const grid = activeElement.closest('.web-grid');
        const items = Array.from(grid.querySelectorAll('.web-card, .web-product-card'));
        const currentIndex = items.indexOf(activeElement);
        const columns = Math.floor(grid.offsetWidth / items[0].offsetWidth);
        
        let newIndex = currentIndex;
        
        switch (e.key) {
            case 'ArrowRight':
                newIndex = Math.min(items.length - 1, currentIndex + 1);
                break;
            case 'ArrowLeft':
                newIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowDown':
                newIndex = Math.min(items.length - 1, currentIndex + columns);
                break;
            case 'ArrowUp':
                newIndex = Math.max(0, currentIndex - columns);
                break;
        }
        
        if (newIndex !== currentIndex) {
            e.preventDefault();
            items[newIndex].focus();
        }
    }

    handleMenuNavigation(e, activeElement) {
        const menu = activeElement.closest('.web-nav');
        const items = Array.from(menu.querySelectorAll('.web-nav-link'));
        const currentIndex = items.indexOf(activeElement);
        
        let newIndex = currentIndex;
        
        switch (e.key) {
            case 'ArrowRight':
                newIndex = (currentIndex + 1) % items.length;
                break;
            case 'ArrowLeft':
                newIndex = (currentIndex - 1 + items.length) % items.length;
                break;
        }
        
        if (newIndex !== currentIndex) {
            e.preventDefault();
            items[newIndex].focus();
        }
    }

    // ===== FOCUS MANAGEMENT =====
    setupFocusManagement() {
        console.log('🎯 Focus management system aktifleştiriliyor...');
        
        // Focus trap for modals
        this.setupFocusTrap();
        
        // Focus history tracking
        this.setupFocusHistory();
        
        // Skip links for accessibility
        this.setupSkipLinks();
    }

    setupFocusTrap() {
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.modal:not([style*="display: none"])');
            if (!modal) return;
            
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    setupFocusHistory() {
        document.addEventListener('focusin', (e) => {
            this.focusHistory.push(e.target);
            if (this.focusHistory.length > 10) {
                this.focusHistory.shift();
            }
        });
    }

    setupSkipLinks() {
        const skipLinks = [
            { text: 'Ana içeriğe atla', href: '#main-content' },
            { text: 'Navigasyona atla', href: '#navigation' },
            { text: 'Alt bilgiye atla', href: '#footer' }
        ];
        
        const skipContainer = document.createElement('div');
        skipContainer.className = 'skip-links';
        skipContainer.style.cssText = `
            position: absolute;
            top: -100px;
            left: 0;
            z-index: 1001;
            display: flex;
            gap: 1rem;
            padding: 1rem;
        `;
        
        skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = link.href;
            skipLink.textContent = link.text;
            skipLink.style.cssText = `
                background: var(--web-primary);
                color: white;
                padding: 0.5rem 1rem;
                text-decoration: none;
                border-radius: 4px;
                transition: top 0.3s;
            `;
            
            skipLink.addEventListener('focus', () => {
                skipContainer.style.top = '0';
            });
            
            skipLink.addEventListener('blur', () => {
                skipContainer.style.top = '-100px';
            });
            
            skipContainer.appendChild(skipLink);
        });
        
        document.body.insertBefore(skipContainer, document.body.firstChild);
    }

    // ===== HOVER ANIMATIONS =====
    setupHoverAnimations() {
        console.log('✨ Hover animations aktifleştiriliyor...');
        
        // Card hover effects
        this.setupCardHoverEffects();
        
        // Button hover effects
        this.setupButtonHoverEffects();
        
        // Image hover effects
        this.setupImageHoverEffects();
    }

    setupCardHoverEffects() {
        document.querySelectorAll('.web-card, .web-product-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const card = e.target;
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.transform = 'translateY(-8px) scale(1.02)';
                
                // Glow effect
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(79, 70, 229, 0.2)';
                
                // Inner elements animation
                const image = card.querySelector('img');
                if (image) {
                    image.style.transform = 'scale(1.1)';
                }
            });
            
            card.addEventListener('mouseleave', (e) => {
                const card = e.target;
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
                
                const image = card.querySelector('img');
                if (image) {
                    image.style.transform = 'scale(1)';
                }
            });
        });
    }

    setupButtonHoverEffects() {
        document.querySelectorAll('.web-btn').forEach(btn => {
            // Ripple effect on click
            btn.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                btn.style.position = 'relative';
                btn.style.overflow = 'hidden';
                btn.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupImageHoverEffects() {
        document.querySelectorAll('.web-hero-image, .web-product-image img').forEach(img => {
            img.addEventListener('mouseenter', (e) => {
                e.target.style.filter = 'brightness(1.1) saturate(1.2)';
            });
            
            img.addEventListener('mouseleave', (e) => {
                e.target.style.filter = 'brightness(1) saturate(1)';
            });
        });
    }

    // ===== CLICK EFFECTS =====
    setupClickEffects() {
        console.log('👆 Click effects aktifleştiriliyor...');
        
        // Global click tracking
        document.addEventListener('click', (e) => {
            this.createClickEffect(e);
            this.logInteraction('click', e.target);
        });
        
        // Double-click effects
        document.addEventListener('dblclick', (e) => {
            this.createDoubleClickEffect(e);
            this.logInteraction('doubleclick', e.target);
        });
    }

    createClickEffect(e) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--web-primary);
            border-radius: 50%;
            left: ${e.clientX - 10}px;
            top: ${e.clientY - 10}px;
            pointer-events: none;
            z-index: 9999;
            animation: clickEffect 0.3s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 300);
    }

    createDoubleClickEffect(e) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            border: 3px solid var(--web-secondary);
            border-radius: 50%;
            left: ${e.clientX - 20}px;
            top: ${e.clientY - 20}px;
            pointer-events: none;
            z-index: 9999;
            animation: doubleClickEffect 0.5s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 500);
    }

    // ===== UTILITY METHODS =====
    getTabbableElements() {
        return Array.from(document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.disabled && el.offsetParent !== null);
    }

    updateFocusIndicator(element) {
        document.querySelectorAll('.focus-indicator').forEach(el => el.remove());
        
        if (element) {
            const indicator = document.createElement('div');
            indicator.className = 'focus-indicator';
            const rect = element.getBoundingClientRect();
            
            indicator.style.cssText = `
                position: fixed;
                left: ${rect.left - 2}px;
                top: ${rect.top - 2}px;
                width: ${rect.width + 4}px;
                height: ${rect.height + 4}px;
                border: 2px solid var(--web-primary);
                border-radius: 4px;
                pointer-events: none;
                z-index: 9999;
                animation: focusIndicator 0.3s ease;
            `;
            
            document.body.appendChild(indicator);
        }
    }

    scrollToElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    focusSearchInput() {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="ara"]');
        if (searchInput) {
            searchInput.focus();
        }
    }

    closeModals() {
        document.querySelectorAll('.modal, .overlay').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    openCommandPalette() {
        // Command palette implementation
        console.log('🎮 Command palette açılıyor...');
        // This would open a command palette interface
    }

    logInteraction(type, element) {
        const interactionData = {
            type,
            element: element.tagName,
            className: element.className,
            id: element.id,
            timestamp: Date.now()
        };
        
        console.log(`🖱️ Interaction: ${type}`, interactionData);
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'desktop_interaction', interactionData);
        }
    }

    // Public API
    getMousePosition() {
        return this.mousePosition;
    }

    getLastActivity() {
        return this.lastActivity;
    }

    registerCustomShortcut(combination, callback) {
        this.registerShortcut(combination, callback);
    }
}

// Add required CSS animations
const interactionStyles = document.createElement('style');
interactionStyles.textContent = `
    @keyframes clickEffect {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes doubleClickEffect {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.7; }
        100% { transform: scale(3); opacity: 0; }
    }
    
    @keyframes focusIndicator {
        0% { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    .user-is-tabbing *:focus {
        outline: 3px solid var(--web-primary) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(interactionStyles);

// Initialize Desktop Interactions System
document.addEventListener('DOMContentLoaded', () => {
    window.desktopInteractions = new DesktopInteractions();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DesktopInteractions;
}