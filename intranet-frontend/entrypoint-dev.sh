#!/bin/sh
set -e

echo "=== Frontend Development Container Starting ==="

# Attendre que les dépendances soient disponibles
echo "Checking if node_modules exists..."
if [ ! -d "node_modules" ] || [ ! "$(ls -A node_modules)" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting Vite development server with HMR..."

# Démarrer le serveur de développement Vite avec HMR explicite
exec npm run dev -- --host 0.0.0.0 --port 5173 --force
