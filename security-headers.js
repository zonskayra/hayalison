// Security Headers and Content Security Policy Configuration
// Bu dosya production sunucusunda güvenlik başlıklarını ayarlamak için kullanılır

const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://cdnjs.cloudflare.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
        "img-src 'self' data: https: blob:",
        "media-src 'self' blob:",
        "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.whatsapp.com",
        "frame-src 'self' https://www.google.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://wa.me",
        "upgrade-insecure-requests"
    ].join('; '),

    // X-Frame-Options
    'X-Frame-Options': 'DENY',

    // X-Content-Type-Options
    'X-Content-Type-Options': 'nosniff',

    // X-XSS-Protection
    'X-XSS-Protection': '1; mode=block',

    // Strict-Transport-Security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // Referrer-Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions-Policy
    'Permissions-Policy': [
        'camera=("https://wa.me")',
        'microphone=()',
        'geolocation=()',
        'gyroscope=()',
        'magnetometer=()',
        'payment=()',
        'usb=()'
    ].join(', '),

    // Cross-Origin-Embedder-Policy
    'Cross-Origin-Embedder-Policy': 'require-corp',

    // Cross-Origin-Opener-Policy
    'Cross-Origin-Opener-Policy': 'same-origin',

    // Cross-Origin-Resource-Policy
    'Cross-Origin-Resource-Policy': 'same-origin'
};

// Nginx Configuration
const nginxConfig = `
# Hayali Çizgili - Security Headers Configuration
# Bu konfigürasyonu nginx sitenizde kullanın

server {
    listen 443 ssl http2;
    server_name hayalicizgili.com www.hayalicizgili.com;

    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Cross-Origin-Embedder-Policy "require-corp" always;
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header Cross-Origin-Resource-Policy "same-origin" always;

    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https: blob:; media-src 'self' blob:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.whatsapp.com; frame-src 'self' https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self' https://wa.me; upgrade-insecure-requests;" always;

    # Permissions Policy
    add_header Permissions-Policy "camera=(\"https://wa.me\"), microphone=(), geolocation=(), gyroscope=(), magnetometer=(), payment=(), usb=()" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Cache Control
    location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # Security.txt
    location = /.well-known/security.txt {
        return 301 https://hayalicizgili.com/security.txt;
    }

    # Root directory
    root /var/www/hayalicizgili.com;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name hayalicizgili.com www.hayalicizgili.com;
    return 301 https://hayalicizgili.com$request_uri;
}
`;

// Apache .htaccess Configuration
const htaccessConfig = `
# Hayali Çizgili - Security Headers Configuration
# Bu konfigürasyonu .htaccess dosyanızda kullanın

RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
<IfModule mod_headers.c>
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Cross-Origin-Embedder-Policy "require-corp"
    Header always set Cross-Origin-Opener-Policy "same-origin"
    Header always set Cross-Origin-Resource-Policy "same-origin"
    
    # Content Security Policy
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https: blob:; media-src 'self' blob:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.whatsapp.com; frame-src 'self' https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self' https://wa.me; upgrade-insecure-requests;"
    
    # Permissions Policy
    Header always set Permissions-Policy "camera=(\"https://wa.me\"), microphone=(), geolocation=(), gyroscope=(), magnetometer=(), payment=(), usb=()"
</IfModule>

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Security.txt redirect
Redirect 301 /.well-known/security.txt https://hayalicizgili.com/security.txt
`;

// Security.txt dosyası
const securityTxt = `
Contact: mailto:hayalicizgili@gmail.com
Contact: https://wa.me/908503466172
Expires: 2025-12-31T23:59:59.999Z
Encryption: https://hayalicizgili.com/pgp-key.txt
Preferred-Languages: tr, en
Canonical: https://hayalicizgili.com/.well-known/security.txt
Policy: https://hayalicizgili.com/security-policy.html
Acknowledgments: https://hayalicizgili.com/thanks.html
`;

// Export configurations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        securityHeaders,
        nginxConfig,
        htaccessConfig,
        securityTxt
    };
}

// Browser implementation for development
if (typeof window !== 'undefined') {
    console.log('🔒 Security Headers Configuration Loaded');
    console.log('📋 Available configurations:', Object.keys({ securityHeaders, nginxConfig, htaccessConfig, securityTxt }));
}