# Multi-stage build pour React
FROM node:22-alpine AS base

WORKDIR /var/www/frontend

# Copier les fichiers de configuration pour les dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production && npm cache clean --force

# Stage de développement
FROM base AS development

# Installer toutes les dépendances (dev incluses)
RUN npm ci

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

# Stage final pour la production avec nginx
FROM nginx:alpine AS production-final

# Copier les fichiers buildés
COPY --from=production /var/www/frontend/dist /usr/share/nginx/html

# Configuration nginx simple pour SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
