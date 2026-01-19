FROM composer:latest AS composer_bin

FROM php:8.2-fpm

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    pkg-config \
    zip \
    unzip \
    curl \
    gnupg \
    netcat-openbsd \
    libicu-dev \
    git \
    supervisor \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl mbstring dom gd zip bcmath opcache pdo pdo_mysql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer_bin /usr/bin/composer /usr/bin/composer

COPY conf/supervisor/supervisord.conf /etc/supervisor/supervisord.conf

COPY . .

RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

ENTRYPOINT ["./entrypoint.sh"]
