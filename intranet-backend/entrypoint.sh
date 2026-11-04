#!/bin/bash
set -euo pipefail

if [ "${APP_ENV:-production}" != "production" ]; then
    echo "Installation des dépendances Composer (mode développement)..."
    composer install --no-interaction
    touch .env # Vide : la configuration vient de Compose, mais certains outils de test attendent ce fichier.
fi

mkdir -p storage/app/public/images storage/framework/cache/data storage/framework/sessions \
    storage/framework/views storage/logs bootstrap/cache

# Uniquement les caches de fichiers : "optimize:clear" viderait aussi le cache applicatif, et donc
# la liste noire des tokens JWT, ce qui rendrait valides les sessions déjà déconnectées.
php artisan config:clear --no-interaction
php artisan route:clear --no-interaction
php artisan view:clear --no-interaction

echo "Application des migrations..."
php artisan migrate --force --seed --no-interaction

chown -R www-data:www-data storage bootstrap/cache
find storage bootstrap/cache -type d -exec chmod 775 {} +

exec /usr/bin/supervisord -c /etc/supervisor/supervisord.conf
