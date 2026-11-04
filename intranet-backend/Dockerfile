FROM composer:2 AS composer_bin

FROM php:8.4-fpm-bookworm AS base
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y --no-install-recommends \
        libpng-dev libjpeg-dev libonig-dev libxml2-dev libzip-dev libicu-dev \
        unzip git supervisor \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl mbstring dom gd zip bcmath opcache pdo_mysql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer_bin /usr/bin/composer /usr/bin/composer
COPY conf/supervisor/supervisord.conf /etc/supervisor/supervisord.conf
COPY conf/php/php.ini /usr/local/etc/php/conf.d/zz-intranet.ini
COPY entrypoint.sh /usr/local/bin/intranet-entrypoint.sh

ENTRYPOINT ["bash", "/usr/local/bin/intranet-entrypoint.sh"]

# Développement : le code est monté depuis l'hôte.
FROM base AS dev

# Production : image autonome.
FROM base AS prod
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction --prefer-dist
COPY . .
RUN mkdir -p bootstrap/cache \
    && composer dump-autoload --optimize --no-dev --no-interaction \
    && rm -f /usr/bin/composer
