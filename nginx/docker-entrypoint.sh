#!/bin/sh
set -eu

# Injecte la configuration de .env et choisit la façon de servir le frontend.
envsubst '${SERVER_NAME} ${HTTPS_PORT}' < /opt/nginx/nginx.conf > /etc/nginx/nginx.conf
cp /opt/nginx/security-headers.conf /etc/nginx/security-headers.conf
cp /opt/nginx/content-security-policy.conf /etc/nginx/content-security-policy.conf
cp "/opt/nginx/frontend.${NGINX_MODE:-prod}.conf" /etc/nginx/frontend.conf

exec nginx -g 'daemon off;'
