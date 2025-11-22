#!/bin/bash
set -e

echo "=== Backend Production Container Starting ==="

echo "Setting permissions for storage and bootstrap/cache..."
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache


# Attendre que la base de données soit prête
echo "Waiting for database connection..."
until nc -z intranetDB 3306; do
    echo "Waiting for MariaDB to be ready..."
    sleep 2
done
echo "Database is ready!"

echo "Generating application keys..."
php artisan key:generate --no-interaction
php artisan jwt:secret --force

# Créer le lien de stockage
echo "Creating storage link..."
php artisan storage:link

# Exécuter les migrations
echo "Running database migrations..."
php artisan migrate --seed -n

# Nettoyer le cache
echo "Clearing cache..."
php artisan optimize:clear

echo "Starting PHP-FPM..."
exec php-fpm