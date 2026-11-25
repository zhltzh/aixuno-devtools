#!/usr/bin/env bash
# aizak.cn 首次部署脚本（在服务器上以 root 运行）
set -e

# 1. 目录
mkdir -p /var/www/aizak

# 2. nginx 配置
cp aizak.conf /etc/nginx/sites-available/aizak.conf
ln -sf /etc/nginx/sites-available/aizak.conf /etc/nginx/sites-enabled/aizak.conf

# 3. 先用 http 配置签证书（certbot 会自动改写 ssl 路径）
sed -i 's|listen 443 ssl http2;|# listen 443 ssl http2;|' /etc/nginx/sites-available/aizak.conf
sed -i 's|ssl_certificate|# ssl_certificate|' /etc/nginx/sites-available/aizak.conf
sed -i 's|ssl_certificate_key|# ssl_certificate_key|' /etc/nginx/sites-available/aizak.conf
nginx -t && systemctl reload nginx

# 4. 签发证书（自动续期）
certbot --nginx -d aizak.cn -d www.aizak.cn --non-interactive --agree-tos -m admin@aizak.cn

echo "DONE — upload dist/ to /var/www/aizak"
