FROM node:22-alpine AS deps
WORKDIR /var/www/intranet-frontend
COPY package.json package-lock.json ./
RUN npm ci

# Serveur Vite avec rechargement à chaud (docker-compose.dev.yml)
FROM deps AS dev
COPY . .
CMD ["npm", "run", "dev"]

FROM deps AS build
COPY . .
RUN npm run build

# Production : nginx embarque le frontend compilé.
FROM nginx:stable-alpine AS prod
COPY --from=build /var/www/intranet-frontend/dist /usr/share/nginx/html

# Développement : nginx relaie vers le serveur Vite.
FROM nginx:stable-alpine AS nginx-dev
