# Multi-stage build pour React
FROM node:22-alpine AS base

WORKDIR /var/www/intranet-frontend

# Copier les fichiers de configuration pour les dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Stage de développement
FROM base AS development

# Copier le code source
COPY . .

# Créer un entrypoint pour le développement
COPY entrypoint-dev.sh ./entrypoint-dev.sh
# Convertir les fins de ligne Windows (CRLF) en Unix (LF)
RUN sed -i 's/\r$//' ./entrypoint-dev.sh
RUN chmod +x ./entrypoint-dev.sh

# Le script sera accessible via le volume mount
ENTRYPOINT ["/bin/sh", "./entrypoint-dev.sh"]

# Stage de production
FROM base AS production

# Copier le code sourced
COPY . .

# Build de l'application
RUN npm run build

