# Multi-stage build pour React
FROM node:22-alpine AS base

WORKDIR /var/www/frontend

# Copier les fichiers de configuration pour les dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Stage de développement
FROM base AS development

# Copier le code source
COPY . .

# # Exposer le port pour Vite dev server
# EXPOSE 5173

# Créer un entrypoint pour le développement
COPY entrypoint-dev.sh /entrypoint-dev.sh
RUN chmod +x /entrypoint-dev.sh

ENTRYPOINT ["/entrypoint-dev.sh"]

# Stage de production
FROM base AS production

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

