#!/bin/bash
set -e

echo "=== Backend Development Container Starting ==="

# Attendre que la base de données soit prête
echo "Waiting for database connection..."
until nc -z intranetDB 3306; do
    echo "Waiting for MariaDB to be ready..."
    sleep 2
done
echo "Database is ready!"

# Installer les dépendances si vendor n'existe pas
if [ ! -d "vendor" ] || [ ! "$(ls -A vendor)" ]; then
    echo "Installing PHP dependencies..."
    composer install --no-dev --optimize-autoloader
fi

# Installer les dépendances Node.js si node_modules n'existe pas
if [ ! -d "node_modules" ] || [ ! "$(ls -A node_modules)" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

# Générer la clé d'application si elle n'existe pas ou est vide
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null || grep -q "APP_KEY=$" .env 2>/dev/null || grep -q "APP_KEY=\"\"" .env 2>/dev/null; then
    echo "Generating application key..."
    php artisan key:generate --no-interaction
fi

# Créer le lien de stockage
echo "Creating storage link..."
php artisan storage:link

# Exécuter les migrations
echo "Running database migrations..."
php artisan migrate --force

# Optionnel : Seeder en développement
if [ "$APP_ENV" = "local" ]; then
    echo "Running database seeders..."
    php artisan db:seed --force || echo "No seeders found or seeding failed"
fi

# Nettoyer le cache
echo "Clearing cache..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear

echo "Starting Laravel development server..."
exec php artisan serve --host=0.0.0.0 --port=8000