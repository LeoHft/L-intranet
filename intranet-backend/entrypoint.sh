#!/bin/bash
set -e

echo "=== Backend Production Container Starting ==="

# Attendre que la base de données soit prête
echo "Waiting for database connection..."
until nc -z intranetDB 3306; do
    echo "Waiting for MariaDB to be ready..."
    sleep 2
done
echo "Database is ready!"

# Copier le fichier .env.example vers .env si .env n'existe pas
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi


# Générer la clé d'application si elle n'existe pas ou est vide
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null || grep -q "APP_KEY=$" .env 2>/dev/null || grep -q "APP_KEY=\"\"" .env 2>/dev/null; then
    echo "Generating application key..."
    php artisan key:generate --no-interaction
    php artisan jwt:secret --force
fi

# Créer le lien de stockage
echo "Creating storage link..."
php artisan storage:link

# Créer et configurer les dossiers et fichiers de logs
echo "Setting up storage and cache directories..."
touch /var/www/intranet-backend/storage/logs/laravel.log

# Changer le propriétaire des dossiers storage et bootstrap/cache pour www-data
chown -R www-data:www-data /var/www/intranet-backend/storage
chown -R www-data:www-data /var/www/intranet-backend/bootstrap/cache

# Définir les permissions appropriées
chmod -R 777 /var/www/intranet-backend/storage
chmod -R 777 /var/www/intranet-backend/bootstrap/cache


# Exécuter les migrations
echo "Running database migrations..."
php artisan migrate --seed --force -n

# Nettoyer le cache
echo "Clearing cache..."
php artisan optimize:clear

echo "Starting PHP-FPM..."
exec php-fpm