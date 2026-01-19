#!/bin/sh
set -e

# Remplacer les variables d'environnement dans nginx.conf
envsubst '${SERVER_NAME}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Démarrer nginx
exec nginx -g 'daemon off;'
