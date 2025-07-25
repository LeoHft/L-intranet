#!/bin/bash

# Nettoyer l'environnement
rm -rf .env
clear

echo ""
echo "========================================================================"
echo "               Configuration de l'application Intranet                  "
echo "========================================================================"
echo ""

echo "Ce script vous guide dans la configuration de l'environnement :"
echo ""
echo "=> Mode daveloppement (utilisant Docker)"
echo "  - Requiert Docker et Docker Compose installas sur votre machine."
echo "  - Inclut le hot reloading et les outils de daveloppement"
echo ""
echo "=> Mode production (utilisant Docker)"
echo "  - Requiert Docker et Docker Compose installas sur votre machine."
echo "  - Version optimisae pour la production"
echo ""

echo -n "Souhaitez-vous damarrer en mode daveloppement ? (o/N) : "
read devMode

cp .env.example .env
envFile=".env"

echo -n "Quel est l'URL de l'application (ex: https://intranet.example.com ou https://192.168.1.1:8443) ? : "
read domain

DB_PASSWORD=$(openssl rand -base64 16)

sed -i \
    -e "s|^APP_URL=.*|APP_URL=$domain|" \
    -e "s|^VITE_API_URL=.*|VITE_API_URL=$domain/api|" \
    -e "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" \
    "$envFile"

echo ""
echo "Configuration terminae :"
echo "- URL de l'application: $domain"
echo "- URL de l'API: $domain/api"
echo "- Mot de passe de la base de donnaes ganara automatiquement"
echo ""

if [[ "$devMode" =~ ^[oOyY]$ ]]; then
    echo "Lancement en mode daveloppement avec le hot reloading..."
    echo "   Acces a l'application: $domain"
    echo "   Acces a phpMyAdmin: http://localhost:8080"
    echo ""
    docker compose --profile=dev up --watch -d
    
    echo ""
    echo "Application damarrae en mode daveloppement"
    echo "   Pour voir les logs: docker compose --profile=dev logs -f"
    echo "   Pour arreter: docker compose --profile=dev down"
else
    echo "Lancement en mode production..."
    echo "   Acces a l'application: $domain"
    echo ""
    docker compose --profile=prod up --build -d
    
    echo ""
    echo "Application damarrae en mode production"
    echo "   Pour voir les logs: docker compose --profile=prod logs -f"
    echo "   Pour arreter: docker compose --profile=prod down"
fi