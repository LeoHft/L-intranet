FROM php:8.2-fpm AS base

# Définir le répertoire de travail
WORKDIR /var/www/intranet-backend

COPY . .

# Installation des dépendances système et PHP
RUN apt-get update \
  && apt-get install -y build-essential libpng-dev libjpeg-dev libonig-dev \
     libxml2-dev libzip-dev pkg-config zip unzip curl gnupg netcat-openbsd \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs

# Installation de composer
RUN curl -sLS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer \
  && docker-php-ext-configure intl \
  && docker-php-ext-install intl mbstring dom gd zip bcmath opcache pdo \
  && docker-php-ext-install mysqli pdo_mysql \
  && apt-get -y autoremove  \
  && apt-get clean  \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# Stage de développement
FROM base AS development

# Installer les dépendances PHP et Node.js
RUN composer install --no-scripts --no-autoloader \
    && npm install

# Configurer l'entrypoint
RUN sed -i 's/\r$//' ./entrypoint-dev.sh
RUN chmod +x ./entrypoint-dev.sh

ENTRYPOINT ["./entrypoint-dev.sh"]

# Stage de production
FROM base AS production

# Installation des dépendances (sans dev) et build
RUN composer install --no-dev \
  && npm ci

RUN npm run build

# Configurer l'entrypoint
RUN sed -i 's/\r$//' ./entrypoint-prod.sh
RUN chmod +x ./entrypoint-prod.sh

ENTRYPOINT ["./entrypoint-prod.sh"]
