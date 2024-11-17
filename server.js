server {
    listen 0.0.0.0:80;
    server_name nicknameportal.shop www.nicknameportal.shop;
    return 301 https://nicknameportal.shop$request_uri;
}

server {
    listen 0.0.0.0:443 ssl;
    server_name www.nicknameportal.shop;
    access_log /var/log/nginx/domain.log;

    ssl_certificate /etc/letsencrypt/live/nicknameportal.shop/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nicknameportal.shop/privkey.pem;
    ssl_prefer_server_ciphers on;
    return 301 https://nicknameportal.shop$request_uri;
}

server {
    listen 0.0.0.0:443 default_server ssl;
    server_name nicknameportal.shop;
    access_log /var/log/nginx/domain.log;

    ssl_certificate /etc/letsencrypt/live/nicknameportal.shop/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nicknameportal.shop/privkey.pem;
    ssl_prefer_server_ciphers on;

    try_files $uri $uri/ =404;

    # Frontend - Main app
    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://localhost:5175;
        proxy_redirect off;
    }

    # Admin dashboard
    location /Admin/ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://localhost:5173;
        proxy_redirect off;

        # Serve static files and index.html for SPA
        try_files $uri /index.html;
    }

    # Backend API
    location /Backend/ {
        rewrite ^/Backend/(.*)$ /$1 break; # Strip /Backend from the URL
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://localhost:5000/;
        proxy_redirect off;
    }
}
