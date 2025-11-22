# Multi-stage build pour React
FROM node:22-alpine

WORKDIR /var/www/intranet-frontend

# Copier les fichiers de configuration pour les dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Variable d'environnement par défaut
ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

# Le CMD sera surchargé par docker-compose, mais défini par défaut
CMD ["npm", "run", "dev"]
