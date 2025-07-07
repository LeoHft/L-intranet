#!/bin/sh
set -e

echo "=== Frontend Development Container Starting ==="

# Attendre que les dépendances soient disponibles
echo "Checking if node_modules exists..."
if [ ! -d "node_modules" ] || [ ! "$(ls -A node_modules)" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting Vite development server..."

# Démarrer le serveur de développement Vite
exec npm run dev -- --host 0.0.0.0 --port 5173
