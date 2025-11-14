#!/bin/bash

# Update nginx config to serve from deploy user's home directory
# This avoids permission issues

echo "📝 Updating nginx configuration..."

# Create nginx config for NextGen
cat > /tmp/nextgen-nginx.conf << 'EOF'
server {
    listen 80;
    server_name nextgenenglish.id.vn;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name nextgenenglish.id.vn;
    
    # SSL certificates (Cloudflare managed)
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # Serve frontend
    root /home/deploy/NextGen-English/frontend/build;
    index index.html;
    
    # React Router - send all routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=0, must-revalidate" always;
    }
    
    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static assets - long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

server {
    listen 80;
    server_name api.nextgenenglish.id.vn;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.nextgenenglish.id.vn;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # API backend
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo "Config file created at /tmp/nextgen-nginx.conf"
echo ""
echo "To apply, run:"
echo "  sudo cp /tmp/nextgen-nginx.conf /etc/nginx/sites-available/nextgen"
echo "  sudo ln -sf /etc/nginx/sites-available/nextgen /etc/nginx/sites-enabled/nextgen"
echo "  sudo rm /etc/nginx/sites-enabled/default (optional)"
echo "  sudo nginx -t"
echo "  sudo systemctl reload nginx"
